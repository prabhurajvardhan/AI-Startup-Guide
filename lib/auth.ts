import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import db from './db';

const SESSION_COOKIE_NAME = 'kit_session';
const SESSION_EXPIRATION_DAYS = 30;

export interface UserSession {
  id: string;
  google_id: string;
  name: string;
  email: string;
  picture: string | null;
  role: string;
}

export async function createSession(userId: string) {
  const sessionId = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRATION_DAYS);

  const stmt = db.prepare(`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (?, ?, ?)
  `);
  stmt.run(sessionId, userId, expiresAt.toISOString());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return sessionId;
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) return null;

  const stmt = db.prepare(`
    SELECT u.*, s.expires_at 
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ?
  `);
  
  const result = stmt.get(sessionId) as any;

  if (!result) return null;

  if (new Date(result.expires_at) < new Date()) {
    // Session expired
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    return null;
  }

  return {
    id: result.id,
    google_id: result.google_id,
    name: result.name,
    email: result.email,
    picture: result.picture,
    role: result.role,
  };
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (sessionId) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
  }
  
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(): Promise<UserSession> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireAdmin(): Promise<UserSession> {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'owner')) {
    throw new Error('Unauthorized');
  }
  return session;
}

export function logAudit(actorId: string, action: string, resource: string, metadata?: any) {
  try {
    const stmt = db.prepare(`
      INSERT INTO audit_logs (actor_id, action, resource, metadata)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(actorId, action, resource, metadata ? JSON.stringify(metadata) : null);
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

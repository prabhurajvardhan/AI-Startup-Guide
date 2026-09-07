import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { createSession, logAudit } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: 'Missing credential' }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
    
    if (!clientId) {
      return NextResponse.json({ error: 'Server configuration error: Missing Google Client ID' }, { status: 500 });
    }

    const client = new OAuth2Client(clientId);

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub) {
      return NextResponse.json({ error: 'Invalid Google token payload' }, { status: 400 });
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || email.split('@')[0];
    const picture = payload.picture || null;

    // Check if user exists
    let user = db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId) as any;

    if (!user) {
      // Create new user
      const userId = uuidv4();
      
      // Determine if first user (make them owner)
      const usersCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count;
      const role = usersCount === 0 ? 'owner' : 'customer';

      const stmt = db.prepare(`
        INSERT INTO users (id, google_id, name, email, picture, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(userId, googleId, name, email, picture, role);

      user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      
      logAudit(userId, 'USER_REGISTERED', 'users', { provider: 'google', email });
    } else {
      // Update last login
      db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
      
      // Optionally update name/picture if changed?
      // ...
    }

    // Create session
    await createSession(user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

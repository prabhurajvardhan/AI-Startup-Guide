import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stmt = db.prepare(`SELECT * FROM reviews WHERE approved = 1 ORDER BY created_at DESC LIMIT 10`);
    const reviews = stmt.all();
    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'You must be signed in to leave a review.' }, { status: 401 });
    }

    const data = await req.json();
    let { name, role, rating, useful, built, testimonial, profile, consent } = data;

    if (!name || !role || !rating || !useful || !built || !testimonial || !consent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Basic XSS/Spam protection by stripping out tags and limiting length
    testimonial = String(testimonial).replace(/<[^>]*>?/gm, '').substring(0, 1000);
    name = String(name).replace(/<[^>]*>?/gm, '').substring(0, 100);
    role = String(role).replace(/<[^>]*>?/gm, '').substring(0, 100);
    rating = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));

    if (!consent) {
      return NextResponse.json({ error: 'Consent to publish is required' }, { status: 400 });
    }

    const existing = db.prepare(`SELECT count(*) as count FROM reviews WHERE name = ? AND created_at > datetime('now', '-1 day')`).get(name) as { count: number };
    if (existing.count > 0) {
       return NextResponse.json({ error: 'You have already submitted a review recently.' }, { status: 429 });
    }

    const stmt = db.prepare(`
      INSERT INTO reviews (name, role, rating, useful, built, testimonial, profile, consent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(name, role, rating, useful, built, testimonial, profile || '', consent ? 1 : 0);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Submit review error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import db from '@/lib/db';

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
    const data = await req.json();
    const { name, role, rating, useful, built, testimonial, profile, consent } = data;

    if (!name || !role || !rating || !useful || !built || !testimonial || !consent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ error: 'Consent to publish is required' }, { status: 400 });
    }

    const stmt = db.prepare(`
      INSERT INTO reviews (name, role, rating, useful, built, testimonial, profile, consent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(name, role, parseInt(rating, 10), useful, built, testimonial, profile || '', consent ? 1 : 0);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Submit review error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

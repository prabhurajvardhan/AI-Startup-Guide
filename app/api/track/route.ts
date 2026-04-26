import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { path } = await req.json();

    if (path) {
      const stmt = db.prepare(`INSERT INTO visitors (path) VALUES (?)`);
      stmt.run(path);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Track error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

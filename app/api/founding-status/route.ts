import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const countStmt = db.prepare(`SELECT count(*) as count FROM purchases WHERE product_type = 'founding' AND status = 'completed'`);
    const row = countStmt.get() as { count: number };
    
    return NextResponse.json({ claimed: row.count, remaining: Math.max(0, 50 - row.count) });
  } catch (error: any) {
    console.error('Founding status error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

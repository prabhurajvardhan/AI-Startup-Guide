import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const stmt = db.prepare(`
      SELECT id, name, email, product_type, status, referral_code 
      FROM purchases 
      WHERE id = ? AND status = 'completed'
    `);
    
    const purchase = stmt.get(id);

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found or not completed' }, { status: 404 });
    }

    return NextResponse.json(purchase);
  } catch (error: any) {
    console.error('Get purchase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

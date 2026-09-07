import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();

    const stmt = db.prepare(`
      SELECT id, name, email, product_type, status, referral_code, user_id 
      FROM purchases 
      WHERE id = ? AND status = 'completed'
    `);
    
    const purchase = stmt.get(id) as any;

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found or not completed' }, { status: 404 });
    }

    // Require auth if the purchase belongs to a user
    if (purchase.user_id && (!session || session.id !== purchase.user_id)) {
        return NextResponse.json({ error: 'Unauthorized: This purchase belongs to another account. Please sign in.' }, { status: 403 });
    }

    // Remove user_id before sending to client
    delete purchase.user_id;

    return NextResponse.json(purchase);
  } catch (error: any) {
    console.error('Get purchase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { name, email, ref } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Wrap the counting and insertion in a transaction to prevent race conditions
    const claimFoundingSlot = db.transaction(() => {
      // Get the number of currently completed founding kits
      const countStmt = db.prepare(`SELECT count(*) as count FROM purchases WHERE product_type = 'founding' AND status = 'completed'`);
      const row = countStmt.get() as { count: number };
      
      if (row.count >= 50) {
        throw new Error('All 50 Founding slots have been claimed.');
      }
      
      // Also check if this email already claimed one to prevent abuse (optional but good)
      const existingStmt = db.prepare(`SELECT count(*) as count FROM purchases WHERE email = ? AND (product_type = 'founding' OR product_type = 'kit') AND status = 'completed'`);
      const existing = existingStmt.get(email) as { count: number };
      if (existing.count > 0) {
        throw new Error('This email has already claimed a kit.');
      }

      const purchaseId = uuidv4();
      const referralCode = uuidv4().substring(0, 8);
      
      const insertStmt = db.prepare(`
        INSERT INTO purchases (id, name, email, amount, product_type, status, razorpay_order_id, referral_code, referred_by, quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      insertStmt.run(purchaseId, name, email, 0, 'founding', 'completed', 'founding_free_' + purchaseId, referralCode, ref || null, 1);
      
      return purchaseId;
    });

    let purchaseId;
    try {
      purchaseId = claimFoundingSlot();
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, purchaseId });

  } catch (error: any) {
    console.error('Claim founding error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, purchaseId } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !purchaseId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update purchase status
      const stmt = db.prepare(`
        UPDATE purchases 
        SET status = 'completed', razorpay_payment_id = ? 
        WHERE id = ?
      `);
      stmt.run(razorpay_payment_id || 'mock_payment_id', purchaseId);

      // Check if there was a referrer and record it
      const purchaseStmt = db.prepare(`SELECT referred_by FROM purchases WHERE id = ?`);
      const purchase = purchaseStmt.get(purchaseId) as { referred_by: string | null };

      if (purchase && purchase.referred_by) {
        const refStmt = db.prepare(`
          INSERT INTO referrals (referrer_code, referred_purchase_id)
          VALUES (?, ?)
        `);
        refStmt.run(purchase.referred_by, purchaseId);
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

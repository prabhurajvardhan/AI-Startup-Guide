import { NextResponse } from 'next/server';
import crypto from 'crypto';
import db from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, purchaseId } = await req.json();

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // If we are using mock keys or mock order, just approve it
    let isAuthentic = false;

    if (razorpay_order_id && razorpay_order_id.startsWith('mock_order_')) {
      isAuthentic = true;
    } else if (!key_secret || key_secret === 'your_key_secret') {
      // Fallback if no real secret is provided
      isAuthentic = true;
    } else if (razorpay_signature) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(body.toString())
        .digest("hex");

      isAuthentic = expectedSignature === razorpay_signature;
    }

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

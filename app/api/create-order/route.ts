import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    let { plan, name, email, ref, quantity = 1 } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Security fix: Ensure quantity is a valid integer >= 1
    quantity = Math.max(1, Math.floor(Number(quantity) || 1));

    let baseAmount = 1900; // default mini
    let productType = 'mini';
    
    if (plan === 'full') {
      baseAmount = 49900;
      productType = 'full';
    } else if (plan === 'guide') {
      baseAmount = 1000;
      productType = 'guide';
    } else if (plan === 'kit') {
      baseAmount = 28900;
      productType = 'kit';
    }
    
    const amount = baseAmount * quantity; // Amount in paise
    
    if (amount < 100) {
      return NextResponse.json({ error: 'Amount must be at least 100 paise' }, { status: 400 });
    }

    // Initialize Razorpay
    const key_id = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").trim();
    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
    
    if (!key_id || !key_secret) {
      return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
    }

    const purchaseId = uuidv4();

    let orderId = '';

    try {
      const razorpay = new Razorpay({
        key_id,
        key_secret,
      });

      const options = {
        amount,
        currency: 'INR',
        receipt: purchaseId,
      };

      const order = await razorpay.orders.create(options);
      orderId = order.id;
    } catch (rzpErr: any) {
      // Intentionally omitting console.error to avoid Next.js dev overlay for invalid keys
      if (rzpErr.statusCode === 401) {
        return NextResponse.json({ error: 'Razorpay authentication failed: ' + (rzpErr.error?.description || rzpErr.message) }, { status: 401 });
      }
      return NextResponse.json({ error: 'Razorpay error: ' + (rzpErr.error?.description || rzpErr.message) }, { status: rzpErr.statusCode || 500 });
    }

    // Generate a referral code for this user
    const referralCode = uuidv4().substring(0, 8);

    // Save initial purchase record as pending
    const stmt = db.prepare(`
      INSERT INTO purchases (id, name, email, amount, product_type, status, razorpay_order_id, referral_code, referred_by, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(purchaseId, name, email, amount / 100, productType, 'pending', orderId, referralCode, ref || null, quantity);

    return NextResponse.json({
      id: orderId,
      amount,
      currency: 'INR',
      purchaseId,
      key_id: key_id || 'rzp_test_your_key_id'
    });

  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

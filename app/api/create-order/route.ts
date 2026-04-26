import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { plan, name, email, ref, quantity = 1 } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const isFullPlan = plan === 'full';
    const amount = (isFullPlan ? 49900 : 1900) * quantity; // Amount in paise
    const productType = isFullPlan ? 'full' : 'mini';
    
    // Initialize Razorpay
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    const purchaseId = uuidv4();

    let orderId = `mock_order_${Date.now()}`;

    if (key_id && key_secret && key_id !== 'rzp_test_your_key_id') {
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
        throw rzpErr;
      }
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

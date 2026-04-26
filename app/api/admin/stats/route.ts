import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const visitorsStmt = db.prepare(`SELECT COUNT(*) as count FROM visitors`);
    const visitors = visitorsStmt.get() as { count: number };

    const salesStmt = db.prepare(`SELECT COUNT(*) as count, SUM(amount) as revenue FROM purchases WHERE status = 'completed'`);
    const sales = salesStmt.get() as { count: number, revenue: number | null };

    const referralsStmt = db.prepare(`SELECT COUNT(*) as count FROM referrals`);
    const referrals = referralsStmt.get() as { count: number };

    const recentPurchasesStmt = db.prepare(`
      SELECT name, email, amount, product_type, created_at 
      FROM purchases 
      WHERE status = 'completed' 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    const recentPurchases = recentPurchasesStmt.all();

    const topReferrersStmt = db.prepare(`
      SELECT referrer_code, COUNT(*) as count 
      FROM referrals 
      GROUP BY referrer_code 
      ORDER BY count DESC 
      LIMIT 5
    `);
    const topReferrers = topReferrersStmt.all();

    return NextResponse.json({
      visitors: visitors.count,
      sales: sales.count,
      revenue: sales.revenue || 0,
      referrals: referrals.count,
      recentPurchases,
      topReferrers
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

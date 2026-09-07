import { requireAdmin } from '@/lib/auth';
import db from '@/lib/db';
import { Users, CreditCard, TrendingUp, Link as LinkIcon } from 'lucide-react';

export default async function AdminDashboard() {
  await requireAdmin();

  const usersCount = (db.prepare('SELECT count(*) as count FROM users').get() as any).count;
  const purchasesCount = (db.prepare('SELECT count(*) as count FROM purchases WHERE status = "completed"').get() as any).count;
  const revenue = (db.prepare('SELECT SUM(amount) as total FROM purchases WHERE status = "completed"').get() as any).total || 0;
  const pendingReviews = (db.prepare('SELECT count(*) as count FROM reviews WHERE approved = 0').get() as any).count;

  const recentPurchases = db.prepare('SELECT * FROM purchases WHERE status = "completed" ORDER BY created_at DESC LIMIT 5').all() as any[];
  const recentLogs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 5').all() as any[];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
          <p className="text-sm text-neutral-400 mb-1">Total Users</p>
          <p className="text-3xl font-bold">{usersCount}</p>
        </div>
        
        <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
          <p className="text-sm text-neutral-400 mb-1">Total Sales</p>
          <p className="text-3xl font-bold">{purchasesCount}</p>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
          <p className="text-sm text-neutral-400 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-emerald-400">₹{revenue}</p>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
          <p className="text-sm text-neutral-400 mb-1">Pending Reviews</p>
          <p className="text-3xl font-bold text-amber-400">{pendingReviews}</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h3 className="font-display text-xl font-bold mb-6">Recent Purchases</h3>
          <div className="space-y-4">
            {recentPurchases.length > 0 ? (
              recentPurchases.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-white/5">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-neutral-500">{p.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">₹{p.amount}</p>
                    <p className="text-xs text-neutral-500">{p.product_type}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 text-center py-4">No purchases yet.</p>
            )}
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h2 className="font-display text-xl font-bold mb-6">Recent Audit Logs</h2>
          <div className="space-y-4">
            {recentLogs.length > 0 ? (
              recentLogs.map((log: any, i: number) => (
                <div key={i} className="p-4 bg-neutral-950 rounded-xl border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs">{log.action}</span>
                    <span className="text-xs text-neutral-500">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm">Resource: {log.resource}</p>
                  <p className="text-xs font-mono text-neutral-500 mt-1">Actor: {log.actor_id.substring(0,8)}...</p>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 text-center py-4">No audit logs yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

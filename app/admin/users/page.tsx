import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import db from '@/lib/db';

export default async function AdminUsers() {
  try {
    await requireAdmin();
  } catch (error) {
    redirect('/');
  }

  const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as any[];
  const purchases = db.prepare('SELECT * FROM purchases ORDER BY created_at DESC').all() as any[];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Users & Purchases</h1>
      
      <div className="grid xl:grid-cols-2 gap-8">
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Registered Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10 text-neutral-400">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">{u.name}</td>
                    <td className="p-4 text-neutral-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' || u.role === 'owner' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">All Purchases</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10 text-neutral-400">
                <tr>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {purchases.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">{p.email}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs bg-indigo-500/20 text-indigo-400">{p.product_type}</span>
                    </td>
                    <td className="p-4 font-medium text-emerald-400">₹{p.amount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${p.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-500/20 text-neutral-400'}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

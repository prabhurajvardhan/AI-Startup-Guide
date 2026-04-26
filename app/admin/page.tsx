"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, CreditCard, TrendingUp, Link as LinkIcon } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">Loading dashboard...</div>;
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-neutral-400">Overview of your AI Startup Launch Pack sales.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-neutral-400 font-medium">Total Visitors</h3>
            </div>
            <p className="text-3xl font-bold">{stats?.visitors || 0}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-900 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-neutral-400 font-medium">Total Sales</h3>
            </div>
            <p className="text-3xl font-bold">{stats?.sales || 0}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-900 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-neutral-400 font-medium">Revenue</h3>
            </div>
            <p className="text-3xl font-bold">₹{stats?.revenue || 0}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-neutral-900 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                <LinkIcon className="w-5 h-5" />
              </div>
              <h3 className="text-neutral-400 font-medium">Referrals</h3>
            </div>
            <p className="text-3xl font-bold">{stats?.referrals || 0}</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold mb-6">Recent Purchases</h3>
            <div className="space-y-4">
              {stats?.recentPurchases?.length > 0 ? (
                stats.recentPurchases.map((p: any, i: number) => (
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
            <h3 className="font-display text-xl font-bold mb-6">Top Referrers</h3>
            <div className="space-y-4">
              {stats?.topReferrers?.length > 0 ? (
                stats.topReferrers.map((r: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                        {i + 1}
                      </div>
                      <p className="font-medium font-mono">{r.referrer_code}</p>
                    </div>
                    <p className="font-bold">{r.count} sales</p>
                  </div>
                ))
              ) : (
                <p className="text-neutral-500 text-center py-4">No referrals yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

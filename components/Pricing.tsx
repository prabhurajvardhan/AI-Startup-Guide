"use client";

import { motion } from "motion/react";
import { ShieldCheck, Zap, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Pricing() {
  const router = useRouter();
  const [foundingStats, setFoundingStats] = useState({ claimed: 0, remaining: 50, loading: true });
  const [claiming, setClaiming] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(console.error);

    // Fetch founding status
    fetch('/api/founding-status')
      .then(res => res.json())
      .then(data => {
        setFoundingStats({ claimed: data.claimed, remaining: data.remaining, loading: false });
      })
      .catch(err => {
        setFoundingStats(prev => ({ ...prev, loading: false }));
      });
  }, []);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in with Google (top right) to claim a Founding 50 slot.");
      return;
    }
    setClaiming(true);
    
    try {
      const res = await fetch('/api/claim-founding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, email: user.email })
      });
      const data = await res.json();
      
      if (data.success) {
        router.push(`/success?id=${data.purchaseId}`);
      } else {
        alert(data.error || 'Failed to claim');
        setClaiming(false);
      }
    } catch (err) {
      alert("Network error");
      setClaiming(false);
    }
  };

  return (
    <section className="py-24 relative" id="pricing">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Main Kit Pack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative p-1 rounded-3xl bg-gradient-to-b from-indigo-500 to-purple-500"
          >
            <div className="bg-neutral-950 rounded-[22px] p-8 md:p-12 text-center h-full flex flex-col">
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6 self-center">
                <Zap className="w-4 h-4" />
                <span>Immediate Access</span>
              </div>
              
              <h2 className="font-display text-3xl font-bold mb-2">The ML Engineer Kit</h2>
              <p className="text-neutral-400 mb-8">
                Source Engine • Practice Engine • Open-Source Engine
              </p>
              
              <div className="flex items-baseline justify-center gap-3 mb-2 mt-auto">
                <span className="font-display text-5xl font-extrabold">₹289</span>
                <span className="text-neutral-500 line-through text-2xl">₹600</span>
              </div>
              <p className="text-green-400 font-medium mb-8">SAVE ₹311</p>

              <div className="text-left space-y-3 mb-8 px-4 text-neutral-300">
                <div className="flex items-center gap-3"><CheckIcon /> <span>150+ Curated Learning Sources</span></div>
                <div className="flex items-center gap-3"><CheckIcon /> <span>150+ Progressive Practice Missions</span></div>
                <div className="flex items-center gap-3"><CheckIcon /> <span>Real Open-Source Repository Labs</span></div>
                <div className="flex items-center gap-3"><CheckIcon /> <span>AI Mentor Workflows</span></div>
              </div>

              <a href="/checkout?plan=kit" className="block w-full py-4 px-8 rounded-xl bg-white text-neutral-950 font-bold text-lg hover:bg-neutral-200 transition-colors mb-6 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                GET THE KIT — ₹289
              </a>
              <div className="flex flex-col items-center gap-3 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span>Secure payment via Razorpay</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Founding 50 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative p-1 rounded-3xl bg-white/5 border border-white/10"
          >
            <div className="bg-neutral-900 rounded-[22px] p-8 md:p-12 text-center h-full flex flex-col">
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6 self-center border border-amber-500/20">
                <span>FOUNDING 50</span>
              </div>
              
              <h2 className="font-display text-3xl font-bold mb-4">First 50 Learners</h2>
              <p className="text-neutral-400 mb-6">
                We&apos;re giving the complete ML Engineer Kit for free to the first 50 learners who will actually use it and provide honest feedback.
              </p>
              
              <div className="flex items-baseline justify-center gap-2 mb-8 mt-auto">
                <span className="font-display text-5xl font-extrabold text-white">FREE</span>
              </div>

              {!foundingStats.loading && foundingStats.remaining > 0 ? (
                <form onSubmit={handleClaim} className="space-y-4 mb-6">
                  {user ? (
                    <div className="mb-4 text-sm text-neutral-300">
                      Logged in as <span className="font-bold text-white">{user.email}</span>
                    </div>
                  ) : (
                    <div className="mb-4 text-sm text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                      Please sign in with Google (top right) to claim your spot.
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={claiming || !user}
                    className="w-full py-4 px-8 rounded-xl bg-amber-500 text-neutral-950 font-bold text-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {claiming ? 'Claiming...' : 'CLAIM FOUNDING ACCESS'}
                  </button>
                  <p className="text-amber-400 text-sm font-medium">
                    {foundingStats.remaining} / 50 spots remaining
                  </p>
                </form>
              ) : !foundingStats.loading ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 py-4 px-6 rounded-xl mb-6 font-medium">
                  All 50 founding spots have been claimed.
                </div>
              ) : (
                <div className="py-8 text-neutral-500">Checking availability...</div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
      <Zap className="w-3 h-3 text-indigo-400" />
    </div>
  );
}

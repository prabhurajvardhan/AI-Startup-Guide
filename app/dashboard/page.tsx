import { requireAuth } from '@/lib/auth';
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Download, Play, BookOpen, MessageSquare } from 'lucide-react';

export default async function DashboardPage() {
  const session = await requireAuth().catch(() => null);

  if (!session) {
    redirect('/');
  }

  // Fetch user's purchases
  const purchases = db.prepare(`
    SELECT * FROM purchases 
    WHERE user_id = ? AND status = 'completed'
    ORDER BY created_at DESC
  `).all(session.id) as any[];

  // Determine if they own the kit
  const ownsKit = purchases.some(p => p.product_type === 'kit' || p.product_type === 'founding');
  const ownsGuide = purchases.some(p => p.product_type === 'guide' || p.product_type === 'full');

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Welcome back, {session.name.split(' ')[0]}</h1>
          <p className="text-neutral-400">Access your ML Engineer Kit resources and downloads here.</p>
        </div>

        {ownsKit || ownsGuide ? (
          <div className="grid md:grid-cols-2 gap-6">
            {ownsKit && (
              <>
                <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 flex flex-col">
                  <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">The Source Engine</h3>
                  <p className="text-neutral-400 mb-6 flex-grow">150+ curated concept-wise learning sources to master ML fundamentals.</p>
                  <a href="/api/download?file=source" className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-white text-neutral-950 rounded-xl font-medium hover:bg-neutral-200 transition-colors">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </div>

                <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 flex flex-col">
                  <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-6">
                    <Play className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">The Practice Engine</h3>
                  <p className="text-neutral-400 mb-6 flex-grow">150+ progressive practice missions to apply what you&apos;ve learned.</p>
                  <a href="/api/download?file=practice" className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-white text-neutral-950 rounded-xl font-medium hover:bg-neutral-200 transition-colors">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </div>

                <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 flex flex-col md:col-span-2">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-xl font-bold mb-2">Open-Source Engine</h3>
                      <p className="text-neutral-400">Real ML repositories, issues, and contribution paths.</p>
                    </div>
                    <div className="w-full md:w-auto shrink-0">
                      <a href="/api/download?file=opensource" className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 bg-white text-neutral-950 rounded-xl font-medium hover:bg-neutral-200 transition-colors">
                        <Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!ownsKit && ownsGuide && (
              <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 flex flex-col">
                <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Startup Guide</h3>
                <p className="text-neutral-400 mb-6 flex-grow">Your purchased guide PDF.</p>
                <a href="/api/download?type=guide" className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-white text-neutral-950 rounded-xl font-medium hover:bg-neutral-200 transition-colors">
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              </div>
            )}
            
            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6 md:col-span-2 mt-4 text-center">
              <h3 className="text-xl font-bold mb-4 text-indigo-300">How are we doing?</h3>
              <p className="text-neutral-300 mb-6 max-w-xl mx-auto">Your feedback helps us improve the kit for everyone. Share your thoughts or submit a testimonial.</p>
              <Link href="/success" className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                <MessageSquare className="w-4 h-4" />
                Leave Feedback
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-neutral-900/50 border border-white/5 rounded-3xl">
            <h2 className="text-2xl font-bold mb-4">No purchases found</h2>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto">You haven&apos;t unlocked the ML Engineer Kit yet. Join the Founding 50 or purchase to get access.</p>
            <Link href="/#pricing" className="inline-flex py-3 px-6 bg-white text-neutral-950 font-medium rounded-xl hover:bg-neutral-200 transition-colors">
              View Plans
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

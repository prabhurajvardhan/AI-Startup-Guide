"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle, Download, Copy, Share2 } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const [purchase, setPurchase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      fetch(`/api/purchase/${id}`)
        .then(res => res.json())
        .then(data => {
          if (!isMounted) return;
          if (data.error) {
            setError(data.error);
          } else {
            setPurchase(data);
          }
          setLoading(false);
        })
        .catch(err => {
          if (!isMounted) return;
          setError("Failed to load purchase details");
          setLoading(false);
        });
    } else {
      // Avoid calling setState directly in effect if possible, but here we need it.
      // We can just use a timeout to defer it.
      setTimeout(() => {
        if (!isMounted) return;
        setError("No purchase ID provided");
        setLoading(false);
      }, 0);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDownload = async (file: string) => {
    window.open(`/api/download?id=${id}&file=${file}`, '_blank');
  };

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${purchase?.referral_code}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="text-center text-neutral-400">Loading your purchase...</div>;
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-4">
          {error}
        </div>
      </div>
    );
  }

  const isFullPlan = purchase.product_type === 'full';
  const isGuidePlan = purchase.product_type === 'guide';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-400 mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="font-display text-4xl font-bold mb-4">Payment Successful 🎉</h1>
        <p className="text-xl text-neutral-400">
          Thank you, {purchase.name}! Your startup journey begins now.
        </p>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 mb-8">
        <h2 className="font-display text-2xl font-bold mb-6">Your Downloads</h2>
        
        <div className="space-y-4">
          {isGuidePlan ? (
            <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-white/5">
              <div>
                <p className="font-medium">10rs Startup Guide</p>
                <p className="text-sm text-neutral-500">PDF Guide</p>
              </div>
              <button 
                onClick={() => handleDownload('guide')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-white/5">
                <div>
                  <p className="font-medium">90-Day Startup Roadmap</p>
                  <p className="text-sm text-neutral-500">PDF Guide</p>
                </div>
                <button 
                  onClick={() => handleDownload('roadmap')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-white/5">
                <div>
                  <p className="font-medium">Marketing Strategy Guide</p>
                  <p className="text-sm text-neutral-500">PDF Guide</p>
                </div>
                <button 
                  onClick={() => handleDownload('marketing')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>

              {isFullPlan && (
                <>
                  <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-white/5">
                    <div>
                      <p className="font-medium">AI Tools List & Idea Framework</p>
                      <p className="text-sm text-neutral-500">PDF Guide</p>
                    </div>
                    <button 
                      onClick={() => handleDownload('tools')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-white/5">
                    <div>
                      <p className="font-medium">App Launch Checklist</p>
                      <p className="text-sm text-neutral-500">PDF Guide</p>
                    </div>
                    <button 
                      onClick={() => handleDownload('checklist')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-white/5">
                    <div>
                      <p className="font-medium">10rs Startup Guide</p>
                      <p className="text-sm text-neutral-500">PDF Guide</p>
                    </div>
                    <button 
                      onClick={() => handleDownload('guide')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-3xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 mb-4">
          <Share2 className="w-6 h-6" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">Share & Earn</h2>
        <p className="text-neutral-400 mb-6">
          Share your unique link with friends. If they buy, you get a free bonus pack!
        </p>
        
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <input 
            type="text" 
            readOnly 
            value={referralLink}
            className="flex-1 px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-sm text-neutral-300 focus:outline-none"
          />
          <button 
            onClick={copyToClipboard}
            className="px-4 py-3 bg-white text-neutral-950 rounded-xl font-medium flex items-center gap-2 hover:bg-neutral-200 transition-colors"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 py-12 px-4">
      <Suspense fallback={<div className="text-center text-neutral-400">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}

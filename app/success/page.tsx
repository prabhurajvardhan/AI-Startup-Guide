"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle, Download, Copy, Share2, Star } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [purchase, setPurchase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Feedback form state
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [review, setReview] = useState({
    rating: 5,
    role: '',
    useful: '',
    built: '',
    testimonial: '',
    consent: false
  });

  useEffect(() => {
    let isMounted = true;
    if (id) {
      fetch(`/api/purchase?id=${id}`)
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
      setTimeout(() => {
        if (!isMounted) return;
        setError("No purchase ID provided");
        setLoading(false);
      }, 0);
    }
    return () => { isMounted = false; };
  }, [id]);

  const handleDownload = async (file: string) => {
    window.open(`/api/download?id=${id}&file=${file}`, '_blank');
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: purchase?.name || 'Anonymous',
          ...review
        })
      });
      if (res.ok) {
        setFeedbackSubmitted(true);
      } else {
        alert("Failed to submit feedback");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${purchase?.referral_code}` : '';
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="text-center text-neutral-400">Loading your purchase...</div>;
  
  if (error) {
    return (
      <div className="text-center">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-4">{error}</div>
      </div>
    );
  }

  const isKitPlan = purchase.product_type === 'kit' || purchase.product_type === 'founding';
  const isFounding = purchase.product_type === 'founding';

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
        <h1 className="font-display text-4xl font-bold mb-4">
          {isFounding ? 'Founding Access Claimed 🎉' : 'Payment Successful 🎉'}
        </h1>
        <p className="text-xl text-neutral-400">
          Thank you, {purchase.name}! Your ML engineering journey begins now.
        </p>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 mb-8">
        <h2 className="font-display text-2xl font-bold mb-6">Your ML Engineer Kit</h2>
        
        <div className="space-y-4">
          {isKitPlan && (
            <>
              <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-white/5">
                <div>
                  <p className="font-medium">Source Engine</p>
                  <p className="text-sm text-neutral-500">Concept-wise learning pool</p>
                </div>
                <button 
                  onClick={() => handleDownload('source')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-white/5">
                <div>
                  <p className="font-medium">Practice Engine</p>
                  <p className="text-sm text-neutral-500">150 progressive missions</p>
                </div>
                <button 
                  onClick={() => handleDownload('practice')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-white/5">
                <div>
                  <p className="font-medium">Open-Source Engine</p>
                  <p className="text-sm text-neutral-500">Real ML repos & issues</p>
                </div>
                <button 
                  onClick={() => handleDownload('opensource')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-neutral-900 border border-amber-500/20 rounded-3xl p-8 mb-8">
        <h2 className="font-display text-2xl font-bold mb-2 text-amber-400">Engineering Feedback</h2>
        <p className="text-neutral-400 mb-6">
          {isFounding ? "As a Founding 50 member, we rely on your honest feedback. What did you build or practice? What worked?" : "Tell us what you built or practiced. Share your honest experience with the community."}
        </p>

        {feedbackSubmitted ? (
          <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center font-medium">
            Thank you for your feedback! It helps us improve the system.
          </div>
        ) : (
          <form onSubmit={submitFeedback} className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Your Role (e.g. Student, ML Engineer, Developer)</label>
              <input 
                type="text" required
                value={review.role} onChange={e => setReview({...review, role: e.target.value})}
                className="w-full px-4 py-2 bg-neutral-950 border border-white/10 rounded-xl text-white" 
              />
            </div>
            
            <div>
              <label className="block text-sm text-neutral-400 mb-1">What did you build or practice?</label>
              <input 
                type="text" required placeholder="e.g. Fine-tuned a LLaMA model, built a RAG pipeline..."
                value={review.built} onChange={e => setReview({...review, built: e.target.value})}
                className="w-full px-4 py-2 bg-neutral-950 border border-white/10 rounded-xl text-white" 
              />
            </div>
            
            <div>
              <label className="block text-sm text-neutral-400 mb-1">What was the most useful part?</label>
              <input 
                type="text" required placeholder="e.g. The debugging framework, the source pool..."
                value={review.useful} onChange={e => setReview({...review, useful: e.target.value})}
                className="w-full px-4 py-2 bg-neutral-950 border border-white/10 rounded-xl text-white" 
              />
            </div>
            
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Your Review / Testimonial</label>
              <textarea 
                required rows={3}
                value={review.testimonial} onChange={e => setReview({...review, testimonial: e.target.value})}
                className="w-full px-4 py-2 bg-neutral-950 border border-white/10 rounded-xl text-white resize-none" 
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(star => (
                  <button 
                    type="button" key={star} 
                    onClick={() => setReview({...review, rating: star})}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${review.rating >= star ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-500'}`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 mt-4 cursor-pointer">
              <input 
                type="checkbox" required
                checked={review.consent} onChange={e => setReview({...review, consent: e.target.checked})}
                className="mt-1"
              />
              <span className="text-sm text-neutral-400">
                I give Nanoware AI permission to publish this testimonial on the landing page.
              </span>
            </label>

            <button 
              type="submit" disabled={feedbackSubmitting || !review.consent}
              className="w-full py-3 px-6 rounded-xl bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 transition-colors disabled:opacity-50 mt-4"
            >
              {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        )}
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

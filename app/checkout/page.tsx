"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ShieldCheck, ArrowLeft, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "full";
  const ref = searchParams.get("ref");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFullPlan = plan === "full";
  const price = isFullPlan ? 499 : 19;
  const planName = isFullPlan ? "AI Startup Launch Pack" : "Startup Roadmap + Marketing Strategy";

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create order on backend
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, name, email, ref, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // If order ID is mocked, bypass Razorpay and simulate success
      if (data.id.startsWith('mock_order_')) {
        // Simulate a brief delay for realism
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: "mock_payment_" + Date.now(),
            razorpay_order_id: data.id,
            razorpay_signature: "mock_signature",
            purchaseId: data.purchaseId,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok) {
          router.push(`/success?id=${data.purchaseId}`);
        } else {
          setError(verifyData.error || "Payment verification failed");
          setLoading(false);
        }
        return;
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please check your connection.");
      }

      // Initialize Razorpay
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "AI Startup Launch Pack",
        description: planName,
        order_id: data.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                purchaseId: data.purchaseId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              router.push(`/success?id=${data.purchaseId}`);
            } else {
              setError(verifyData.error || "Payment verification failed");
              setLoading(false);
            }
          } catch (err: any) {
            setError(err.message || "Payment verification failed");
            setLoading(false);
          }
        },
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: "#4f46e5",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            if (isFullPlan) {
              router.push("/downsell");
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(response.error.description || "Payment failed");
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Payment flow error:", err);
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-900 border border-white/10 rounded-3xl p-8"
      >
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold mb-2">Checkout</h1>
          <div className="flex justify-between items-center py-4 border-b border-white/10">
            <div>
              <p className="font-medium">{planName}</p>
              <p className="text-sm text-neutral-400">Digital Download</p>
            </div>
            <p className="text-xl font-bold">₹{price * quantity}</p>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-white/10 mb-4">
            <div>
              <p className="font-medium">Quantity</p>
              <p className="text-sm text-neutral-400">Number of packs</p>
            </div>
            <div className="flex items-center gap-3 bg-neutral-950 border border-white/10 rounded-xl p-1">
              <button 
                type="button" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button 
                type="button" 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="john@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? "Processing..." : `Pay ₹${price * quantity} Securely`}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-neutral-500">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span>Secured by Razorpay • UPI Supported</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 py-12 px-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Suspense fallback={<div className="text-center text-neutral-400">Loading...</div>}>
        <CheckoutForm />
      </Suspense>
    </main>
  );
}

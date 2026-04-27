"use client";

import { motion } from "motion/react";
import { ShieldCheck, Zap } from "lucide-react";

export function Pricing() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Main 499 Pack */}
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
                <span>Limited Time Offer</span>
              </div>
              
              <h2 className="font-display text-3xl font-bold mb-2">AI Startup Launch Pack</h2>
              <p className="text-neutral-400 mb-8">Full access to all guides, roadmaps, and tools.</p>
              
              <div className="flex items-baseline justify-center gap-2 mb-8 mt-auto">
                <span className="font-display text-5xl font-extrabold">₹499</span>
                <span className="text-neutral-500 line-through">₹999</span>
              </div>

              <a href="/checkout?plan=full" className="block w-full py-4 px-8 rounded-xl bg-white text-neutral-950 font-bold text-lg hover:bg-neutral-200 transition-colors mb-6">
                Download Now
              </a>

              <div className="flex flex-col items-center gap-3 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span>Secure payment via Razorpay</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Instant access after purchase</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 10rs Guide PDF */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative p-1 rounded-3xl bg-white/5 border border-white/10"
          >
            <div className="bg-neutral-900 rounded-[22px] p-8 md:p-12 text-center h-full flex flex-col">
              
              <h2 className="font-display text-3xl font-bold mb-4 mt-8">Guide PDF</h2>
              <p className="text-neutral-400 mb-8">Need time to get full setup? Get started with our ₹10 startup guide.</p>
              
              <div className="flex items-baseline justify-center gap-2 mb-8 mt-auto">
                <span className="font-display text-5xl font-extrabold">₹10</span>
              </div>

              <a href="/checkout?plan=guide" className="block w-full py-4 px-8 rounded-xl bg-neutral-800 text-white font-bold text-lg hover:bg-neutral-700 transition-colors mb-6">
                Get the Guide
              </a>

              <div className="flex flex-col items-center gap-3 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span>Secure payment via Razorpay</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Instant access after purchase</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

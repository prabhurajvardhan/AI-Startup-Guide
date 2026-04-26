"use client";

import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DownsellPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>No thanks, take me back to home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-pink-500 to-purple-500 blur-[100px] rounded-full mix-blend-screen" />
          </div>

          <div className="relative z-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Wait! Before you go...</h1>
            <p className="text-xl text-neutral-400 mb-8">
              We understand ₹499 might be a stretch right now. How about just the essentials to get you started?
            </p>

            <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 mb-8 text-left">
              <h2 className="font-display text-2xl font-bold mb-4">Startup Roadmap + Marketing Strategy</h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                  <span className="text-neutral-300">90-Day Step-by-Step Startup Roadmap PDF</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                  <span className="text-neutral-300">Zero-Budget Marketing Strategy Guide</span>
                </li>
              </ul>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display text-4xl font-extrabold text-white">₹19</span>
                <span className="text-neutral-500 line-through">₹499</span>
              </div>

              <Link 
                href="/checkout?plan=mini"
                className="block w-full py-4 text-center rounded-xl bg-pink-600 text-white font-bold text-lg hover:bg-pink-700 transition-colors"
              >
                Get the Mini Pack Now
              </Link>
            </div>

            <Link href="/" className="text-neutral-500 hover:text-neutral-300 underline text-sm">
              No thanks, I don&apos;t want to build a startup right now.
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

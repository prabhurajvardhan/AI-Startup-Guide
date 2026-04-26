"use client";

import { motion } from "motion/react";

export function Downsell() {
  return (
    <section className="py-12 border-t border-white/5 bg-neutral-900/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h3 className="font-display text-xl font-medium text-neutral-400 mb-6">Not ready yet?</h3>
          
          <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h4 className="font-display text-lg font-semibold mb-1">Startup Roadmap + Marketing Strategy PDFs</h4>
              <p className="text-sm text-neutral-500">Get just the essentials to start learning.</p>
            </div>
            
            <div className="flex-shrink-0 w-full sm:w-auto">
              <a href="/checkout?plan=mini" className="block text-center w-full sm:w-auto px-6 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-medium">
                Get the Mini Pack – ₹19
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

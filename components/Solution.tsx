"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const solutions = [
  "Curated learning pool for conceptual understanding",
  "150 progressive practice missions",
  "Real ML open-source contribution paths",
  "AI mentor workflow frameworks",
  "A complete system to build, break, debug, and prove",
];

export function Solution() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              The ML Engineer Kit
            </h2>
            <p className="text-xl text-neutral-400">
              Everything you need to stop watching tutorials and start engineering real ML systems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 flex items-center justify-center p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
              {/* Abstract representation of the pack */}
              <div className="relative w-full h-full border border-white/10 rounded-2xl bg-neutral-950 shadow-2xl flex flex-col p-6">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-6">
                  <span className="text-2xl">🧠</span>
                </div>
                <div className="h-4 w-3/4 bg-white/10 rounded mb-4" />
                <div className="h-4 w-1/2 bg-white/10 rounded mb-8" />
                <div className="space-y-3 mt-auto">
                  <div className="h-2 w-full bg-white/5 rounded" />
                  <div className="h-2 w-full bg-white/5 rounded" />
                  <div className="h-2 w-4/5 bg-white/5 rounded" />
                </div>
              </div>
            </motion.div>

            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                  </div>
                  <p className="text-lg text-neutral-300">{solution}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

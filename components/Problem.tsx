"use client";

import { motion } from "motion/react";
import { XCircle } from "lucide-react";

const problems = [
  "Students graduating without jobs or clear career paths",
  "Too many startup ideas but no step-by-step roadmap",
  "Confusion about which AI tools to use and where to start",
];

export function Problem() {
  return (
    <section className="py-24 bg-neutral-900/50 border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Sound familiar?</h2>
            <p className="text-neutral-400 text-lg">The traditional path isn&apos;t working anymore.</p>
          </motion.div>

          <div className="space-y-4">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-neutral-300 text-lg">{problem}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

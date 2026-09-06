"use client";

import { motion } from "motion/react";
import { XCircle } from "lucide-react";

const problems = [
  "Courses → You just watch.",
  "Tutorials → You blindly follow.",
  "Roadmaps → You only plan.",
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
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">The Passive Learning Trap</h2>
            <p className="text-neutral-400 text-lg">Becoming an engineer requires you to build, break, and debug.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 justify-center text-center"
              >
                <p className="text-neutral-300 text-lg font-medium">{problem}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <p className="text-2xl font-bold text-white mb-2">Understand. Build. Break. Debug. Prove. Contribute.</p>
            <p className="text-indigo-400 font-medium">This kit makes you do the actual work.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

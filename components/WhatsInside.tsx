"use client";

import { motion } from "motion/react";
import { BookOpen, Target, GitPullRequest, Bot } from "lucide-react";

const cards = [
  {
    title: "SOURCE ENGINE",
    description: "150 curated learning sources. Concept-wise learning pool covering all major ML engineering capabilities.",
    icon: BookOpen,
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
  },
  {
    title: "PRACTICE ENGINE",
    description: "150 progressive missions. Learn → Experiment → Build → Break → Debug → Prove.",
    icon: Target,
    color: "from-purple-500/20 to-purple-500/5",
    iconColor: "text-purple-400",
  },
  {
    title: "OPEN-SOURCE ENGINE",
    description: "Real ML open-source repositories with real issues and contribution-oriented engineering missions.",
    icon: GitPullRequest,
    color: "from-green-500/20 to-green-500/5",
    iconColor: "text-green-400",
  },
  {
    title: "AI MENTOR WORKFLOWS",
    description: "Transform raw source material into an interactive mentor that challenges assumptions and helps you debug.",
    icon: Bot,
    color: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
  },
];

export function WhatsInside() {
  return (
    <section className="py-24 bg-neutral-900/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">The Kit</h2>
          <p className="text-neutral-400 text-lg">Three comprehensive modules for total execution.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-8 rounded-3xl border border-white/10 bg-neutral-950 overflow-hidden hover:border-white/20 transition-colors"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{card.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

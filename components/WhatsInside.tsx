"use client";

import { motion } from "motion/react";
import { Map, Wrench, Megaphone, Lightbulb } from "lucide-react";

const cards = [
  {
    title: "90-Day Startup Roadmap PDF",
    description: "A day-by-day guide telling you exactly what to do from day 1 to day 90.",
    icon: Map,
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
  },
  {
    title: "Top AI Tools for Building Apps",
    description: "The secret list of no-code and AI tools that replace a full engineering team.",
    icon: Wrench,
    color: "from-purple-500/20 to-purple-500/5",
    iconColor: "text-purple-400",
  },
  {
    title: "Marketing Strategy Guide",
    description: "How to get your first 100 users without spending a single rupee on ads.",
    icon: Megaphone,
    color: "from-pink-500/20 to-pink-500/5",
    iconColor: "text-pink-400",
  },
  {
    title: "Startup Idea Generator",
    description: "Frameworks to find profitable problems and validate them instantly.",
    icon: Lightbulb,
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
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">What&apos;s Inside?</h2>
          <p className="text-neutral-400 text-lg">Everything you need, nothing you don&apos;t.</p>
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

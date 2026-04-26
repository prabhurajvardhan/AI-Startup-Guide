"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul S.",
    role: "CS Student",
    content: "I had so many ideas but didn't know where to start. This pack gave me the exact roadmap I needed. Launched my first AI tool in 45 days!",
  },
  {
    name: "Priya M.",
    role: "Solo Founder",
    content: "The marketing strategy alone is worth 10x the price. I got my first 100 users without spending anything on ads.",
  },
  {
    name: "Arjun K.",
    role: "Developer",
    content: "I used to spend months coding. The AI tools list showed me how to build the same thing in a weekend using no-code.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-neutral-900/50 border-y border-white/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Join 1,000+ Student Founders</h2>
          <p className="text-neutral-400 text-lg">Don&apos;t just take our word for it.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-3xl border border-white/10 bg-neutral-950"
            >
              <div className="flex gap-1 mb-6 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-neutral-300 mb-6 leading-relaxed">&quot;{testimonial.content}&quot;</p>
              <div>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-neutral-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

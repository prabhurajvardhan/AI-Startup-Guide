"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do I need coding skills?",
    answer: "Not at all. The tools and strategies recommended in this pack focus heavily on no-code and AI-assisted development. If you can write a prompt, you can build an app.",
  },
  {
    question: "Can a student build a startup alone?",
    answer: "Yes! With modern AI tools, a single person can do the work of a designer, developer, and marketer. This pack shows you exactly how to leverage these tools as a solo founder.",
  },
  {
    question: "Will I get instant access?",
    answer: "Yes, immediately after your payment is processed, you will be redirected to a download page and receive an email with the download link for all the materials.",
  },
  {
    question: "What tools do I need?",
    answer: "Just a laptop and an internet connection. Most of the AI tools recommended have generous free tiers that are more than enough to get your startup off the ground.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-white/10 rounded-2xl bg-neutral-900/30 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-display text-lg font-medium">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 pt-0 text-neutral-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

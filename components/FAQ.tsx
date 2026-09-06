"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is the ML Engineer Kit?",
    answer: "A complete execution system consisting of three modules: a Source Engine (150 curated learning sources), a Practice Engine (150 progressive missions), and an Open-Source Engine (real repositories and issues). It is designed to move you from passive learning to active engineering.",
  },
  {
    question: "Is this a course?",
    answer: "No. Courses make you watch. This kit makes you do. We curate the best external learning resources and provide a structured system to practice, build, and debug.",
  },
  {
    question: "Do I need to watch all the resources?",
    answer: "No. The AI Mentor workflow shows you how to supply source materials to an AI, transforming raw reading into an interactive mentor that challenges you and helps you debug.",
  },
  {
    question: "What is the Founding 50 program?",
    answer: "We are giving the complete kit for free to the first 50 learners. In return, we expect you to actually use the kit and provide honest feedback (not just positive reviews).",
  },
  {
    question: "How do I access the PDFs?",
    answer: "Immediately after purchase or claiming a founding slot, you'll get secure access to download the three engine modules from your success dashboard.",
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

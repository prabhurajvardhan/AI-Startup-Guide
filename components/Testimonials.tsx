"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface Review {
  id: number;
  name: string;
  role: string;
  rating: number;
  testimonial: string;
  useful: string;
  built: string;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.reviews) {
          setTestimonials(data.reviews);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

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
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Engineer Feedback</h2>
          <p className="text-neutral-400 text-lg">Honest reviews from those who did the work.</p>
        </motion.div>

        {loading ? (
          <div className="text-center text-neutral-500 py-12">Loading reviews...</div>
        ) : testimonials.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-12 rounded-3xl border border-white/5 bg-neutral-950 max-w-2xl mx-auto"
          >
            <p className="text-xl text-neutral-400 font-medium">You&apos;re among the first engineers helping us build this.</p>
            <p className="text-neutral-500 mt-2">Become a Founding 50 member to test the kit and submit your honest feedback.</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-3xl border border-white/10 bg-neutral-950 flex flex-col"
              >
                <div className="flex gap-1 mb-6 text-amber-400">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-300 mb-6 leading-relaxed flex-grow">&quot;{testimonial.testimonial}&quot;</p>
                <div className="pt-4 border-t border-white/10 mt-auto">
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-neutral-500">{testimonial.role}</p>
                  <div className="mt-2 text-xs text-neutral-400">
                    <p><span className="text-indigo-400">Practiced:</span> {testimonial.built}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

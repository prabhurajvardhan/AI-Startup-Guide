"use client";

import { motion } from "motion/react";
import { FileText } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const previews = [
  {
    title: "Source Engine",
    description: "Curated learning pool",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    title: "Practice Engine",
    description: "Progressive missions",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    color: "from-purple-500/20 to-purple-500/5",
  },
  {
    title: "Open-Source Engine",
    description: "Real repositories",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80",
    color: "from-green-500/20 to-green-500/5",
  }
];

export function PDFPreview() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-24 relative overflow-hidden bg-neutral-900/50 border-y border-white/5">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Inside the Kit</h2>
          <p className="text-xl text-neutral-400">
            A premium digital experience. No fluff. Just execution.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            {previews.map((preview, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`p-6 rounded-2xl text-left transition-all ${activeTab === index ? 'bg-white/10 border-white/20 scale-105' : 'bg-white/5 border-white/5 hover:bg-white/10'} border`}
              >
                <h3 className="font-display text-xl font-bold text-white mb-1">{preview.title}</h3>
                <p className="text-neutral-400">{preview.description}</p>
              </button>
            ))}
          </div>

          <div className="w-full md:w-2/3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className={`aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 relative bg-gradient-to-br ${previews[activeTab].color} p-4 flex items-center justify-center`}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
              <div className="relative w-full h-full">
                <Image 
                  src={previews[activeTab].image} 
                  alt={previews[activeTab].title} 
                  fill
                  className="rounded-xl shadow-2xl object-cover opacity-80 mix-blend-luminosity border border-white/20"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="bg-neutral-950/80 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full text-white/50 font-medium tracking-widest text-sm shadow-2xl transform -rotate-12">
                  NANOWARE AI PREVIEW
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

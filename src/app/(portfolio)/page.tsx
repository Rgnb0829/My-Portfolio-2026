"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-12 flex flex-col justify-center">
      <div className="container mx-auto">
        <div className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-[10rem] font-black tracking-tighter leading-none mb-4 md:mb-8 text-white uppercase break-words">
              Creative <br />
              <span className="text-gray-500">Developer.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12 mt-4 md:mt-12"
          >
            <p className="text-gray-400 max-w-xl text-lg md:text-2xl leading-relaxed">
              Hi, I'm Rakha Wismaya, an extremely passionate Software Developer based in Yogyakarta, Indonesia.
            </p>

            <Link
              href="/works"
              className="group flex items-center gap-6 shrink-0 transition-opacity hover:opacity-80 mt-8 md:mt-0"
            >
              <span className="text-lg md:text-2xl font-bold tracking-widest uppercase text-white/50 group-hover:text-white transition-colors duration-300">See Works</span>
              <ArrowUpRight size={80} strokeWidth={1} className="text-white group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

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
              className="group flex flex-col justify-center items-center w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full border border-white/20 hover:border-white transition-colors duration-300 relative overflow-hidden bg-white/5 backdrop-blur-md"
            >
              <span className="text-sm font-bold tracking-wider uppercase z-10">See Works</span>
              <ArrowUpRight size={24} className="mt-2 group-hover:scale-110 transition-transform z-10" />
              <div className="absolute inset-0 bg-white scale-0 group-hover:scale-100 rounded-full transition-transform duration-500 ease-out origin-center opacity-0 group-hover:opacity-10" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

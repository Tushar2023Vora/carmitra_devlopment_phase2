import React from "react";
import { motion } from "framer-motion";
import Search from "./Search";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 -z-10" />

      <div className="container mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Headline + Search */}
          <div className="text-black">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl text-white md:text-4xl font-bold leading-tight"
            >
              Find Your Dream Car
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-4 max-w-xl text-sm md:text-lg text-amber-100"
            >
              Browse thousands of listings — buy, sell, or rent. Filter by condition,
              make and price to find the perfect match.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="
                  mt-8
                  bg-white
                  rounded-2xl
                  shadow-lg
                  p-3
                  sm:p-4
                  md:p-6
                  w-full
                  max-w-4xl
                  mx-auto
                  "
              // className="mt-8 bg-white rounded-full p-3 shadow-lg inline-block"
            >
              {/* Search is your existing Search component — it will render inside hero */}
              <Search />
            </motion.div>

            <div className="mt-6 flex gap-3">
              <a
                className="inline-block px-6 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition"
                href="#most-searched"
              >
                Browse popular cars
              </a>
              <a
                className="inline-block px-6 py-2 rounded-full bg-white text-indigo-700 text-sm hover:opacity-90 transition"
                href="/add-listing"
              >
                Submit a listing
              </a>
            </div>
          </div>

          {/* Right: Car image / decorative */}
          <div className="hidden md:flex justify-end items-end relative">
            <motion.img
              src="/tesla.png"
              alt="Showcase car"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-[420px] w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Bottom decorative SVG wave */}
      <div className="-mb-1">
        <svg viewBox="0 0 1440 70" className="w-full h-16" preserveAspectRatio="none">
          <path
            d="M0,32 C360,96 1080,0 1440,32 L1440 120 L0 120 Z"
            fill="white"
            fillOpacity="1"
          />
        </svg>
      </div>
    </section>
  );
}
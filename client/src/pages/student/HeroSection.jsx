import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { motion } from "framer-motion";

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <BackgroundBeamsWithCollision
      className="!h-auto py-16 sm:py-20 md:py-24 lg:py-28 px-4 text-center bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-[#0b1020] dark:via-[#0b0f1a] dark:to-[#0a0e19]"
      beamClassName="from-sky-300/50 via-indigo-300/40 to-transparent dark:from-emerald-300/35 dark:via-cyan-300/25"
      explosionLineClassName="via-sky-300 dark:via-cyan-300"
      explosionParticleClassName="from-sky-300 to-indigo-300 dark:from-emerald-300 dark:to-cyan-300"
      groundClassName="bg-slate-100 dark:bg-slate-800/50"
      durationMultiplier={1.2}
      particleCount={12}
    >
      <div className="relative z-10 max-w-3xl mx-auto px-2 sm:px-6">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-slate-800 dark:text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight leading-tight"
        >
          Find the{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
            best Courses
          </span>{" "}
          for You
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="text-slate-600 dark:text-slate-300 mb-8 text-base sm:text-lg md:text-xl"
        >
          Create, manage, and monetize your expert knowledge.
        </motion.p>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          onSubmit={searchHandler}
          className="flex items-center bg-white/90 dark:bg-slate-900/80 backdrop-blur rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6 ring-1 ring-slate-200/70 dark:ring-white/10"
        >
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="flex-grow border-none focus-visible:ring-0 px-4 sm:px-6 py-2.5 sm:py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent"
          />
          <Button
            type="submit"
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-none hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            Search
          </Button>
        </motion.form>

        {/* Explore Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button
            onClick={() => navigate(`/course/search?query`)}
            className="bg-white/95 dark:bg-slate-900/90 text-indigo-700 dark:text-indigo-300 rounded-full hover:bg-white shadow-md px-6 py-3 text-sm sm:text-base transition"
          >
            Explore Courses
          </Button>
        </motion.div>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

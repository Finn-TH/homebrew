"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { User } from "@supabase/supabase-js";
import UserMenu from "@/components/ui/user-menu";
import { defaultFeatures } from "../data/features";

interface FeatureGridProps {
  user: User | null;
  initialPreferences: any;
}

export function FeatureGrid({ user, initialPreferences }: FeatureGridProps) {
  const [preferences, setPreferences] = useState(
    initialPreferences || {
      visibleCards: defaultFeatures.map((f) => f.id),
      cardColors: {},
    }
  );
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {defaultFeatures.map((feature) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.id}
              variants={item}
              layout
              className="group relative overflow-hidden rounded-xl bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1"
              onHoverStart={() => setHoveredCard(feature.title)}
              onHoverEnd={() => setHoveredCard(null)}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="mb-4 inline-block rounded-lg bg-[#FDF6EC] p-3 transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6 text-[#8B4513]" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-[#8B4513]">
                  {feature.title}
                </h3>
                <p className="mb-4 text-[#A0522D]/60">{feature.description}</p>
                <motion.button
                  className="flex items-center gap-2 text-sm text-[#8B4513] hover:underline"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Start Brewing
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

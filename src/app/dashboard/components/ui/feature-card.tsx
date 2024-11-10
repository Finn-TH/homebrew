"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@supabase/supabase-js";
import UserMenu from "@/app/components/ui/user-menu";
import { defaultFeatures } from "../../data/features";
import Link from "next/link";
import { FeatureGridProps } from "../../types";

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
          const href = `/dashboard/features/${feature.id.toLowerCase()}`;

          return (
            <Link href={href} key={feature.id} className="block h-full">
              <motion.div
                variants={item}
                layout
                className="group relative h-full overflow-hidden rounded-xl bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col"
              >
                <div className="relative flex-1">
                  <div className="mb-4 inline-block rounded-lg bg-[#FDF6EC] p-3 transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6 text-[#8B4513]" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-[#8B4513]">
                    {feature.title}
                  </h3>
                  <p className="mb-4 text-[#A0522D]/60">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-[#8B4513] mt-auto">
                    Start Brewing
                    <span className="inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

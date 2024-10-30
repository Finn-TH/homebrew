"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckSquare,
  ListTodo,
  PiggyBank,
  Dumbbell,
  Utensils,
  Brain,
  ArrowRight,
  Coffee,
} from "lucide-react";

export default function Dashboard() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const features = [
    {
      icon: CheckSquare,
      title: "Habit Tracker",
      description: "Brew better habits, one sip at a time",
    },
    {
      icon: ListTodo,
      title: "Todo List",
      description: "Grind through your tasks efficiently",
    },
    {
      icon: PiggyBank,
      title: "Budget & Finance",
      description: "Keep your finances as smooth as a latte",
    },
    {
      icon: Dumbbell,
      title: "Workout Tracker",
      description: "Pump iron like you brew your coffee - strong!",
    },
    {
      icon: Utensils,
      title: "Nutrition Logger",
      description: "Balance your meals like a perfect espresso shot",
    },
    {
      icon: Brain,
      title: "Mental Health Journal",
      description: "Reflect and recharge your mental energy",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF6EC] via-[#FFF8DC] to-[#FDF6EC] p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Coffee className="h-8 w-8 text-[#8B4513]" />
            <h1 className="text-4xl font-bold text-[#8B4513]">
              Your Daily Brew
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 text-sm text-[#8B4513] backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Brewing in progress
            </div>
            <Avatar className="border-2 border-[#8B4513]">
              <AvatarImage src="/placeholder.svg" alt="User profile" />
              <AvatarFallback className="bg-[#8B4513]/10 text-[#8B4513]">
                HB
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="group relative"
              onHoverStart={() => setHoveredCard(feature.title)}
              onHoverEnd={() => setHoveredCard(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative overflow-hidden rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B4513]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-2xl bg-[#8B4513]/10 p-3">
                      <feature.icon className="h-6 w-6 text-[#8B4513]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#8B4513]">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="mb-6 text-[#A0522D]">{feature.description}</p>

                  <motion.div
                    animate={{
                      x: hoveredCard === feature.title ? 5 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={`#${feature.title.toLowerCase().replace(" ", "-")}`}
                      className="flex items-center gap-2 text-sm font-medium text-[#8B4513] transition-colors hover:text-[#D2691E]"
                    >
                      Start Brewing
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

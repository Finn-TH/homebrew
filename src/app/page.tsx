"use client"; // Required for framer-motion

import { motion } from "framer-motion";
import { Coffee, LayoutDashboard, Brain, PiggyBank, Heart } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Integrated Platform",
      description: "Manage tasks, budgets, and time in one place",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations and automation",
    },
    {
      icon: PiggyBank,
      title: "Advanced Budgeting",
      description: "Track expenses and optimize your finances",
    },
    {
      icon: Heart,
      title: "Health & Well-being",
      description: "Monitor your diet, exercise, and mental wellness",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Rest of your code remains exactly the same */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 h-48 w-48 rounded-full bg-[#8B4513]/10" />
        <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-[#D2691E]/10" />
        <div className="absolute bottom-1/4 left-1/3 h-32 w-32 rounded-full bg-[#A0522D]/10" />
      </div>

      <div className="relative">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-[#8B4513]" />
            <span className="text-xl font-semibold text-[#8B4513]">
              HomeBrew
            </span>
          </div>
        </nav>

        <main className="relative mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-4xl font-bold tracking-tight text-[#8B4513] sm:text-6xl">
              Brew the Perfect Home
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-[#A0522D]">
              A warm blend of AI-powered task management, budgeting, and
              wellness tracking to help you create the perfect daily routine
            </p>
            <div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  href="/dashboard"
                  className="rounded-full bg-[#8B4513] px-8 py-3 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-[#A0522D]"
                >
                  BREW
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-32"
          >
            <h2 className="text-3xl font-bold text-[#8B4513]">Key Features</h2>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl"
                >
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#8B4513] to-[#D2691E] opacity-0 blur transition-all group-hover:opacity-10" />
                  <div className="relative">
                    <feature.icon className="mx-auto h-12 w-12 text-[#8B4513]" />
                    <h3 className="mt-4 text-lg font-semibold text-[#8B4513]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-[#A0522D]">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

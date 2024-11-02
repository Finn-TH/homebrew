"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import {
  CheckSquare,
  ListTodo,
  PiggyBank,
  Dumbbell,
  Utensils,
  Brain,
  Coffee,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { signOut } from "./actions";

export default function Dashboard() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

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
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
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

            {user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {user.user_metadata?.avatar_url && (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm text-[#8B4513]">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </div>

                <form action={signOut}>
                  <button className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 text-sm text-[#8B4513] hover:bg-white/70 transition-colors backdrop-blur-sm">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl"
                onHoverStart={() => setHoveredCard(feature.title)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-4 inline-block rounded-lg bg-[#FDF6EC] p-3">
                  <Icon className="h-6 w-6 text-[#8B4513]" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-[#8B4513]">
                  {feature.title}
                </h3>
                <p className="mb-4 text-[#A0522D]/60">{feature.description}</p>
                <button className="flex items-center gap-2 text-sm text-[#8B4513] hover:underline">
                  Start Brewing
                  <ArrowRight
                    className={`h-4 w-4 transition-transform ${
                      hoveredCard === feature.title ? "translate-x-1" : ""
                    }`}
                  />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

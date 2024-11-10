import {
  Brain,
  LayoutDashboard,
  PiggyBank,
  Heart,
  ListTodo,
  Utensils,
} from "lucide-react";
import { Feature } from "../types";

export const defaultFeatures: Feature[] = [
  {
    id: "habit-tracker",
    title: "Habit Tracker",
    description: "Brew better habits, one sip at a time",
    icon: Brain,
    defaultVisible: true,
  },
  {
    id: "todo-list",
    title: "Todo List",
    description: "Grind through your tasks efficiently",
    icon: ListTodo,
    defaultVisible: true,
  },
  {
    id: "budget-finance",
    title: "Budget & Finance",
    description: "Keep your finances as smooth as a latte",
    icon: PiggyBank,
    defaultVisible: true,
  },
  {
    id: "workout-tracker",
    title: "Workout Tracker",
    description: "Pump iron like you brew your coffee - strong!",
    icon: Heart,
    defaultVisible: true,
  },
  {
    id: "nutrition-logger",
    title: "Nutrition Logger",
    description: "Balance your meals like a perfect espresso shot",
    icon: Utensils,
    defaultVisible: true,
  },
  {
    id: "mental-health",
    title: "Mental Health Journal",
    description: "Reflect and recharge your mental energy",
    icon: Brain,
    defaultVisible: true,
  },
];

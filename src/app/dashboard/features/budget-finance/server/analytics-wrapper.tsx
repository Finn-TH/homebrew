import { Suspense } from "react";
import { Transaction, SavingsGoal } from "../types";
import { AnalyticsClient } from "../client/analytics-client";
import { prepareAnalyticsData } from "../utils/calculations";

interface AnalyticsWrapperProps {
  transactions: Transaction[];
  monthlyBudget: number;
  goals: SavingsGoal[];
}

export default function AnalyticsWrapper({
  transactions,
  monthlyBudget,
  goals,
}: AnalyticsWrapperProps) {
  const { currentDate, categoryTotals, trendData } =
    prepareAnalyticsData(transactions);

  return (
    <Suspense fallback={<div>Loading analytics...</div>}>
      <AnalyticsClient
        currentDate={currentDate}
        transactions={transactions}
        monthlyBudget={monthlyBudget}
        goals={goals}
        categoryTotals={categoryTotals}
        trendData={trendData}
      />
    </Suspense>
  );
}

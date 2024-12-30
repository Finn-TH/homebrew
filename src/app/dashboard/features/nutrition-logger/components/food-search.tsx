"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { searchFood } from "../actions/search-food";

interface FoodSearchProps {
  onSelect: (food: CommonFood) => void;
}

interface CommonFood {
  id: string;
  name: string;
  brand?: string;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  food_type: string;
  meal_category: string;
}

export default function FoodSearch({ onSelect }: FoodSearchProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<CommonFood[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

  const handleSearch = (query: string) => {
    setSearch(query);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(async () => {
      if (query.length < 2) return;
      setIsLoading(true);
      const results = await searchFood(query);
      setResults(results);
      setIsLoading(false);
    }, 300);

    setSearchTimeout(timeout);
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B4513]/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search foods (e.g., banana, chicken breast)"
          className="w-full rounded-lg border pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
        />
      </div>

      {/* Search Results */}
      {(results.length > 0 || isLoading) && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg border shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-[#8B4513]/60">
              Searching...
            </div>
          ) : (
            results.map((food) => (
              <button
                key={food.id}
                onClick={() => {
                  onSelect(food);
                  setSearch("");
                  setResults([]);
                }}
                className="w-full text-left p-3 hover:bg-[#8B4513]/5 flex justify-between items-center border-b last:border-0"
              >
                <div>
                  <div className="font-medium text-[#8B4513]">{food.name}</div>
                  <div className="text-sm text-[#8B4513]/60">
                    {food.serving_size} {food.serving_unit}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-[#8B4513]">
                    {food.calories} cal
                  </div>
                  <div className="text-sm text-[#8B4513]/60">
                    P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

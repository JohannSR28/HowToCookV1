import { Recipe } from "@/lib/type/Recipe";
import { useState } from "react";

export default function IngredientFinder({ recipe }: { recipe: Recipe }) {
  const [inputValue, setInputValue] = useState("");

  function handleSearch() {
    // Logique de recherche à implémenter
    console.log("Searching for:", inputValue);
  }

  return (
    <div className="p-4 mt-6">
      <h2 className="text-2xl font-bold my-4">Find Ingredient</h2>
      <div className="px-4 mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search recipes..."
          className="w-[75%] p-2 border-2 rounded-lg bg-white text-black"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="p-2 border-2 rounded-lg bg-neutral-600 text-white"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}

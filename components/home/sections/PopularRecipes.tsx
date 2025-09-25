import React from "react";
import RecipeCarousel from "@/components/RecipeCarousel";

export default function PopularRecipes() {
  return (
    <div className="flex flex-col items-center gap-8 py-8 px-2">
      <h2 className="text-2xl font-bold text-center">
        Nos recettes populaires
      </h2>

      <RecipeCarousel speed={40} maxItems={10} />
    </div>
  );
}

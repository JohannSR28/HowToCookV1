import React from "react";
import { useEffect, useState } from "react";
import { fetchRecipesWithQuery } from "@/lib/api-function/test";
import { Recipe } from "@/lib/type/Recipe";
import { toast } from "react-toastify";
import ContinuousSwiper from "./ContiniousSwiper";
import RecipePreview from "./RecipePreview";

interface Props {
  speed?: number;
  className?: string;
  maxItems?: number;
}

const RecipeCarousel: React.FC<Props> = ({
  speed = 40,
  className = "",
  maxItems = 10,
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const result = await fetchRecipesWithQuery(
          undefined,
          undefined,
          undefined,
          "createdAt",
          "desc",
          5
        );

        if (result.success) {
          console.log(result.data);
        }

        if (result?.success) {
          setRecipes(result.data ?? []);
          toast.success("Recipes fetched successfully.");
        } else {
          toast.error(result?.error || "Failed to fetch recipes.");
        }
      } catch (err) {
        toast.error(
          (err as Error)?.message || "Unexpected error while fetching recipes."
        );
      }
    };

    loadRecipes();
  }, []);

  // Gestion des cas edge
  if (!recipes || recipes.length === 0) {
    return (
      <div className={`w-full py-8 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">
            Aucune recette disponible
          </div>
          <div className="text-sm">
            Les recettes apparaîtront ici une fois ajoutées
          </div>
        </div>
      </div>
    );
  }

  // Transformer les recettes en slides
  const recipeItems = recipes.slice(0, maxItems).map((recipe) => ({
    id: recipe.id,
    content: (
      <div className="w-full h-full p-3">
        <RecipePreview recipe={recipe} />
      </div>
    ),
  }));

  return (
    <div className={className}>
      <ContinuousSwiper items={recipeItems} speed={speed} />
    </div>
  );
};

export default RecipeCarousel;

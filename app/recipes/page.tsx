"use client";
import RecipePreview from "@/components/RecipePreview";
import PageTitle from "../../components/PageTitle";
import { fetchAllRecipes } from "@/lib/api-function/test";
import { useEffect, useState } from "react";
import { Recipe } from "@/lib/type/Recipe";
import { toast } from "react-toastify";

export default function AllRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        const result = await fetchAllRecipes();
        console.log(result);

        if (result?.success) {
          setRecipes(result.data ?? []);
          toast.success("Recipes fetched successfully.");
        } else {
          toast.error(result?.error || "Failed to fetch recipes.");
        }
      } catch (err) {
        console.error("Error loading recipes:", err);
        toast.error("Unexpected error while fetching recipes.");
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  if (loading) {
    return (
      <div>
        <PageTitle title="All Recipes" />
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Loading recipes...</div>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="p-4">
        <PageTitle title="All Recipes" />
        <p className="text-center mt-8">No recipes found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PageTitle title="All Recipes" />

      <div className="px-4 mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search recipes..."
          className="w-[75%] p-2 border-2 rounded-lg bg-white"
        />
        <button className="p-2 border-2 rounded-lg bg-neutral-600 text-white">
          Search
        </button>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 px-4">
        {recipes.map((recipe) => (
          <RecipePreview key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

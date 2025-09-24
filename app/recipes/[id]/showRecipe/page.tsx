"use client";
import PageTitle from "@/components/PageTitle";
import { useEffect, useState } from "react";
import React from "react";
import DetailedRecipe from "@/components/recipes/showRecipes/DetailedRecipe";
import { DeleteRecipeModal } from "@/components/DeleteRecipeModal";
import { fetchRecipeById } from "@/lib/api-function/test";
import { toast } from "react-toastify";
import { Recipe } from "@/lib/type/Recipe";
import { deleteRecipeById } from "@/lib/api-function/test";

export default function ShowRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        const result = await fetchRecipeById(id);
        console.log(result);

        if (result?.success) {
          setRecipe(result.data ?? null);
          toast.success("Recipes fetched successfully.");
        } else {
          toast.error(result?.error || "Failed to fetch recipes.");
        }
      } catch (err) {
        toast.error(
          (err as Error)?.message || "Unexpected error while fetching recipes."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [id]);

  function handleDeleteRecipe() {
    if (!recipe) return;
    deleteRecipeById(recipe.id)
      .then((result) => {
        if (result?.success) {
          toast.success("Recipe deleted successfully.");
          window.location.href = "/";
        } else {
          toast.error(result?.error || "Failed to delete recipe.");
        }
      })
      .catch((err) => {
        toast.error(
          (err as Error)?.message || "Unexpected error while deleting recipe."
        );
      });
  }

  if (loading) {
    return (
      <div className="p-4">
        <PageTitle title="Loading Recipe..." />
        <p>Loading...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="p-4">
        <PageTitle title="Recipe Not Found" />
        <p>The recipe you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PageTitle title="Recipe Details" />
      <DetailedRecipe recipe={recipe} />
      {/*<IngredientFinder recipe={recipe} />*/}
      <div className="mt-4 gap-4 flex">
        <a
          href={`/recipes/${recipe.id}/editRecipe`}
          className="inline-block px-4 py-2 mb-4 bg-neutral-600 text-white rounded hover:bg-neutral-700 transition-colors duration-200"
        >
          Edit this recipe
        </a>
        <div
          onClick={() => setIsModalOpen(true)}
          className="inline-block px-4 py-2 mb-4 bg-red-800 text-white rounded hover:bg-red-900 transition-colors duration-200 cursor-pointer"
        >
          Delete this recipe
        </div>
        <DeleteRecipeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            // Handle delete confirmation
            console.log(`Recipe with id ${recipe.id} deleted.`);
            handleDeleteRecipe();
            setIsModalOpen(false);
          }}
          recipeName={recipe.title}
        />
      </div>
    </div>
  );
}

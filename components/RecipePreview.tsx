"use client";

import { useTheme } from "@/app/context/ThemeContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Recipe } from "@/lib/type/Recipe";
import { ArrowRight } from "lucide-react";

export default function RecipePreview({ recipe }: { recipe: Recipe }) {
  const { theme } = useTheme();
  const router = useRouter();

  const colorClasses = {
    light: {
      background: "bg-transparent",
      subtitle: "text-gray-600",
      buttonBg: "rgb(251, 186, 114)",
      buttonText: "text-white",
      title: "text-gray-900",
    },
    dark: {
      background: "bg-transparent",
      subtitle: "text-gray-300",
      buttonBg: "#1f2937",
      buttonText: "text-white",
      title: "text-white",
    },
  };

  function handleClick() {
    router.push(`/recipes/${recipe.id}/showRecipe`);
  }

  return (
    <div
      className={`w-full aspect-square rounded-xl overflow-hidden relative ${colorClasses[theme].background}`}
    >
      {/* Image */}
      <Image
        src={recipe.image || "/placeholder.svg"}
        alt={recipe.title}
        fill
        className="object-cover"
        sizes="100vw"
      />

      {/* Overlay semi-transparent pour le titre */}
      <div className="absolute bottom-0 left-0 w-full bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 flex flex-col items-center">
        <h3
          className={`text-center font-semibold text-sm sm:text-base md:text-lg break-words ${colorClasses[theme].title}`}
        >
          {recipe.title}
        </h3>
        <div
          className="w-12 sm:w-16 h-0.5 mt-1 sm:mt-2 rounded-full"
          style={{ backgroundColor: colorClasses[theme].buttonBg }}
        />
      </div>

      {/* Bouton voir recette */}
      <button
        onClick={handleClick}
        className={`absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-md transition ${colorClasses[theme].buttonText}`}
        style={{ backgroundColor: colorClasses[theme].buttonBg }}
      >
        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Voir la recette complète</span>
      </button>
    </div>
  );
}

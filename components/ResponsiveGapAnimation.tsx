"use client";
import { useEffect, useState } from "react";
import RecipePreview from "./RecipePreview";
import { fetchRecipesWithQuery } from "@/lib/api-function/test";
import { Recipe } from "@/lib/type/Recipe";
import { toast } from "react-toastify";

export default function ResponsiveGapAnimation() {
  // Variables configurables
  const ratio = 1; // aspect-ratio (width / height)
  const height = 25; // height in vw
  const gap = 0.8; // gap desktop and tablet

  const heightMobile = height * 2; // height mobile (increased)
  const gapMobile = gap * 1.2; // gap mobile (increased)
  const duration = 30; //  desktop animation duration in seconds

  const css = `
    /* DESKTOP ANIMATION */
    @keyframes parades {
        0%   { transform: translateX(-${1 * ratio * height}vw); }
        100% { transform: translateX(${5 * ratio * height * gap}vw); } 
    }

    /* MOBILE ANIMATION with reduced gap */
    @keyframes paradesMobile {
        0%   { transform: translateX(-${1 * ratio * heightMobile}vw); }
        100% { transform: translateX(${
          5 * ratio * heightMobile * gapMobile
        }vw); } 
    }

    .outer {
        width: 100%;
        height: ${height}vw;
        position: relative;
        overflow: hidden;
        /* Mask with gradient for fade effect (reduce fade size by adjusting 15%/85%) */
        mask: linear-gradient(
            to right, 
            transparent 0%, 
            black 1%, 
            black 99%, 
            transparent 100%
        );
        -webkit-mask: linear-gradient(
            to right, 
            transparent 0%, 
            black 1%, 
            black 99%, 
            transparent 100%
        );
    }

    .inner {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        aspect-ratio: ${ratio};
        padding: 0;
        animation: parades ${duration}s linear infinite;
        padding: 10px;
    }

    /* DESKTOP - Normal gap */
    /*.responsive-div-0   {  } */
    .responsive-div-1   {  animation-delay: -${(duration / 5) * 1}s; }
    .responsive-div-2 {  animation-delay: -${(duration / 5) * 2}s; }
    .responsive-div-3  {  animation-delay: -${(duration / 5) * 3}s; }
    .responsive-div-4  {  animation-delay: -${(duration / 5) * 4}s; }

    /* TABLET */
    @media (max-width: 1024px) {
        /* Same as desktop */
    }

    /* MOBILE - double height so we need a different animation */
    @media (max-width: 600px) {
        .outer {
            height: ${heightMobile}vw;
        }
        .inner {
            animation-name: paradesMobile; /* New animation */
        }
    }
  `;

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

  return (
    <div>
      <div className="outer">
        {recipes.slice(0, 5).map((recipe, i) => (
          <div key={i} className={`inner responsive-div-${i}`}>
            <RecipePreview recipe={recipe} />
          </div>
        ))}
        <style jsx>{css}</style>
      </div>
    </div>
  );
}

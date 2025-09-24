import Image from "next/image";
import { useState } from "react";
import { Recipe } from "@/lib/type/Recipe";

export default function DetailedRecipe({ recipe }: { recipe: Recipe }) {
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(
    recipe ? new Array(recipe.ingredients.length).fill(false) : []
  );

  const handleIngredientCheck = (index: number) => {
    setCheckedIngredients((prev) =>
      prev.map((checked, i) => (i === index ? !checked : checked))
    );
  };

  return (
    <div className="p-4 flex flex-col md:flex-row gap-6">
      {/* Image en haut sur mobile, à gauche sur desktop */}
      <div className="flex-shrink-0 w-full md:w-auto">
        <Image
          src={recipe.image}
          alt={recipe.title}
          width={500}
          height={300}
          className="w-full md:w-auto rounded-lg"
        />
      </div>

      {/* Contenu textuel en dessous sur mobile, à droite sur desktop */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold">{recipe.title}</h2>
        <h3 className="mt-2 text-lg font-semibold">By {recipe["sub-title"]}</h3>
        <p className="mt-2 text-sm text-gray-600">
          Preparation Time: {recipe["preparation-time"]}
        </p>
        <p className="mt-2">{recipe.description}</p>
        <h3 className="mt-4 text-lg font-semibold">Ingredients</h3>
        <ul className="mt-2 space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`ingredient-${index}`}
                checked={checkedIngredients[index]}
                onChange={() => handleIngredientCheck(index)}
                className="w-4 h-4"
              />
              <label
                htmlFor={`ingredient-${index}`}
                className={`cursor-pointer ${
                  checkedIngredients[index] ? "line-through text-gray-500" : ""
                }`}
              >
                {ingredient}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

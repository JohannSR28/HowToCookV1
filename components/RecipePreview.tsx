import { useTheme } from "@/app/context/ThemeContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Recipe } from "@/lib/type/Recipe";

export default function RecipePreview({ recipe }: { recipe: Recipe }) {
  const { theme } = useTheme();

  const colorClasses = {
    light: {
      "recipe-preview-background": "bg-white",
      "recipe-preview-subtitle": "text-gray-600",
    },
    dark: {
      "recipe-preview-background": "bg-gray-600",
      "recipe-preview-subtitle": "text-gray-300",
    },
  };

  const router = useRouter();

  function handleClick() {
    router.push(`/recipes/${recipe.id}/showRecipe`);
  }

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col w-full h-full ${colorClasses[theme]["recipe-preview-background"]} rounded-xl shadow-md overflow-hidden p-3 sm:p-4 hover:scale-105 transition-transform duration-300`}
    >
      {/* Image */}
      <div className="relative w-full h-32 sm:h-40 md:h-48 rounded-lg overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>

      {/* Text */}
      <div className="mt-3 flex flex-col flex-grow items-center justify-center">
        <h3 className="mt-2 text-base sm:text-lg font-semibold text-center truncate">
          {recipe.title}
        </h3>
        <p
          className={`${colorClasses[theme]["recipe-preview-subtitle"]} text-center text-xs sm:text-sm line-clamp-2`}
        >
          {recipe["sub-title"]}
        </p>
      </div>
    </div>
  );
}

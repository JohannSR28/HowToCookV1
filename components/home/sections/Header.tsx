import Link from "next/link";
import ThemeButton from "../../ThemeButton";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-2 py-3 sm:px-4 sm:py-4 mb-5">
      {/* Logo - taille plus petite sur mobile */}
      <p className="font-bold text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">
        How To Cook
      </p>

      {/* Navigation links - taille réduite */}
      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
        <Link
          href="/login"
          className="text-xs sm:text-sm md:text-base font-semibold underline whitespace-nowrap"
        >
          Login
        </Link>
        <Link
          href="/recipes"
          className="text-xs sm:text-sm md:text-base font-semibold underline whitespace-nowrap"
        >
          All Recipes
        </Link>
        <Link
          href="/recipes/create"
          className="text-xs sm:text-sm md:text-base font-semibold underline whitespace-nowrap"
        >
          Create Recipe
        </Link>
        {/* Switches - plus compacts sur mobile */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <ThemeButton />
        </div>
      </div>
    </header>
  );
}

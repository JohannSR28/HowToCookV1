import React from "react";
import ResponsiveGapAnimation from "../../ResponsiveGapAnimation";

export default function PopularRecipes() {
  return (
    <div className="flex flex-col items-center gap-8 py-8 px-2">
      <h2 className="text-2xl font-bold text-center">
        Nos recettes populaires
      </h2>

      {/* Container with visible overflow to allow the animation to overflow */}
      <div
        className="w-full"
        style={{
          // Crucial: allows the animation to overflow
          overflow: "visible",
          position: "relative",
        }}
      >
        <ResponsiveGapAnimation />
      </div>
    </div>
  );
}

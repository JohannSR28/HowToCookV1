import { NextResponse } from "next/server";
import { getAllRecipes, addRecipe } from "@/lib/database/recipes-database";

export async function GET() {
  try {
    const recipes = await getAllRecipes();
    return NextResponse.json({ success: true, data: recipes });
  } catch (error) {
    console.error("Error fetching all recipes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newRecipe = {
      title: body.title,
      "sub-title": body["sub-title"],
      "preparation-time": body["preparation-time"],
      "price-per-serving": body["price-per-serving"],
      image: body.image,
      description: body.description,
      ingredients: body.ingredients,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newRecipeId = await addRecipe(newRecipe);

    return NextResponse.json({ success: true, data: { id: newRecipeId } });
  } catch (error) {
    console.error("Error adding new recipe:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add recipe" },
      { status: 500 }
    );
  }
}

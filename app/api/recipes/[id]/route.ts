import { NextResponse } from "next/server";
import {
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from "@/lib/database/recipes-database";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recipe = await getRecipeById(id);

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: recipe });
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

// PUT /api/recipes/[id]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updatedData = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No data provided for update" },
        { status: 400 }
      );
    }

    const success = await updateRecipe(id, updatedData);

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Recipe ${id} updated successfully`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to update recipe" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    const success = await deleteRecipe(id);

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Recipe ${id} deleted successfully`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to delete recipe" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

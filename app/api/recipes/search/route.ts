import { NextResponse } from "next/server";
import { getRecipesWithQuery } from "@/lib/database/recipes-database";
import { WhereFilterOp } from "firebase/firestore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Exemple : /api/recipes/search?field=category&operator==&value=dessert&sortBy=createdAt&sortDirection=desc&limit=5
    const field = searchParams.get("field");
    const operator = searchParams.get("operator") as WhereFilterOp | null;
    const value = searchParams.get("value");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDirection =
      (searchParams.get("sortDirection") as "asc" | "desc") || "desc";
    const limitCount = parseInt(searchParams.get("limit") || "10", 10);

    const filters =
      field && operator && value ? [{ field, operator, value }] : [];

    const recipes = await getRecipesWithQuery(
      filters,
      sortBy,
      sortDirection,
      limitCount
    );

    return NextResponse.json({ success: true, data: recipes });
  } catch (error) {
    console.error("Error fetching recipes with query:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipes with filters" },
      { status: 500 }
    );
  }
}

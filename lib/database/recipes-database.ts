// Import the Firestore functions and the Recipe interface
import {
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  WhereFilterOp,
  QueryConstraint,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "./connection";
import { Recipe } from "../type/Recipe";

// CREATE - Add a new recipe
export const addRecipe = async (
  recipe: Omit<Recipe, "id">
): Promise<string | null> => {
  try {
    // Crée une référence avec ID généré
    const newDocRef = doc(collection(db, "recipes"));

    // Écris le document avec l'ID inclus
    await setDoc(newDocRef, {
      ...recipe,
      id: newDocRef.id,
    });

    console.log("Document written with ID:", newDocRef.id);
    return newDocRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};

// READ - Get a single recipe by ID
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const docRef = doc(db, "recipes", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Recipe;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};

// READ - Get all recipes
export const getAllRecipes = async (): Promise<Recipe[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "recipes"));
    const recipes: Recipe[] = [];

    querySnapshot.forEach((doc) => {
      recipes.push({
        id: doc.id,
        ...doc.data(),
      } as Recipe);
    });

    console.log(`Retrieved ${recipes.length} recipes`);
    return recipes;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
};

// READ - Get recipes with filters and sorting
export const getRecipesWithQuery = async (
  filters: {
    field: string;
    operator: WhereFilterOp;
    value: unknown;
  }[] = [],
  sortBy: string = "createdAt",
  sortDirection: "asc" | "desc" = "desc",
  limitCount: number = 10
): Promise<Recipe[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    // Add filters
    filters.forEach((filter) => {
      constraints.push(where(filter.field, filter.operator, filter.value));
    });

    // Add sorting
    constraints.push(orderBy(sortBy, sortDirection));

    // Add limit
    constraints.push(limit(limitCount));

    const q = query(collection(db, "recipes"), ...constraints);
    const querySnapshot = await getDocs(q);

    const recipes: Recipe[] = [];
    querySnapshot.forEach((doc) => {
      recipes.push({
        id: doc.id,
        ...doc.data(),
      } as Recipe);
    });

    console.log(`Retrieved ${recipes.length} recipes with filters`);
    return recipes;
  } catch (error) {
    console.error("Error getting filtered documents: ", error);
    return [];
  }
};
/*

// READ - Search recipes by title
export const searchRecipesByTitle = async (
  searchTerm: string
): Promise<Recipe[]> => {
  try {
    // Firestore doesn't support full-text search, so we use array-contains or startsWith
    const q = query(
      collection(db, "recipes"),
      where("title", ">=", searchTerm),
      where("title", "<=", searchTerm + "\uf8ff"),
      orderBy("title")
    );

    const querySnapshot = await getDocs(q);
    const recipes: Recipe[] = [];

    querySnapshot.forEach((doc) => {
      recipes.push({
        id: doc.id,
        ...doc.data(),
      } as Recipe);
    });

    console.log(`Found ${recipes.length} recipes matching "${searchTerm}"`);
    return recipes;
  } catch (error) {
    console.error("Error searching recipes: ", error);
    return [];
  }
};
 */

// UPDATE - Update a recipe
export const updateRecipe = async (
  id: string,
  updates: Partial<Omit<Recipe, "id">>
): Promise<boolean> => {
  try {
    const docRef = doc(db, "recipes", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
    console.log("Document updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating document: ", error);
    return false;
  }
};

// DELETE - Delete a recipe
export const deleteRecipe = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, "recipes", id));
    console.log("Document deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting document: ", error);
    return false;
  }
};

// UTILITY - Check if recipe exists
export const recipeExists = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, "recipes", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Error checking document existence: ", error);
    return false;
  }
};

// UTILITY - Get recipes count
export const getRecipesCount = async (): Promise<number> => {
  try {
    const querySnapshot = await getDocs(collection(db, "recipes"));
    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting recipes count: ", error);
    return 0;
  }
};

// Example usage functions
export const exampleUsage = async () => {
  try {
    // CREATE - Add a recipe
    const newRecipeId = await addRecipe({
      title: "Delicious Pancakes",
      "sub-title": "Fluffy pancakes with syrup",
      "preparation-time": "20 mins",
      "price-per-serving": "$5",
      image: "/update.jpg",
      description:
        "Enjoy these light and fluffy pancakes, served warm with a generous drizzle of sweet syrup.",
      ingredients: [
        "1 cup all-purpose flour",
        "2 tablespoons sugar",
        "1 tablespoon baking powder",
        "2 eggs",
        "1 cup milk",
        "2 tablespoons butter",
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (newRecipeId) {
      console.log("Created recipe with ID:", newRecipeId);

      // READ - Get the recipe we just created
      const recipe = await getRecipeById(newRecipeId);
      console.log("Retrieved recipe:", recipe);

      // UPDATE - Update the recipe
      const updateSuccess = await updateRecipe(newRecipeId, {
        title: "Super Delicious Pancakes",
        "price-per-serving": "$6",
      });
      console.log("Update success:", updateSuccess);

      // READ - Get all recipes
      const allRecipes = await getAllRecipes();
      console.log("All recipes count:", allRecipes.length);

      /* // READ - Search recipes
      const searchResults = await searchRecipesByTitle(
        "Super Delicious Pancakes"
      );
      console.log("Search results:", searchResults.length);
      */

      // READ - Get recipes with query
      const filteredRecipes = await getRecipesWithQuery(
        [{ field: "preparation-time", operator: "==", value: "20 mins" }],
        "title",
        "asc",
        5
      );
      console.log("Filtered recipes:", filteredRecipes.length);

      //DELETE - Delete the recipe (uncomment if needed)
      //const deleteSuccess = await deleteRecipe(newRecipeId);
      //console.log("Delete success:", deleteSuccess);
    }
  } catch (error) {
    console.error("Example usage error:", error);
  }
};

// Uncomment to run examples
//exampleUsage();

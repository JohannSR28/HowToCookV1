//endpoint for Google Sign-In logic : just a click, i want google auth screen to continue the login process
//endpoint for Email Sign-In logic : input are not controlled and are : email and password
//endpoint for Create Account logic : input are not controlled and are : name, email, password and confirm password

export async function loginWithGoogle() {
  try {
    const res = await fetch("/api/auth/google", { method: "POST" });
    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function loginWithEmail(email: string, password: string) {
  try {
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    const res = await fetch("/api/auth/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function createNewAccount(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  try {
    if (!name || !email || !password) {
      return { success: false, error: "All fields are required" };
    }

    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match" };
    }
    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    const res = await fetch("/api/auth/create-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// recipes endpoints functions

// GET
// all recipes

export async function fetchAllRecipes() {
  try {
    const res = await fetch("/api/recipes", { method: "GET" });
    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// by id

export async function fetchRecipeById(id: string) {
  try {
    const res = await fetch(`/api/recipes/${id}`, { method: "GET" });
    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// with query
// Exemple : /api/recipes/search?field=category&op==&value=dessert&sortBy=createdAt&sortDirection=desc&limit=5

export async function fetchRecipesWithQuery(
  field?: string,
  operator?: string,
  value?: string,
  sortBy: string = "createdAt",
  sortDirection: "asc" | "desc" = "desc",
  limit: number = 10
) {
  try {
    const query = new URLSearchParams({
      field: field || "",
      operator: operator || "",
      value: value || "",
      sortBy,
      sortDirection,
      limit: String(limit),
    });

    const res = await fetch(`/api/recipes/search?${query}`, { method: "GET" });
    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// UPDATE
// by id

export async function updateRecipeById(
  id: string,
  updatedData: {
    title?: string;
    "sub-title"?: string;
    "preparation-time"?: string;
    "price-per-serving"?: string;
    image?: string;
    description?: string;
    ingredients?: string[];
  } = {},
  currentData?: {
    title: string;
    "sub-title": string;
    "preparation-time": string;
    "price-per-serving": string;
    image?: string;
    description?: string;
    ingredients?: string[];
  }
) {
  try {
    if (!currentData) {
      throw new Error("Current data must be provided for comparison");
    }

    console.log("Current Data:", currentData);
    console.log("Updated Data:", updatedData);

    // delete unchanged fields
    const filteredUpdates: Record<
      string,
      string | string | string[] | undefined
    > = {};
    Object.keys(updatedData).forEach((key) => {
      const k = key as keyof typeof updatedData;
      // Check for both undefined and equality
      if (
        updatedData[k] !== undefined &&
        JSON.stringify(updatedData[k]) !== JSON.stringify(currentData[k])
      ) {
        filteredUpdates[key] = updatedData[k];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      return { success: false, error: "No changes detected" };
    }

    const res = await fetch(`/api/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filteredUpdates),
    });

    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// DELETE
// by id
export async function deleteRecipeById(id: string) {
  try {
    const res = await fetch(`/api/recipes/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// CREATE
// new recipe
export async function createNewRecipe(data: {
  title: string;
  "sub-title"?: string;
  "preparation-time": string;
  "price-per-serving": string;
  image?: string;
  description?: string;
  ingredients?: string[];
}) {
  try {
    // Basic validation
    if (
      !data.title ||
      !data["preparation-time"] ||
      !data["price-per-serving"]
    ) {
      return {
        success: false,
        error: "Title, preparation time, and price per serving are required",
      };
    }

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// FOR IMAGES

// POST : Upload Image
export const uploadImage = async (
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const reader = new FileReader();

    const fileData: string = await new Promise((resolve, reject) => {
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => reject(new Error("File reading error"));
      reader.readAsDataURL(file);
    });

    const res = await fetch("/api/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: fileData }),
    });
    const data = await res.json();
    if (res.ok && data.url) {
      return { success: true, url: data.url };
    } else {
      return {
        success: false,
        error: data.error || "Failed to upload image",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// DELETE : Delete Image
export const deleteImage = async (
  publicId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch("/api/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_id: publicId }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || "Failed to delete image",
      };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

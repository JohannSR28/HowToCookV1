"use client";
import PageTitle from "@/components/PageTitle";
import { useState, useEffect } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GobackButton from "@/components/GobackButton";
import { Plus, X } from "lucide-react";
import { Recipe } from "@/lib/type/Recipe";
import { toast } from "react-toastify";
import {
  fetchRecipeById,
  updateRecipeById,
  deleteImage,
  uploadImage,
} from "@/lib/api-function/test";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImagePreview from "@/components/ImagePreview";
import { extractPublicId } from "@/lib/utils";

export default function ShowRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const [formData, setFormData] = useState<Recipe | null>(null);
  const [oldFormData, setOldFormData] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Charger la recette
  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      try {
        const result = await fetchRecipeById(id);
        if (result?.success) {
          setFormData(JSON.parse(JSON.stringify(result.data)));
          setOldFormData(JSON.parse(JSON.stringify(result.data)));
          toast.success("Recipe loaded successfully.");
        } else {
          toast.error(result?.error || "Failed to fetch recipe.");
        }
      } catch (err) {
        toast.error(
          (err as Error)?.message || "Unexpected error while fetching recipe."
        );
      } finally {
        setLoading(false);
      }
    };
    loadRecipe();
  }, [id]);

  // Handlers génériques
  const handleFieldChange = (field: keyof Recipe, value: string) => {
    if (!formData) return;
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // Gestion des ingrédients
  const addIngredient = () => {
    if (!formData) return;
    setFormData((prev) =>
      prev ? { ...prev, ingredients: [...prev.ingredients, ""] } : prev
    );
  };
  const removeIngredient = (index: number) => {
    if (!formData) return;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
          }
        : prev
    );
  };
  const updateIngredient = (index: number, value: string) => {
    if (!formData) return;
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = value;
    setFormData((prev) =>
      prev ? { ...prev, ingredients: updatedIngredients } : prev
    );
  };

  // Validation
  const validateForm = (): string | null => {
    if (!formData) return "No recipe data";
    if (!formData.title?.trim()) return "Title is required";
    if (!formData["sub-title"]?.trim()) return "Subtitle is required";
    if (!formData["preparation-time"]?.trim())
      return "Preparation time is required";
    if (!formData["price-per-serving"]?.trim())
      return "Price per serving is required";
    if (!formData.description?.trim()) return "Description is required";
    if (formData.ingredients.length === 0)
      return "At least one ingredient is required";
    if (formData.ingredients.some((ing) => !ing.trim()))
      return "All ingredients must have content";
    return null;
  };

  // Update de la recette
  const handleUpdateRecipe = async () => {
    if (!formData) return;

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUpdating(true);
    try {
      let updatedFormData = { ...formData };

      // 1. Upload d'abord la nouvelle image si nécessaire
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile);

        if (!uploadResult.success || !uploadResult.url) {
          toast.error(uploadResult.error || "Image upload failed.");
          setIsUpdating(false);
          return;
        }

        updatedFormData = { ...updatedFormData, image: uploadResult.url };

        // 2. Supprimer l'ancienne image si besoin
        if (oldFormData?.image && oldFormData.image !== "/update.jpg") {
          const publicId = extractPublicId(oldFormData.image);
          if (publicId) {
            try {
              await deleteImage(publicId);
            } catch (err) {
              console.error("Failed to delete old image:", err);
              toast.error("Failed to delete old image. See console.");
            }
          }
        }
      }

      // 3. Mettre à jour la recette avec (nouvelle ou ancienne image)
      const result = await updateRecipeById(
        id,
        updatedFormData,
        oldFormData || undefined
      );

      if (result?.success) {
        toast.success("Recipe updated successfully!");
        setOldFormData(updatedFormData);
        setImageFile(null);
      } else {
        toast.error(result?.error || "Failed to update recipe.");
      }
    } catch (err) {
      toast.error(
        (err as Error)?.message || "Unexpected error while updating recipe."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Loading ou erreur
  if (loading)
    return (
      <div className="min-h-screen p-4">
        <PageTitle title="Loading Recipe..." />
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p>Loading recipe data...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );

  if (!formData)
    return (
      <div className="min-h-screen p-4">
        <PageTitle title="Recipe Not Found" />
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-bold mb-4">Recipe Not Found</h2>
              <p>The recipe you are looking for does not exist.</p>
              <GobackButton
                text="Go Back"
                destination={`/recipes/${id}/showRecipe`}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );

  // Render du formulaire
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <GobackButton text="Back" destination={`/recipes/${id}/showRecipe`} />
          <h1 className="text-2xl font-bold">Update Recipe</h1>
          <div className="w-16" />
        </div>

        <Card className="bg-white shadow-lg text-black">
          <CardHeader>
            <CardTitle>Edit Recipe Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="mb-2">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  placeholder="Enter recipe title"
                />
              </div>
              <div>
                <Label htmlFor="subtitle" className="mb-2">
                  Subtitle *
                </Label>
                <Input
                  id="subtitle"
                  value={formData["sub-title"]}
                  onChange={(e) =>
                    handleFieldChange("sub-title", e.target.value)
                  }
                  placeholder="Enter recipe subtitle"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prep-time" className="mb-2">
                  Preparation Time *
                </Label>
                <Input
                  id="prep-time"
                  value={formData["preparation-time"]}
                  onChange={(e) =>
                    handleFieldChange("preparation-time", e.target.value)
                  }
                  placeholder="e.g., 30 mins"
                />
              </div>
              <div>
                <Label htmlFor="price" className="mb-2">
                  Price per Serving *
                </Label>
                <Input
                  id="price"
                  value={formData["price-per-serving"]}
                  onChange={(e) =>
                    handleFieldChange("price-per-serving", e.target.value)
                  }
                  placeholder="e.g., $5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="mb-2">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                rows={3}
                placeholder="Enter recipe description"
              />
            </div>

            <ImagePreview
              initialUrl={oldFormData?.image || "/update.jpg"}
              onChange={(file) => setImageFile(file)}
            />

            <div>
              <Label className="mb-2 block">
                Ingredients * ({formData.ingredients.length})
              </Label>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                    disabled={formData.ingredients.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addIngredient}
                className="mt-2 bg-transparent"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Ingredient
              </Button>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                onClick={handleUpdateRecipe}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update Recipe"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

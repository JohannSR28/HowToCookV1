"use client";
import { useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GobackButton from "@/components/GobackButton";
import { Plus, X } from "lucide-react";
import { Recipe } from "@/lib/type/Recipe";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createNewRecipe } from "@/lib/api-function/test";
import ImagePreview from "@/components/ImagePreview";
import { uploadImage } from "@/lib/api-function/test";

export default function CreateRecipePage() {
  const [formData, setFormData] = useState({
    title: "",
    "sub-title": "",
    "preparation-time": "",
    "price-per-serving": "",
    description: "",
    ingredients: [""],
    image: "/update.jpg",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFieldChange = (field: keyof Recipe, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = value;
    setFormData((prev) => ({ ...prev, ingredients: updatedIngredients }));
  };

  const validateForm = (): string | null => {
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

  const handleCreateRecipe = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload new image if selected
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile);
        if (uploadResult && uploadResult.success && uploadResult.url) {
          setFormData((prev) => ({ ...prev, image: uploadResult.url! }));
        } else {
          toast.error(uploadResult?.error || "Image upload failed.");
          setIsSubmitting(false);
          return;
        }
        setImageFile(null);
      }

      const result = await createNewRecipe(formData);
      if (result?.success) {
        toast.success("Recipe created successfully!");
        // Optionally reset the form
        setFormData({
          title: "",
          "sub-title": "",
          "preparation-time": "",
          "price-per-serving": "",
          description: "",
          ingredients: [""],
          image: "/update.jpg",
        });
        setImageFile(null);
        setIsSubmitting(false);
        window.location.href = "/recipes"; // Redirect to recipes list
      } else {
        toast.error(result?.error || "Failed to create recipe.");
      }
    } catch (err) {
      toast.error(
        (err as Error)?.message || "Unexpected error while creating recipe."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <GobackButton text="Back" destination="/recipes" />
          <h1 className="text-2xl font-bold">Create Recipe</h1>
          <div className="w-16" />
        </div>

        <Card className="bg-white shadow-lg text-black">
          <CardHeader>
            <CardTitle>New Recipe Details</CardTitle>
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
              initialUrl={formData.image || "/update.jpg"}
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
                <Plus className="w-4 h-4 mr-2" />
                Add Ingredient
              </Button>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                onClick={handleCreateRecipe}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Create Recipe"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isSubmitting}
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

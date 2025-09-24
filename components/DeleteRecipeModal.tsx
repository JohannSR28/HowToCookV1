"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DeleteRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipeName: string;
}

export function DeleteRecipeModal({
  isOpen,
  onClose,
  onConfirm,
  recipeName,
}: DeleteRecipeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 bg-white">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Delete Recipe
        </h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium">&quot;{recipeName}&quot;</span>? This
          action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Recipe
          </Button>
        </div>
      </Card>
    </div>
  );
}

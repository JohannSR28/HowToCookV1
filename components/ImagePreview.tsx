"use client";
import React, { useState } from "react";
import Image from "next/image";

interface ImagePreviewProps {
  initialUrl: string;
  onChange?: (file: File) => void;
}

export default function ImagePreview({
  initialUrl,
  onChange,
}: ImagePreviewProps) {
  const [preview, setPreview] = useState<string>(initialUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local URL for preview
    const url = URL.createObjectURL(file);
    setPreview(url);

    // If the parent wants to handle the file
    if (onChange) {
      onChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Aperçu de l'image */}
      <div className="w-48 h-48 md:w-90 md:h-50 lg:w-90 lg:h-50 relative">
        <Image
          src={preview}
          alt="preview"
          fill
          style={{ objectFit: "cover", borderRadius: "0.5rem" }}
        />
      </div>

      {/* Bouton pour changer l'image */}
      <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Changer image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function UploadImages() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [allImages, setAllImages] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setUploadedUrl(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result;
      if (typeof base64data === "string") {
        try {
          const res = await fetch("/api/images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: base64data }),
          });
          const data = await res.json();
          setUploadedUrl(data.url);
          fetchAllImages(); // rafraîchir la liste après l'upload
        } catch (err) {
          console.error("Upload failed", err);
        } finally {
          setLoading(false);
        }
      }
    };
  };
  const fetchAllImages = async () => {
    try {
      const res = await fetch("/api/images", { method: "GET" });
      const data = await res.json();
      setAllImages(data.images);
    } catch (err) {
      console.error("Failed to fetch images", err);
    }
  };

  useEffect(() => {
    fetchAllImages();
  }, []);

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-lg bg-white text-black text-center">
        <h2 className="mb-6 text-2xl font-semibold text-black">Upload Image</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="block mx-auto mb-6 px-3 py-2 border border-gray-300 rounded cursor-pointer bg-gray-50 text-black file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {preview && (
          <div className="flex justify-center mb-4">
            <Image
              src={preview}
              alt="preview"
              width={200}
              height={200}
              className="w-48 h-48 object-cover rounded border border-gray-200"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mb-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {uploadedUrl && (
          <div>
            <p className="mb-2 text-green-600">Image uploaded successfully!</p>
            <Image
              src={uploadedUrl}
              alt="uploaded"
              width={200}
              height={200}
              className="w-48 h-48 object-cover rounded border border-gray-200"
            />
          </div>
        )}

        {/* Section pour toutes les images */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Toutes les images</h3>
          {allImages.length === 0 ? (
            <p>Aucune image pour le moment.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {allImages.map((url) => (
                <>
                  <Image
                    key={url}
                    src={url}
                    alt="image"
                    width={150}
                    height={150}
                    className="object-cover rounded border border-gray-200"
                  />
                  <p className="text-center text-sm text-gray-600">{url}</p>
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

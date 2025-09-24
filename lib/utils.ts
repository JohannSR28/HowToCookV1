import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractPublicId(cloudinaryUrl: string) {
  // Extract public ID from Cloudinary URL
  // Example: https://res.cloudinary.com/dtkaidzgh/image/upload/v1758670600/next-upload-demo/ak8usxbykzsx63abijxr.png
  // Returns: next-upload-demo/ak8usxbykzsx63abijxr

  if (cloudinaryUrl === "/update.jpg") {
    return null;
  }

  try {
    const urlParts = cloudinaryUrl.split("/");
    const uploadIndex = urlParts.indexOf("upload");

    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL");
    }

    // Get everything after version number (or upload if no version)
    let pathAfterUpload = urlParts.slice(uploadIndex + 1);

    // Remove version if present (starts with 'v' followed by numbers)
    if (pathAfterUpload[0] && pathAfterUpload[0].match(/^v\d+$/)) {
      pathAfterUpload = pathAfterUpload.slice(1);
    }

    // Join the remaining parts and remove file extension
    const fullPath = pathAfterUpload.join("/");
    const publicId = fullPath.replace(/\.[^/.]+$/, ""); // Remove file extension

    console.log("Extracted public ID:", publicId);

    return publicId;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
}

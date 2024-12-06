import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Route for image uploads
  imageUploader: f({
    image: { maxFileSize: "1MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Image file URL:", file.url);
    return { uploadedBy: metadata?.userId };
  }),

  // Route for PDF uploads
  pdfUploader: f({
    pdf: { maxFileSize: "10MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("PDF file URL:", file.url);
    return { uploadedBy: metadata?.userId };
  }),
};

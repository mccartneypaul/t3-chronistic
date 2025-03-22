// "use client";

// import { FileError, FileRejection, useDropzone } from "react-dropzone";
// import React, { useState } from "react";
// import { uploadImageToS3 } from "@/app/actions/s3";

// const MAX_FILE_SIZE_MB = 2;
// const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
// const MAX_IMAGE_COUNT = 3;

// const Dropzone = () => {
//   const [uploading, setUploading] = useState<boolean>(false);

//   const typeValidator = (file: File): FileError | null => {
//     if (file.size > MAX_FILE_SIZE_BYTES) {
//       return {
//         code: "size-too-large",
//         message: `Image file is larger than ${MAX_FILE_SIZE_MB}MB.`,
//       };
//     }
//     return null;
//   };

//   const onDrop = async (
//     acceptedFiles: File[],
//     rejectedFiles: FileRejection[]
//   ) => {
//     if (rejectedFiles.length > 0) {
//       alert(
//         `You're trying to upload a file larger than ${MAX_FILE_SIZE_MB}MB. Please try again.`
//       );
//       return;
//     }

//     setUploading(true);

//     try {
//       const formData = new FormData();
//       acceptedFiles.forEach((file) => formData.append("file", file));

//       await uploadImageToS3(formData, {
//         bucket: process.env.NEXT_PUBLIC_BUCKET!, 
//         key: `${Date.now()}`, 
//       });

//       alert("Files uploaded successfully!");

//     } catch (error) {
//       console.error("Error uploading image to S3:", error);
//       alert("Failed to upload image to S3. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     validator: typeValidator,
//     accept: {
//       "image/jpeg": [],
//       "image/png": [],
//       "image/webp": [],
//       "image/jpg": [],
//     },
//     maxSize: MAX_FILE_SIZE_BYTES,
//     maxFiles: MAX_IMAGE_COUNT,
//   });

//   return (
//     <div>
//       <div
//         {...getRootProps()}
//         className="border-2 border-dashed border-slate-200 rounded-lg hover:bg-slate-100/50 cursor-pointer duration-200 p-8 text-center"
//       >
//         <input {...getInputProps()} />
//         {isDragActive ? (
//           <p>Drop the files here ...</p>
//         ) : (
//           <p className="text-slate-400">
//             {`Drag and drop some files here, or click to select files (up to ${MAX_IMAGE_COUNT} images, max ${MAX_FILE_SIZE_MB}MB each)`}
//           </p>
//         )}
//       </div>

//       {uploading && <p>Uploading...</p>}
//     </div>
//   );
// };

// export default Dropzone;

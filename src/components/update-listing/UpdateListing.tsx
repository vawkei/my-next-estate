"use client";

import LeftSide from "./LeftSide";

export default function UpdateListingComponent() {


  return (
    <div>
      <h1 className="font-extrabold text-2xl text-center">Create Listing</h1>
      <div className="">
        <LeftSide />
      </div>
    </div>
  );
}








// const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = e.target.files;

//     if (!selectedFiles) {
//       return console.log("Error:no image selected");
//     }

//     const selectedFilesArray = Array.from(selectedFiles);
//     const imagesArray = selectedFilesArray.map((file: File) => {
//       return URL.createObjectURL(file);
//     });

//     setImages((prevImages) => prevImages.concat(selectedFilesArray));
//     setSelectedImages((prevImages) => prevImages.concat(imagesArray));
//   };

//   const removeImage = (image: string) => {
//     const imageIndex = selectedImages.indexOf(image);
//     setSelectedImages(selectedImages.filter((img) => img !== image));

//     setImages((prev) => prev.filter((_, index) => index !== imageIndex));
//     URL.revokeObjectURL(image);
//   };

//   const uploadImage = async () => {
//     if (!images.length) {
//       console.log("select image");
//       return;
//     }
//     console.log("images:", images);

//     setUploading(true);

//     const imageUrls: string[] = [];

//     try {
//       for (let i = 0; i < images.length; i++) {
//         const file = images[i];
//         console.log("x_file:", file);

//         const formData = new FormData();
//         console.log("formData:", formData);

//         const x_file2 = formData.append("file", file);
//         console.log("x_file2:", x_file2);

//         const response = await fetch("/api/upload", {
//           method: "POST",
//           body: formData,
//         });

//         const imgData = await response.json();
//         console.log("imgData:", imgData);

//         if (imgData?.results?.secure_url) {
//           imageUrls.push(imgData?.result?.secure_url);
//           setProgress(imageUrls.length);
//           console.log("we got it here...");
//         }

//         if (imageUrls.length === images.length) {
//           setSecuredUrls((prev) => prev.concat(imageUrls));
//           setUploading(false);
//           setSelectedImages([]);
//           setProgress(0);
//         }
//       }
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : "couldn't upload images";
//       console.log("Error message:", message);
//       setUploading(false);
//       setImages([]);
//       setSelectedImages([]);
//       setProgress(0);
//     }
//   };


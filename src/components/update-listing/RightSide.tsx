"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";


interface SecuredUrls{
  securedUrls:string[];
  error:string
  setSecuredUrls:React.Dispatch<React.SetStateAction<string[]>>
}

export default function RightSide(props:SecuredUrls) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]); //img frm my pc
  const [images, setImages] = useState<File[]>([]); //upload 2 cloudinary

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

 

  const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    //📒📒This `FileList` contains the actual files the user selected.It looks like an array (you can access items using selectedFiles[0], selectedFiles.length), but it’s not a real array.That’s why we convert it to an array using Array.from() if we want to .map() or .concat() it.📒📒

    if (!selectedFiles) {
      return;
    }
    const selectedFilesArray = Array.from(selectedFiles);
    const imagesArray = selectedFilesArray.map((file: File) => {
      return URL.createObjectURL(file);

      //📒📒 You're creating preview URLs for each image using the browser's built-in URL.createObjectURL() function.This generates a temporary URL that lets you display the image in the browser before uploading.Example output: "blob:http://localhost:3000/abc-123..."📒📒
    });

    setImages((prevImages) => prevImages.concat(selectedFilesArray));
    setSelectedImages((prevImages) => prevImages.concat(imagesArray));
  };

  const removeImage = (image: string) => {
    const imageIndex = selectedImages.indexOf(image);
    setSelectedImages(selectedImages.filter((img) => img !== image));
    // setImages(images.filter((index)=>index !==imageIndex));

    setImages((prev) => prev.filter((_, index) => index !== imageIndex));
    // 📒📒 filter((_, i) => i !== imageIndex) uses the second parameter of .filter() which gives you the index.So we’re now filtering out the File at imageIndex.You're ignoring the element (_) and using the index to exclude the one that matches imageIndex.📒📒
    URL.revokeObjectURL(image);
  };

  const uploadImage = async () => {
    if (images.length === 0) {
      console.log("select image");
      return;
    }
    console.log("images:", images);

    setUploading(true);

    const imageUrls: string[] = [];

    try {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        console.log("x_file:", file);

        const formData = new FormData();
        console.log("formData:", formData);

        const x_file2 = formData.append("file", file);
        console.log("x_file2:", x_file2);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const imgData = await response.json();
        console.log("imgData:", imgData);

        if (imgData?.result?.secure_url) {
          imageUrls.push(imgData?.result?.secure_url);
          setProgress(imageUrls.length);
          console.log("we got it here...")
        };

        if (imageUrls.length === images.length) {
          props.setSecuredUrls((prevFiles) => prevFiles.concat(imageUrls));
          setUploading(false);
          console.log("imageUrls:", imageUrls);
          // console.log("securedUrls:", securedUrls);
          setSelectedImages([]);
          setProgress(0);
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "couldn't upload images";
      console.log("Error message:", message);
      setUploading(false);
      setImages([]);
      setSelectedImages([]);
      setProgress(0);
    }
  };

  useEffect(()=>{
      console.log("securedUrls:", props.securedUrls);
  },[props.securedUrls]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col flex-wrap mb-4">
        <p className="mt-4">
          <span className="font-bold">Images:</span>The first image will be the
          cover (max 6)
        </p>

        <div className="flex flex-row items-center gap-4">
          <div>
            <input
              type="file"
              placeholder="Name"
              onChange={addImages}
              multiple
              accept="image/*"
              className="p-3 border rounded-2xl mt-4"
            />
            <br />
            {selectedImages.length > 0 &&
              (selectedImages.length > 5 ? (
                <p>
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  You can't upload more than 5 images
                  <br />
                  <span>
                    Remove <b>{selectedImages.length - 5}</b>of them.
                  </span>
                </p>
              ) : (
                <div>
                  <button
                    onClick={uploadImage}
                    className="bg-black p-3 mt-4 text-white">
                    {uploading
                      ? `uploading ${progress} of ${images.length} images`
                      : `Upload`}
                  </button>
                </div>
              ))}
            {/* ==========================View selected Images=================== */}
            <div
              className={`${
                selectedImages.length > 0
                  ? "flex  flex-wrap border border-solid rounded-2xl overflow-hidden bg-slate-500 mt-4 text-white p-3"
                  : ""
              }`}>
              {selectedImages.length > 0 &&
                selectedImages.map((image, index) => {
                  return (
                    <div key={index} className="w-32 m-4">
                      <Image src={image} width={200} alt="product-image" />
                      <button onClick={() => removeImage(image)}>
                        <BsTrash size={25} />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
          {/* <div>
            <button className="bg-black p-3 mt-4 text-white">Upload</button>
          </div> */}
        </div>
      </div>
      <div className="flex flex-col">
        <button className="bg-black p-3 text-white rounded-2xl">
          Update Listing
        </button>
        {props.error&& <p className="text-red-600 text-center text-sm">{props.error}</p>}
      </div>
    </div>
  );
}

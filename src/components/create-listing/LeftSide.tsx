"use client";

import React, { useState } from "react";
import RightSide from "./RightSide";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default function LeftSide() {
  const { user } = useUser();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [securedUrls, setSecuredUrls] = useState<string[]>([]);

  const router = useRouter();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  console.log(formData);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // const target = event.target;
    console.log(event.target)
    //typed w in the anme field:
    // <input type="text" placeholder="Name" class="p-3 border rounded-2xl" id="name" maxlength="14" minlength="4" required="" value="w">

    if (event.target.id === "sale" || event.target.id === "rent") {
      setFormData({
        ...formData,
        type: event.target.id,
      });
      //clicked sale:
      // <input type="checkbox" class="p-3" id="sale">
      // {imageUrls: Array(0), name: '', description: '', address: '', type: 'sale', …}this gets updated to sale from rent.
    }
    if (
      event.target.id === "parking" ||
      event.target.id === "furnished" ||
      event.target.id === "offer"
    ) {
      if (event.target instanceof HTMLInputElement) {
        setFormData({
          ...formData,
          [event.target.id]: event.target.checked,
        });
        // clicked furnished:
        // <input type="checkbox" class="p-3" id="furnished">
      }
    }
    if (
      event.target instanceof HTMLTextAreaElement ||
      event.target.type === "number" ||
      event.target.type === "text"
      // dont really understand this part
    ) {
      setFormData({
        ...formData,
        [event.target.id]: event.target.value,
      });
    }
  };


  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!securedUrls || securedUrls.length === 0) {
      console.log("Error: Please upload image. securedUrls is empty");
      return;
    }

    const filledFormData = {
      imageUrls: securedUrls,
      name: formData.name,
      description: formData.description,
      address: formData.address,
      type: formData.type,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      regularPrice: formData.regularPrice,
      discountPrice: formData.discountPrice,
      offer: formData.offer,
      parking: formData.parking,
      furnished: formData.furnished,
    };

    if (filledFormData.discountPrice > filledFormData.regularPrice) {
      console.log("Discount price must be lower than regular price");
      return setError("Discount price must be lower than regular price");
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/listing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...filledFormData,
          userMongoId: user?.publicMetadata.userMongoId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send...");
      }

      const data = await response.json();
      console.log("data:", data);
      setIsLoading(false);

      router.push(`/listing/${data._id}`);
      console.log("It seems to be perfectly wired...");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "failed to create listing";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };

  // if(!isSignedIn){
  //   return(
  //     <h1 className="text-center text-xl my-7 font-semibold">You are not authorized to view this page</h1>
  //   )
  // };

  return (
    // <div  className="max-w-4xl mx-auto">
    <main>
      {isLoading && <p>Loading...</p>}
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 w-full sm:flex-row">
        {/* 👇👇=========== Top: Name,Description,Address========== 👇👇*/}
        <div className="flex flex-col sm:w-1/2">
          <div className="flex flex-col flex-wrap mb-4">
            <input
              type="text"
              placeholder="Name"
              className="p-3 border rounded-2xl"
              id="name"
              maxLength={14}
              minLength={4}
              required
              onChange={handleChange}
              value={formData.name}
            />
          </div>
          <div className="flex flex-col flex-wrap mb-4">
            <textarea
              name=""
              id="description"
              // type="text"
              rows={3}
              className="border rounded-2xl p-3"
              placeholder="Description"
              onChange={handleChange}
              value={formData.description}
            />
          </div>
          <div className="flex flex-col flex-wrap mb-4">
            <input
              type="text"
              placeholder="Address"
              className="p-3 border rounded-2xl"
              onChange={handleChange}
              value={formData.address}
              id="address"
            />
          </div>

          {/* 👇👇=========== Middle-1: Sell,Rent,P.Lot,Offer========== 👇👇*/}
          <div className="flex flex-row items-center gap-3 flex-wrap ">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="p-3"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <p className="font-bold">Sell</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="p-3"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <p className="font-bold">Rent</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="p-3"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
              />
              <p className="font-bold">Parking Spot</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="p-3"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <p className="font-bold">Furnished</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="p-3"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
              />
              <p className="font-bold">Offer</p>
            </div>
            {/* 👇👇=========== Middle-2: Beds,Baths,R.Price========== 👇👇*/}
            <div className="flex items-center gap-3 flex-wrap">
              {/* <div className="flex flex-row items-center gap-3 flex-wrap "> */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  min={1}
                  max={5}
                  required
                  className="border rounded-lg p-3"
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <p className="font-bold">Beds</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  min={1}
                  max={5}
                  className="border rounded-lg p-3"
                  required
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <p className="font-bold">Baths</p>
              </div>

              <div className="flex flex-row gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="regularPrice"
                    min={50}
                    max={1000000}
                    className="border rounded-lg p-3"
                    required
                    onChange={handleChange}
                    value={formData.regularPrice}
                  />
                  <p className="font-bold">Regular Price</p>
                  <span className="text-green-400">{`$/month`}</span>
                </div>
                {formData.offer && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="discountPrice"
                      min={0}
                      max={1000000}
                      className="border rounded-lg p-3"
                      required
                      onChange={handleChange}
                      value={formData.discountPrice}
                    />
                    <p className="font-bold">Discount Price</p>
                    <span className="text-green-400">{`$/month`}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="sm:w-1/2">
          <RightSide
            securedUrls={securedUrls}
            setSecuredUrls={setSecuredUrls}
            error={error}
          />
        </div>
      </form>
    </main>
  );
}

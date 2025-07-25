import Image from "next/image";
import React from "react";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from "react-icons/fa";

// 👇👇
// interface Props {
//   params: { id: string };
// }
//📒📒this gives an error in build time using NEXTJS 15, but works well on next@14.x
//react@18.x typescript@5.4.x, So i am using a work around i found on: https://stackoverflow.com/questions/79124951/type-error-in-next-js-route-type-params-id-string-does-not-satis . 📒📒
// 👆👆

// 👇 Workaround interface for Next.js 15 type bug
interface Props {
  params: Promise<{ id: string }>;
}

const Listing = async ({ params }: Props) => {
  const { id } = await params; // ✅ This line unpacks the promised params

  let listing = null;

  try {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/listing/get`,
      {
        method: "POST",
        // body: JSON.stringify({ listingId: params.id }),
        body: JSON.stringify({ listingId: id }),
        cache: "no-store",
      }
    );

    const data = await result.json();
    listing = data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "something went wrong";
    console.log("Error message:", message);
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text:2xl">
          {message}
        </h2>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text:2xl">
          Listing not found
        </h2>
      </main>
    );
  }

  return (
    <div>
      <div>
        <Image
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="w-full h-[400px] object-cover"
        />
        <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
          <p className="text-2xl font-semibold">
            {listing.name} - ${" "}
            {listing.offer
              ? listing.discountPrice.toLocaleString()
              : listing.regularPrice.toLocaleString()}
            {listing.type === "rent" && "/month"}
          </p>
          <p className="text-2xl font-semibold">
            <FaMapMarkerAlt className="text-green-600" />
            {listing.address}
          </p>
          <div className="flex gap-4">
            <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
              {listing.type === "rent" ? "for rent" : "for sale"}
            </p>
            {listing.offer && (
              <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                ${listing.regularPrice - listing.discountPrice} OFF
              </p>
            )}
          </div>
          <p className="text-slate-800">
            <span className="font-semibold text-black">Description - </span>
            {listing.description}
          </p>
          <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
            <li className="flex items-center gap-1 whitespace-nowrap">
              <FaBed className="text-lg" />
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </li>
            <li className="flex items-center gap-1 whitespace-nowrap">
              <FaBath className="text-lg" />
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} baths`}
            </li>
            <li className="flex items-center gap-1 whitespace-nowrap">
              <FaParking className="text-lg" />

              {listing.parking ? "Parking spot" : "No parking"}
            </li>
            <li className="flex items-center gap-1 whitespace-nowrap">
              <FaChair className="text-lg" />

              {listing.furnished ? "Furnished" : "Unfurnished"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Listing;

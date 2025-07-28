// import Listing from "@/lib/models/listing";

import Link from "next/link";
import { NextResponse } from "next/server";
import ListingItem from "@/components/listing-item/ListingItem";
import hero from "../../public/sahandkey.jpeg"
import Image from "next/image";

interface Listing {
  _id: string;
  name: string;
  description: string;
  imageUrls: string[];
  price: number;
  address: string;
  regularPrice: number;
  offer: number;
  discountPrice: number;
  type: string;
  bathrooms: number;
  bedrooms: number;
}

export default async function Home() {
  let rentListing = null;

  // `${process.env.NEXT_PUBLIC_BASE_URL}/api/listing/get`

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/listing/get`, {
      method: "POST",
      body: JSON.stringify({
        type: "rent",
        limit: 4,
        order: "asc",
      }),
      cache: "no-store",
    });

    const data = await response.json();
    console.log("data:",data)
    rentListing = data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "failed to load rent listing";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  let saleListing = null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/listing/get`, {
      method: "POST",
      body: JSON.stringify({
        type: "sale",
        limit: 4,
        order: "asc",
      }),
      cache: "no-store",
    });
    const data = await response.json();
    console.log("data:",data)
    saleListing = data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "failed to load sale listing";
    return NextResponse.json({ error: message }, { status: 500 });
  }
  let offerListings = null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/listing/get`, {
      method: "POST",
      body: JSON.stringify({
        offer: true,
        limit: 4,
        order: "asc",
      }),
      cache: "no-store",
    });
    const data = await response.json();
    console.log("data:",data)
    offerListings = data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "failed to load offer listing";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return (
    // <div className="flex items-center justify-center h-screen">
    // 👆center a div using tailwind👆
    <div>
      <h1>Home</h1>
      <div className="flex flex-col gap-6">
        <h1>
          Find your next <span>perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          My estate is the best place to find your next perfect place to live.{" "}
          <br />
          We have a wide range of properties to choose from.
        </div>
        <Link
          href={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
          Let&apos;s get started...
        </Link>
      </div>
       <Image src={hero} className="w-full h-[550px] object-cover" alt="hero"/> 
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-500">
                Recent Offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                href={"/search?offer=true"}>
                Show more Listings
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing:Listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent place for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                href={"/search?type=rent"}>
                Show more Listings
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListing.map((listing: any) => (
                <ListingItem listing={listing} key={listing.id} />
              ))}
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent place for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                href={"/search?type=sale"}>
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListing.map((listing: any) => (
                <ListingItem listing={listing} key={listing.id} />
              ))}
            </div>
          </div>
        )}  
      </div>
    </div>
  );
}

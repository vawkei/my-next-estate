import Listing from "@/lib/models/listing";
import connect from "@/lib/db/connect";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const user = await currentUser();

  try {
    await connect();
    const data = await req.json();
    console.log("data:", data);

    if (!user || user.publicMetadata.userMongoId !== data.userMongoId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }

    const newListing = await Listing.findByIdAndUpdate(
      data.listingId,
      {
        $set: {
          name: data.name,
          description: data.description,
          address: data.address,
          regularPrice: data.regularPrice,
          discountPrice: data.discountPrice,
          bathrooms: data.bathrooms,
          bedrooms: data.bedrooms,
          furnished: data.furnished,
          parking: data.parking,
          type: data.type,
          offer: data.offer,
          imageUrls: data.imageUrls,
        },
      },
      { new: true }
    );
    // await newListing.save(); not necessary
    return NextResponse.json(newListing, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "something went wrong";
    console.log("Error message:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
};

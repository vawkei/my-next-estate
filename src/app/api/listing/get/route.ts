import Listing from "@/lib/models/listing";
import connect from "@/lib/db/connect";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  await connect();
  const data = await req.json();

  try {
    const startIndex = parseInt(data.startIndex) || 0;
    const limit = parseInt(data.limit) || 9;
    const sortDirection = data.order === "asc" ? 1 : -1;

    let offer = data.offer;
    if (offer === undefined || offer === false) {
      offer = { $in: [false, true] };
    }

    let furnished = data.furnished;
    if (furnished === undefined || furnished === false) {
      furnished = { $in: [false, true] };
    }

    let parking = data.parking;
    if (parking === undefined || parking === false) {
      parking = { $in: [false, true] };
    }

    let type = data.type;
    if (type === undefined || parking === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const listings = await Listing.find({
      ...(data.userId && { userId: data.userId }),
      ...(data.listingId && { _id: data.listingId }),
      ...(data.searchTerm && {
        $or: [
          { name: { $regex: data.searchTerm, $options: "i" } },
          { description: { $regex: data.searchTerm, $options: "i" } },
        ],
      }),
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    return new Response(JSON.stringify(listings), { status: 200 });
    // return NextResponse.json({listings:JSON.stringify(listings)},{status:200})
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "something went wrong";
    console.log("Error getting posts:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
};

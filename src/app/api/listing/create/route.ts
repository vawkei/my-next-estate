import Listing from "@/lib/models/listing";
import connect from "@/lib/db/connect";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export const POST =async (req:NextRequest)=>{
    const user = await currentUser();
    try{
        await connect();
        const data = await req.json();
        if(!user || user.publicMetadata.userMongoId !== data.userMongoId){
            console.log("Unauthorized")
            return NextResponse.json({error:"Unauthorized"},{status:401})
        };

        const newListing = await Listing.create({
            userRef:user.publicMetadata.userMongoId,
            name:data.name,
            description:data.description,
            address:data.address,
            regularPrice:data.regularPrice,
            discountPrice:data.discountPrice,
            bathrooms:data.bathrooms,
            bedrooms:data.bedrooms,
            furnished:data.furnished,
            parking:data.parking,
            type:data.type,
            offer:data.offer,
            imageUrls:data.imageUrls
        });
        await newListing.save();
        return new Response(JSON.stringify(newListing),{status:201})
    }catch(error){
        const message = error instanceof Error?error.message:"something went wrong";
        console.log("Error message:",message)
        return NextResponse.json({error:message},{status:500})
    }
}
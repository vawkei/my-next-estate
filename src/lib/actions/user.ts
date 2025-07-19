import User from "../models/user";
import connect from "../db/connect";
import { ClerkType } from "@/app/interface";
import { NextResponse } from "next/server";

export const createOrUpdateUser = async (clerkUser:ClerkType["data"]) => {
  console.log("about to run cretaeOrUpdateUser...");
  console.log(`clerkUser:${clerkUser}`)
  console.log(`clerkUser_id:${clerkUser.id}`)
  console.log(`clerkUser_firstname:${clerkUser.first_name}`)
  try {
    await connect();
      console.log("connected sussfully...")
    const user = await User.findOneAndUpdate(
      { clerkId: clerkUser.id },
      {
        $set: {
          first_name: clerkUser.first_name,
          last_name: clerkUser.last_name,
          email:clerkUser.email_addresses[0].email_address || "",
          image_url: clerkUser.image_url,
        },
      },
      { upsert: true, new: true }
    );
    console.log("user:", user);
    return user;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "something went wrong";
    console.log(`Error createOrUpdateUser:`, message);
    return new Response(`Error createOrUpdateUser:${message}`, { status: 500 });
  }
};

export const deleteUser = async (id: string) => {
  try {
    await connect();
    await User.findByIdAndDelete({ clerkId: id });
    return NextResponse.json({ message: "user deleted" }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "couldn't delete user";
    console.log("couldn't delete user");
    return NextResponse.json({ error: message }, { status: 500 });
  }
};

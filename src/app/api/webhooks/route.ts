import { Webhook } from "svix";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ClerkType } from "@/app/interface";

export async function POST(req: Request) {
  console.log("Webhook route hit...");

  // interface ClerkType {
  //   data: {
  //     id: string;
  //     first_name: string;
  //     last_name: string;
  //     image_url: string;
  //     email_addresses: [object];
  //   };
  //   type: "user.created" | "user.updated" | "user.deleted";
  // }

  const SIGNIN_SECRET = process.env.SIGNIN_SECRET;
  console.log("signin secret:", SIGNIN_SECRET);

  if (!SIGNIN_SECRET) {
    console.log("No sign in secret key detected..");
    throw new Error("SIGNIN_SECRET is required");
  }

  console.log("confirmed signin secret");

  const wh = new Webhook(SIGNIN_SECRET);

  const svix_id = req.headers.get("svix-id") ?? "";
  const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
  const svix_signature = req.headers.get("svix-signature") ?? "";
  console.log({
    svix_id: svix_id,
    svix_timestamp: svix_timestamp,
    svix_signature: svix_signature,
  });

  let evt;

  console.log("about to retrieve the body");
  const body = await req.text();
  console.log("body retrieved:", body);

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-signature": svix_signature,
      "svix-timestamp": svix_timestamp,
    }) as ClerkType;
    console.log("webhook verified...", evt);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "verification failed";
    console.log(message);
    return NextResponse.json(
      { error: `verification error:${message}` },
      { status: 500 }
    );
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { first_name, last_name, email_addresses, image_url } = evt.data;

    try {
      const user = await createOrUpdateUser(
        { id, first_name, last_name, email_addresses, image_url } //pass it as a single object
      );
      console.log("id:",id);
      console.log("_id:",user._id);

      if (user && eventType === "user.created") {
        try {
          const clerk = await clerkClient();
          await clerk.users.updateUserMetadata(id, {
            publicMetadata: {
              userMongoId: user._id,
            },
          });
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "couldnt create or update user in db";
          console.log("Error:", message);
          return NextResponse.json({ error: message }, { status: 500 });
        }
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "couldnt create or update user in db";
      console.log("Error:", message);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    try {
      await deleteUser(id);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "couldnt delete user";
      console.log("Error:", message);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}

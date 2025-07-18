import { Webhook } from "svix";
import { createOrUpdateUser } from "@/lib/actions/user";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("Webhook route hit...");

  interface ClerkType {
    data: { id: string };
    type: {};
  }

  const SIGNIN_SECRET = process.env.SIGNIN_SECRET as string;
  if (!SIGNIN_SECRET) {
    console.log("No sign in secret key detected..");
  }

  const wh = new Webhook(SIGNIN_SECRET);

  const svix_id = req.headers.get("svix-id") ?? "";
  const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
  const svix_signature = req.headers.get("svix-signature") ?? "";

  let evt;

  const body = await req.text();

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-signature": svix_signature,
      "svix-timestamp": svix_timestamp,
    }) as ClerkType;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "verification failed";
    console.log(message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const {} = evt.data;

    try {
      const user = await createOrUpdateUser();

      if (user && eventType === "user.created") {
        try {
          const clerk = await clerkClient();
          // clerk.users.updateUserMetadata(id, {
          //   publicMetadata: {
          //     userMongoId: user._id,
          //   },
          // });
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
}

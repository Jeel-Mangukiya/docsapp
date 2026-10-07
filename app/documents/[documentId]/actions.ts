"use server";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {ConvexHttpClient} from "convex/browser";

export async function getDocuments(ids: Id<"documents">[]) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl || convexUrl.includes("placeholder")) {
    return [];
  }
  const convex = new ConvexHttpClient(convexUrl);
  return await convex.query(api.documents.getByIds, { ids });
}

export async function getUsers() {
  const { sessionClaims } = await auth();
  const clerk = await clerkClient();

  const response = await clerk.users.getUserList({
    organizationId: sessionClaims?.org_id ? [sessionClaims.org_id as string] : [],
  });

  const users = response.data.map((user) => ({
    id: user.id,
    name:
      user.fullName ??
      user.primaryEmailAddress?.emailAddress ??
      "Anonymous",
    avatar: user.imageUrl,
    color:""
  }));

  return users;
}
// import {Liveblocks} from "@liveblocks/node";
// import { ConvexHttpClient } from "convex/browser";
// import { auth, currentUser } from "@clerk/nextjs/server";
// import { api } from "@/convex/_generated/api";

// const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// const liveblocks = new Liveblocks({
//         secret: process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET!,
//     });
// export async function POST(req : Request) {
//     const {sessionClaims} = await auth();
//     if(!sessionClaims){
//         return new Response("Unauthorized", {status: 401});
//     }
//     const user = await currentUser();
//     if(!user){
//         return new Response("Unauthorized", {status: 401});
//     }

//     const {room} = await req.json();
//     const document = await convex.query(api.documents.getById, {id: room});

//     if(!document){
//         return new Response("Unauthorized", {status: 404});
//     }

//     const isOwner = document.ownerId === user.id;
//     const isOrganizationMember = document.organizationId === sessionClaims.org_id;

//     if(!isOwner && !isOrganizationMember){
//         return new Response("Unauthorized", {status: 401});
//     }

//     const session = liveblocks.prepareSession(user.id,{
//         userInfo: {
//             name: user.fullName ?? "Anonymous",
//             avatar: user.imageUrl,
//         },
//     });

//     session.allow(room,session.FULL_ACCESS);

//     const {body,status} = await session.authorize();

//     return new Response(body,{status});


// }






// import { Liveblocks } from "@liveblocks/node";
// import { ConvexHttpClient } from "convex/browser";
// import { auth, currentUser } from "@clerk/nextjs/server";
// import { api } from "@/convex/_generated/api";

// const convex = new ConvexHttpClient(
//   process.env.NEXT_PUBLIC_CONVEX_URL!
// );

// const liveblocks = new Liveblocks({
//   secret: process.env.LIVEBLOCKS_SECRET_KEY!,
// });

// export async function POST(req: Request) {
//   const { sessionClaims } = await auth();

//   if (!sessionClaims) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const user = await currentUser();

//   if (!user) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const { room } = await req.json();

//   const document = await convex.query(api.documents.getById, {
//     id: room,
//   });

//   if (!document) {
//     return new Response("Document not found", { status: 404 });
//   }

//   const isOwner = document.ownerId === user.id;
//   const isOrganizationMember =
//     !!(document.organizationId &&document.organizationId === sessionClaims.org_id);

//   if (!isOwner && !isOrganizationMember) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const session = liveblocks.prepareSession(user.id, {
//     userInfo: {
//       name: user.fullName ?? "Anonymous",
//       avatar: user.imageUrl,
//     },
//   });

//   session.allow(room, session.FULL_ACCESS);

//   const { body, status } = await session.authorize();

//   return new Response(body, { status });
// }






// import { Liveblocks } from "@liveblocks/node";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const liveblocks = new Liveblocks({
//   secret: process.env.LIVEBLOCKS_SECRET_KEY!,
// });

// export async function POST(req: Request) {
//   try {
//     const { room } = await req.json();

//     const { userId, orgId } = await auth();

//     if (!userId) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const session = liveblocks.prepareSession(userId, {
//       userInfo: {
//         name: userId,
//       },
//     });

//     // Allow access to this room
//     session.allow(room, session.FULL_ACCESS);

//     const { body, status } = await session.authorize();

//     return new Response(body, { status });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Liveblocks auth failed" },
//       { status: 500 }
//     );
//   }
// }



import { Liveblocks } from "@liveblocks/node";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const { room } = await req.json();

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`;

    const name =  user.fullName ?? user.primaryEmailAddress?.emailAddress ?? 'Anonymous';

    const nameToNumber = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = Math.abs(nameToNumber) % 360;
    const color = `hsl(${hue}, 80%, 60%)`;

    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name,
        avatar: user.imageUrl,
        color,
      },
    });

    session.allow(room, session.FULL_ACCESS);

    const { body, status } = await session.authorize();

    return new Response(body, { status });
  } catch (error) {
    return NextResponse.json(
      { error: "Liveblocks auth failed" },
      { status: 500 }
    );
  }
}



// import { Liveblocks } from "@liveblocks/node";
// import { auth, currentUser } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";
// import { ConvexHttpClient } from "convex/browser";
// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";

// const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// const liveblocks = new Liveblocks({
//   secret: process.env.LIVEBLOCKS_SECRET_KEY!,
// });

// export async function POST(req: NextRequest) {
//   try {
//     const { sessionClaims } = await auth();
//     const user = await currentUser();

//     if (!sessionClaims || !user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { room } = await req.json();

//     const document = await convex.query(api.documents.getById, {
//       id: room as Id<"documents">,
//     });

//     if (!document) {
//       return NextResponse.json({ error: "Document not found" }, { status: 404 });
//     }

//     const organizationId = sessionClaims.org_id as string | undefined;
//     const organizationRole = sessionClaims.org_role as string | undefined;

//     const isOwner = document.ownerId === user.id;
//     const isOrganizationMember =
//       !!organizationId && document.organizationId === organizationId;
//     const isAdmin =
//       organizationRole === "org:admin" || organizationRole === "org:owner";

//     // Personal document — only owner can access
//     if (!document.organizationId) {
//       if (!isOwner) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//       }
//     }

//     // Organization document — any member of the same org can access
//     if (document.organizationId) {
//       if (!isOwner && !isOrganizationMember && !isAdmin) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//       }
//     }

//     const name =
//       user.fullName ??
//       user.emailAddresses[0]?.emailAddress ??
//       "Anonymous";

//     const image = user.imageUrl;

//     const session = liveblocks.prepareSession(user.id, {
//       userInfo: { name, image },
//     });

//     session.allow(room, session.FULL_ACCESS);

//     const { status, body } = await session.authorize();

//     return new NextResponse(body, { status });
//   } catch (error) {
//     console.error("Liveblocks auth error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
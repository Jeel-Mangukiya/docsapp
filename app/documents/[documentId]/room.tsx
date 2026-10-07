// "use client";

// import { ReactNode } from "react";
// import {
//   LiveblocksProvider,
//   RoomProvider,
//   ClientSideSuspense,
// } from "@liveblocks/react/suspense";
// import { useParams } from "next/navigation";

// export function Room({ children }: { children: ReactNode }) {
//     const params = useParams();

//   return (
//     <LiveblocksProvider 
//     throttle={16}
//      authEndpoint="/api/liveblocks-auth">
//       <RoomProvider id={params.documentId as string}>
//         <ClientSideSuspense fallback={<div>Loading…</div>}>
//           {children}
//         </ClientSideSuspense>
//       </RoomProvider>
//     </LiveblocksProvider>
//   );
// }











// "use client";

// import { ReactNode } from "react";
// import {
//   LiveblocksProvider,
//   RoomProvider,
//   ClientSideSuspense,
// } from "@liveblocks/react/suspense";

// interface RoomProps {
//   children: ReactNode;
//   documentId: string;
// }

// export function Room({ children, documentId }: RoomProps) {
//   if (!documentId) return null;

//   return (
//     <LiveblocksProvider
//       throttle={16}
//       authEndpoint="/api/liveblocks-auth"
//     >
//       <RoomProvider id={documentId}>
//         <ClientSideSuspense fallback={<div>Loading...</div>}>
//           {children}
//         </ClientSideSuspense>
//       </RoomProvider>
//     </LiveblocksProvider>
//   );
// }






// "use client";

// import { ReactNode, useEffect, useMemo, useState } from "react";
// import {
//   LiveblocksProvider,
//   RoomProvider,
//   ClientSideSuspense,
// } from "@liveblocks/react/suspense";
// import { FullScreerLoader } from "@/components/fullscreen--loader";
// import { getUsers } from "./actions";
// import { toast } from "sonner";

// interface RoomProps {
//   children: ReactNode;
//   documentId: string;
// }

// type User = {
//   id: string;
//   name: string;
//   avatar: string;
// };

// export function Room({ children, documentId }: RoomProps) {
//   const [users,setUsers] = useState<User[]>([]);
  
//   const fetchUsers = useMemo(()=> async () =>{
//         try {
//             const list = await getUsers();
//             setUsers(list);
//         } catch (error) {
//             toast.error("Faied to fetch users");
//         }
//     },
//     []
//     );

//     useEffect(()=>{
//         fetchUsers();
//     },[fetchUsers]);

//   if (!documentId) return null;

//   return (
//     <LiveblocksProvider
//       throttle={16}
//       authEndpoint={async (room) => {
//         const response = await fetch("/api/liveblocks-auth", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ room }),
//         });
        
//         return await response.json();
//       }}
//       resolveUsers={({userIds})=>{
//         return users.map(
//           (userIds) => users.find((user) => user.id === userId) ?? undefined
//         )
//       }}
//       resolveMentionSuggestions={({text})=>{
//         let filteredUsers = users;
//         if(text){
//           filteredUsers = users.filter((user) => user.name.toLowerCase().includes(text.toLowerCase()));
//         }
//         return filteredUsers.map((user)=> user.id);
        
//       }}
//       resolveRoomsInfo={()=>[]}
//     >
//       <RoomProvider id={documentId}>
//         <ClientSideSuspense fallback={<FullScreerLoader label="Room Loading..." />}>
//           {children}
//         </ClientSideSuspense>
//       </RoomProvider>
//     </LiveblocksProvider>
//   );
// }



"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

import { FullScreerLoader } from "@/components/fullscreen--loader";
import { getUsers,getDocuments } from "./actions";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { LEFT_MARGIN_DEFAULT,RIGHT_MARGIN_DEFAULT } from "@/constants/margins";
interface RoomProps {
  children: ReactNode;
  documentId: string;
}

type User = {
  id: string;
  name: string;
  avatar: string;
  color: string;
};

export function Room({ children, documentId }: RoomProps) {
  const [users, setUsers] = useState<User[]>([]);

  const params = useParams();
  const fetchUsers = async () => {
    try {
      const list = await getUsers();
      setUsers(list);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!documentId) return null;

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={async () => {
        const endpoint = "/api/liveblocks-auth";
        const room = params.documentId as string;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room }),
        });

        return await response.json();
      }}

      resolveUsers={({ userIds }) => {
        return userIds.map(
          (userId) => users.find((user) => user.id === userId) ?? undefined
        );
      }}

      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;

        if (text) {
          filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase())
          );
        }

        return filteredUsers.map((user) => user.id);
      }}

      resolveRoomsInfo={async ({ roomIds }) => {
        const documents = await getDocuments(roomIds as Id<"documents">[]);
        return documents.map((document) => ({
          id: document.id,
          name: document.name,
        }));
      }}
    >
      <RoomProvider id={documentId} initialStorage={{leftMargin:LEFT_MARGIN_DEFAULT,rightMargin:RIGHT_MARGIN_DEFAULT}}>
        <ClientSideSuspense
          fallback={<FullScreerLoader label="Room Loading..." />}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
// "use client"

// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { api } from "@/convex/_generated/api"
// import { Id } from "@/convex/_generated/dataModel"
// import { useMutation } from "convex/react"

// import React, { useState } from "react"

// interface RemoveDialogProps {
//     documentId: Id<"documents">
//     children: React.ReactNode;
// }

// export const RemoveDialog = ({ documentId, children }: RemoveDialogProps) => {
//     const remove = useMutation(api.documents.removeById);
//     const [isRemoving,SetIsRemoving] = useState(false);

//     return (
    
//         <AlertDialog>
//             <AlertDialogTrigger asChild>
//                 {children}
//             </AlertDialogTrigger>
//             <AlertDialogContent onClick={(e)=>e.stopPropagation()}>
//                 <AlertDialogHeader>
//                     <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                     <AlertDialogDescription>
//                         This action cannot be undone. This will permanently delete your document and remove it from your
//                         account.
//                     </AlertDialogDescription>
//                     <AlertDialogFooter>
//                         <AlertDialogCancel onClick={(e)=>e.stopPropagation()}>Cancel</AlertDialogCancel>
//                         <AlertDialogAction 
//                         disabled={isRemoving}
//                         onClick={(e)=>{
//                             e.stopPropagation();
//                             SetIsRemoving(true);
//                             remove({id:documentId}).finally(()=>SetIsRemoving(false));
//                         }}>Delete</AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogHeader>
//             </AlertDialogContent>
//         </AlertDialog>
//     )
// }




// "use client"

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"

// import { api } from "@/convex/_generated/api"
// import { Id } from "@/convex/_generated/dataModel"
// import { useMutation } from "convex/react"
// import { toast } from "sonner"

// import React, { useState } from "react"

// interface RemoveDialogProps {
//   documentId: Id<"documents">
//   children: React.ReactNode;
// }

// export const RemoveDialog = ({ documentId, children }: RemoveDialogProps) => {

//   const remove = useMutation(api.documents.removeById);
//   const [isRemoving,setIsRemoving] = useState(false);

//   const handleDelete = async () => {

//     setIsRemoving(true);

//     try {

//       await remove({id:documentId});

//       toast.success("Document deleted successfully");

//     } catch(error:any){

//       if(error.message.includes("Unauthorized")){
//         toast.error("You are not authorized to delete this document");
//       } else {
//         toast.error("Something went wrong");
//       }

//     } finally {
//       setIsRemoving(false);
//     }
//   }

//   return (
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         {children}
//       </AlertDialogTrigger>

//       <AlertDialogContent onClick={(e)=>e.stopPropagation()}>

//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you sure?</AlertDialogTitle>

//           <AlertDialogDescription>
//             This action cannot be undone. This will permanently delete your document.
//           </AlertDialogDescription>
//         </AlertDialogHeader>

//         <AlertDialogFooter>

//           <AlertDialogCancel>Cancel</AlertDialogCancel>

//           <AlertDialogAction
//             disabled={isRemoving}
//             onClick={(e)=>{
//               e.stopPropagation();
//               handleDelete();
//             }}
//           >
//             Delete
//           </AlertDialogAction>

//         </AlertDialogFooter>

//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }


"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import React, { useState } from "react"

interface RemoveDialogProps {
  documentId: Id<"documents">
  children: React.ReactNode;
}

export const RemoveDialog = ({ documentId, children }: RemoveDialogProps) => {

  const remove = useMutation(api.documents.removeById);
  const router = useRouter();

  const [isRemoving,setIsRemoving] = useState(false);

  const handleDelete = async () => {

    setIsRemoving(true);

    try {

      await remove({id:documentId});

      toast.success("Document deleted successfully");

      // ✅ redirect to homepage
      router.replace("/");

    } catch(error:any){

      if(error.message.includes("Unauthorized")){
        toast.error("You are not authorized to delete this document");
      } else {
        toast.error("Something went wrong");
      }

    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent onClick={(e)=>e.stopPropagation()}>

        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your document.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={isRemoving}
            onClick={(e)=>{
              e.stopPropagation();
              handleDelete();
            }}
          >
            Delete
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  )
}
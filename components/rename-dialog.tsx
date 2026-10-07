// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter
// } from "@/components/ui/dialog";

// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";
// import { useMutation } from "convex/react";

// import React, { useState } from "react";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";

// interface RenameDialogProps {
//   documentId: Id<"documents">;
//   initialTitle: string;
//   children: React.ReactNode;
// }

// export const RenameDialog = ({
//   documentId,
//   initialTitle,
//   children
// }: RenameDialogProps) => {

//   const update = useMutation(api.documents.UpdateById);

//   const [isUpdating, setIsUpdating] = useState(false);
//   const [title, setTitle] = useState(initialTitle);
//   const [open, setOpen] = useState(false);

//   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setIsUpdating(true);

//     update({
//       id: documentId,
//       title: title.trim() || "Untitled"
//     })
//     .finally(() => {
//         setIsUpdating(false);
//         setOpen(false);} 
//     );

//     setOpen(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         {children}
//       </DialogTrigger>

//       <DialogContent onClick={(e)=> e.stopPropagation()} >
//         <form onSubmit={onSubmit}>
//           <DialogHeader>
//             <DialogTitle>Rename document</DialogTitle>
//             <DialogDescription>
//               Enter a new name for your document.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="my-4">
//             <Input
//               placeholder="Document name"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>

//           <DialogFooter>
//             <Button
//               type="button"
//               variant="ghost"
//               disabled={isUpdating}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setOpen(false);
//               }}
//             >
//               Cancel
//             </Button>

//             <Button
//               type="submit"
//               disabled={isUpdating}
//               onClick={(e) => e.stopPropagation()}
//             >
//               Save
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };


"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface RenameDialogProps {
  documentId: Id<"documents">;
  initialTitle: string;
  children: React.ReactNode;
}

export const RenameDialog = ({
  documentId,
  initialTitle,
  children
}: RenameDialogProps) => {

  const update = useMutation(api.documents.UpdateById);

  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [open, setOpen] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsUpdating(true);

    try {
      await update({
        id: documentId,
        title: title.trim() || "Untitled"
      });

      toast.success("Document renamed successfully");

      setOpen(false);
    } catch (error: any) {

      if (error.message.includes("Unauthorized")) {
        toast.error("You are not authorized to rename this document");
      } else {
        toast.error("Something went wrong");
      }

    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent onClick={(e)=> e.stopPropagation()}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Rename document</DialogTitle>
            <DialogDescription>
              Enter a new name for your document.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <Input
              placeholder="Document name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={isUpdating}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isUpdating}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
// "use client"

// import Image from "next/image";
// import Link from "next/link";
// import { DocumentInput } from "./document-input";

// import {
//   Menubar,
//   MenubarContent,
//   MenubarItem,
//   MenubarMenu,
//   MenubarSeparator,
//   MenubarSub,
//   MenubarSubTrigger,
//   MenubarSubContent,
//   MenubarTrigger,
//   MenubarShortcut,
// } from "@/components/ui/menubar";

// import {
//   BoldIcon,
//   FileIcon,
//   FileJsonIcon,
//   FilePenIcon,
//   FilePlusIcon,
//   FileTextIcon,
//   GlobeIcon,
//   ItalicIcon,
//   Menu,
//   PrinterIcon,
//   Redo2Icon,
//   RemoveFormattingIcon,
//   StrikethroughIcon,
//   TextIcon,
//   TrashIcon,
//   UnderlineIcon,
//   Undo2Icon,
// } from "lucide-react";

// import { BsFilePdf } from "react-icons/bs";
// import { useEditorStore } from "@/store/use-editor-store";

// export const Navbar = () => {

//   const {editor} = useEditorStore();


//   return (
//     <nav className="flex items-center justify-between">
//       <div className="flex gap-2 items-center">
//         <Link href="/">
//           <Image src="/logo.svg" alt="Logo" width={36} height={36} />
//         </Link>

//         <div className="flex flex-col">
//           <DocumentInput />

//           <div className="flex">
//             <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
              
//               {/* FILE MENU */}
//               <MenubarMenu>
//                 <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
//                   File
//                 </MenubarTrigger>

//                 <MenubarContent className="print:hidden">
                  
//                   {/* SAVE SUBMENU */}
//                   <MenubarSub>
//                     <MenubarSubTrigger>
//                       <FileIcon className="mr-2 size-4" />
//                       Save
//                     </MenubarSubTrigger>

//                     <MenubarSubContent>
//                       <MenubarItem>
//                         <FileJsonIcon className="mr-2 size-4" />
//                         JSON
//                       </MenubarItem>

//                       <MenubarItem>
//                         <GlobeIcon className="mr-2 size-4" />
//                         HTML
//                       </MenubarItem>

//                       <MenubarItem>
//                         <BsFilePdf className="mr-2 size-4" />
//                         PDF
//                       </MenubarItem>

//                       <MenubarItem>
//                         <FileTextIcon className="mr-2 size-4" />
//                         Text
//                       </MenubarItem>
//                     </MenubarSubContent>
//                   </MenubarSub>

//                   <MenubarItem>
//                     <FilePlusIcon className="mr-2 size-4" />
//                     New Document
//                   </MenubarItem>

//                   <MenubarSeparator />

//                   <MenubarItem>
//                     <FilePenIcon className="size-4 mr-2" />
//                     Rename
//                   </MenubarItem>

//                   <MenubarItem>
//                     <TrashIcon className="size-4 mr-2" />
//                     Remove
//                   </MenubarItem>

//                   <MenubarSeparator />

//                   <MenubarItem onClick={()=> window.print()} >
//                     <PrinterIcon className="size-4 mr-2" />
//                     Print
//                     <MenubarShortcut>⌘P</MenubarShortcut>
//                   </MenubarItem>
//                 </MenubarContent>
//               </MenubarMenu>

//               {/* OTHER MENUS */}
//               <MenubarMenu>
//                 <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
//                   Edit
//                 </MenubarTrigger>
//                 <MenubarContent>
//                   <MenubarItem>
//                     <Undo2Icon className="size-4 mr-2"/> 
//                     Undo <MenubarShortcut>⌘Z</MenubarShortcut>
//                   </MenubarItem>
//                   <MenubarItem>
//                     <Redo2Icon className="size-4 mr-2"/> 
//                     Redo <MenubarShortcut>⌘Y</MenubarShortcut>
//                   </MenubarItem>
//                 </MenubarContent>
//               </MenubarMenu>

//               <MenubarMenu>
//                 <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
//                   Insert
//                 </MenubarTrigger>
//                 <MenubarContent>
//                   <MenubarSub>
//                     <MenubarSubTrigger>
//                       Table 
//                     </MenubarSubTrigger>
//                     <MenubarSubContent>
//                       <MenubarItem>
//                         1 x 1
//                       </MenubarItem>
//                       <MenubarItem>
//                         2 x 2
//                       </MenubarItem>
//                       <MenubarItem>
//                         3 x 3
//                       </MenubarItem>
//                       <MenubarItem>
//                         4 x 4
//                       </MenubarItem>
//                     </MenubarSubContent>
//                   </MenubarSub>
//                 </MenubarContent>
//               </MenubarMenu>

//               <MenubarMenu>
//                 <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
//                   Format
//                 </MenubarTrigger>
//                 <MenubarContent>
//                   <MenubarSub>
//                     <MenubarSubTrigger>
//                         <TextIcon className="size-4 mr-2"/>
//                         Text
//                     </MenubarSubTrigger>
//                     <MenubarSubContent>
//                       <MenubarItem>
//                         <BoldIcon className="size-4 mr-2"/>
//                         Bold
//                         <MenubarShortcut>⌘B</MenubarShortcut>
//                       </MenubarItem>
//                       <MenubarItem>
//                         <ItalicIcon className="size-4 mr-2"/>
//                         Italic
//                         <MenubarShortcut>⌘I</MenubarShortcut>
//                       </MenubarItem>
//                       <MenubarItem>
//                         <UnderlineIcon className="size-4 mr-2"/>
//                         Underline
//                         <MenubarShortcut>⌘S</MenubarShortcut>
//                       </MenubarItem> 
//                       <MenubarItem>
//                         <StrikethroughIcon className="size-4 mr-2"/>
//                         Strikethrough
//                         <MenubarShortcut>⌘S</MenubarShortcut>
//                       </MenubarItem> 
//                     </MenubarSubContent> 
//                   </MenubarSub>

//                   <MenubarItem>
//                     <RemoveFormattingIcon className="size-4 mr-2"/>
//                     Clear Formatting
//                   </MenubarItem>

//                 </MenubarContent>
//               </MenubarMenu>

//             </Menubar>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };


"use client";

import Image from "next/image";
import Link from "next/link";
import { DocumentInput } from "./document-input";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarTrigger,
  MenubarShortcut,
} from "@/components/ui/menubar";

import {
  BoldIcon,
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  ItalicIcon,
  LayoutDashboard,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  TextIcon,
  TrashIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";

import { BsFilePdf } from "react-icons/bs";
import { useEditorStore } from "@/store/use-editor-store";
import { blob } from "stream/consumers";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

import { Avatars } from "./avatars";
import { Inbox } from "./inbox";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RenameDialog } from "@/components/rename-dialog";
import { RemoveDialog } from "@/components/remove-dialog";

interface NavbarProps {
  data : Doc<"documents">;
}

export const Navbar = ( {data} : NavbarProps) => {
  const { editor, toggleKanban } = useEditorStore();
  const router = useRouter();
  const mutation = useMutation(api.documents.create);

  const onNewDocument = () => {
    mutation({
      title: "Untitled Document",
      intitalContent: "",
    })
    .catch(()=> toast.error("Failed to create document"))
    .then((documentId) => {
      toast.success("Document created");
      router.push(`/documents/${documentId}`);
    });
  }

  const onDownload = (blob: Blob,filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  }

  const onSaveJSON = () => {
    if(!editor) return;

    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], { type: "application/json" });
    onDownload(blob, `${data.title}.json`);
  }

  const onSaveHTML = () => {
    if(!editor) return;

    const content = editor.getHTML();
    const blob = new Blob([content], { type: "text/html" });
    onDownload(blob, `${data.title}.html`);
  }

    const onSaveText = () => {
    if(!editor) return;

    const content = editor.getText();
    const blob = new Blob([content], { type: "text/plain" });
    onDownload(blob, `${data.title}.txt`);
  }



  const undo = () =>
    editor?.chain().focus().undo().run();

  const redo = () =>
    editor?.chain().focus().redo().run();

  /* ---------------- FORMAT ---------------- */

  const toggleBold = () =>
    editor?.chain().focus().toggleBold().run();

  const toggleItalic = () =>
    editor?.chain().focus().toggleItalic().run();

  const toggleUnderline = () =>
    editor?.chain().focus().toggleUnderline().run();

  const toggleStrike = () =>
    editor?.chain().focus().toggleStrike().run();

  const clearFormatting = () =>
    editor?.chain().focus().unsetAllMarks().clearNodes().run();

  /* ---------------- INSERT TABLE ---------------- */

  const insertTable = (rows: number, cols: number) =>
    editor
      ?.chain()
      .focus()
      .insertTable({
        rows,
        cols,
        withHeaderRow: false,
      })
      .run();

  return (
    <nav className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
        </Link>

        <div className="flex flex-col">
          <DocumentInput title={data.title} id={data._id} />

          <div className="flex">
            <Menubar className="border-none bg-transparent shadow-none h-auto p-0">

              {/* FILE MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  File
                </MenubarTrigger>

                <MenubarContent className="print:hidden">
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <FileIcon className="mr-2 size-4" />
                      Save
                    </MenubarSubTrigger>

                    <MenubarSubContent>
                      <MenubarItem onClick={onSaveJSON}>
                        <FileJsonIcon className="mr-2 size-4" />
                        JSON
                      </MenubarItem>

                      <MenubarItem onClick={onSaveHTML}>
                        <GlobeIcon className="mr-2 size-4" />
                        HTML
                      </MenubarItem>

                      <MenubarItem onClick={() => window.print()}>
                        <BsFilePdf className="mr-2 size-4" />
                        PDF
                      </MenubarItem>

                      <MenubarItem onClick={onSaveText}>
                        <FileTextIcon className="mr-2 size-4" />
                        Text
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>

                  <MenubarItem onClick={onNewDocument}>
                    <FilePlusIcon className="mr-2 size-4" />
                    New Document
                  </MenubarItem>

                  <MenubarSeparator />

                  <RenameDialog documentId={data._id} initialTitle={data.title}>
                    <MenubarItem
                      onClick={(e)=>e.stopPropagation()}
                      onSelect={(e)=> e.preventDefault()} 
                    >
                      <FilePenIcon className="size-4 mr-2" />
                      Rename
                    </MenubarItem>
                  </RenameDialog>

                  <RemoveDialog documentId={data._id}>
                    <MenubarItem
                      onClick={(e)=>e.stopPropagation()}
                      onSelect={(e)=> e.preventDefault()}
                     >
                      <TrashIcon className="size-4 mr-2" />
                      Remove
                    </MenubarItem>
                  </RemoveDialog>

                  <MenubarSeparator />

                  <MenubarItem onClick={() => window.print()}>
                    <PrinterIcon className="size-4 mr-2" />
                    Print
                    <MenubarShortcut>⌘P</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* EDIT MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Edit
                </MenubarTrigger>

                <MenubarContent>
                  <MenubarItem onClick={undo}>
                    <Undo2Icon className="size-4 mr-2" />
                    Undo
                    <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>

                  <MenubarItem onClick={redo}>
                    <Redo2Icon className="size-4 mr-2" />
                    Redo
                    <MenubarShortcut>⌘Y</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* INSERT MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Insert
                </MenubarTrigger>

                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      Table
                    </MenubarSubTrigger>

                    <MenubarSubContent>
                      <MenubarItem onClick={() => insertTable(1, 1)}>1 x 1</MenubarItem>
                      <MenubarItem onClick={() => insertTable(2, 2)}>2 x 2</MenubarItem>
                      <MenubarItem onClick={() => insertTable(3, 3)}>3 x 3</MenubarItem>
                      <MenubarItem onClick={() => insertTable(4, 4)}>4 x 4</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>

              {/* FORMAT MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                  Format
                </MenubarTrigger>

                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <TextIcon className="size-4 mr-2" />
                      Text
                    </MenubarSubTrigger>

                    <MenubarSubContent>
                      <MenubarItem onClick={toggleBold}>
                        <BoldIcon className="size-4 mr-2" />
                        Bold
                        <MenubarShortcut>⌘B</MenubarShortcut>
                      </MenubarItem>

                      <MenubarItem onClick={toggleItalic}>
                        <ItalicIcon className="size-4 mr-2" />
                        Italic
                        <MenubarShortcut>⌘I</MenubarShortcut>
                      </MenubarItem>

                      <MenubarItem onClick={toggleUnderline}>
                        <UnderlineIcon className="size-4 mr-2" />
                        Underline
                        <MenubarShortcut>⌘U</MenubarShortcut>
                      </MenubarItem>

                      <MenubarItem onClick={toggleStrike}>
                        <StrikethroughIcon className="size-4 mr-2" />
                        Strikethrough
                        <MenubarShortcut>⌘S</MenubarShortcut>
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>

                  <MenubarItem onClick={clearFormatting}>
                    <RemoveFormattingIcon className="size-4 mr-2" />
                    Clear Formatting
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

            </Menubar>
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center pl-6">
        <Avatars/>
        <Inbox/>
        <button
          onClick={() => toggleKanban()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Kanban Board"
        >
          <LayoutDashboard className="size-4" />
          <span className="hidden sm:inline">Board</span>
        </button>
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          afterSelectPersonalUrl="/"

        />
        <UserButton />
      </div>
    </nav>
  );
};
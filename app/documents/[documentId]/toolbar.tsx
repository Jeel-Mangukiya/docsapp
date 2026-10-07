// "use client"
// import { Separator } from "@/components/ui/separator";
// import { cn } from "@/lib/utils";
// import { useEditorStore } from "@/store/use-editor-store";
// import { BoldIcon, LucideIcon, PrinterIcon, Redo2Icon, SpellCheckIcon, Undo2Icon } from "lucide-react";

// interface ToolbarbuttonProps {
//     onclick: () => void;
//     isActive: boolean
//     icon:LucideIcon
// }


// const Toolbarbutton = ({
//     onClick,
//     isActive,
//     icon:Icon,
// }) => {
//     return (
//         <button className={cn(
//             "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 ",
//             isActive && "bg-neutral-200/80"
//         )} onClick={onClick}>
//             <Icon  className="size-4"/>
//         </button>
//     )
// }
// const Toolbar = () => {
//     const {editor} = useEditorStore();
//      if (!editor) return null;

//     const sections: { 
//         label : string;
//         icon: LucideIcon;
//         onClick: () => void;
//         isActive: boolean; 
//     }[][] = [
//         [
//             {
//                 label: "Undo",
//                 icon: Undo2Icon,
//                 onClick: () => editor?.chain().focus().undo().run(),
//                 isActive: false
//             },
//             {
//                 label: "Redo",
//                 icon: Redo2Icon,
//                 onClick: () => editor?.chain().focus().redo().run(),
//                 isActive: false
//             },
//             {
//                 label: "Print",
//                 icon: PrinterIcon,
//                 onClick: () => window.print(),
//             },
//             {
//                 label : "Spell Check",
//                 icon : SpellCheckIcon,
//                 onClick: () => {

//                     const current = editor?.view.dom.getAttribute("spellcheck");
//                     editor?.view.dom.setAttribute("spellcheck", current === "true" ? "false" : "true");
//                 },
//             }

//         ],
//         [
//             {
//                 label: "Bold",
//                 icon: BoldIcon,
//                 onClick: () => editor?.chain().focus().toggleBold().run(),
//             }
//         ]
//     ];

//   return (
//     <div className='bg-[#F1F4F8]  px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto'>
//         {sections[0].map((item) => (
//             <Toolbarbutton
//                 key={item.label}
//                 {...item}
//             />
//         ))}
//         <Separator orientation="vertical" className="h-6 bg-neutral-300" />
//     </div>
//   )
// }

// export default Toolbar




"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {type ColorResult , SketchPicker} from "react-color";
import { useEditorStore } from "@/store/use-editor-store";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ChevronDownIcon,
  HighlighterIcon,
  ImageIcon,
  ItalicIcon,
  LineChart,
  Link2Icon,
  ListCollapseIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  LucideIcon,
  MessageSquarePlusIcon,
  MicIcon,
  MicOffIcon,
  MinusIcon,
  PlusIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SearchIcon,
  SparklesIcon,
  SpellCheckIcon,
  UnderlineIcon,
  Undo2Icon,
  UploadIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



/* ======================================================
   Line height Button
====================================================== */

const LineHeighButton = () => {
  const { editor } = useEditorStore();
  if (!editor) return null;

  const lineHeights = [
    { label: "Normal", value: "normal" },
    { label: "1", value: "1" },
    { label: "1.15", value: "1.15" },
    { label: "1.5", value: "1.5" },
    { label: "2", value: "2" },
    { label: "2.5", value: "2.5" },
    { label: "3", value: "3" },
  ];

  // get current line height
  const currentLineHeight =
    editor.getAttributes("paragraph").lineHeight ||
    editor.getAttributes("heading").lineHeight ||
    "normal";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-2">
          <ListCollapseIcon className="size-4"/>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-1 flex flex-col  text-sm gap-y-1">
        {lineHeights.map(({ label, value }) => (
          <button
            key={value}
            onClick={() =>
              editor.chain().focus().setLineHeight(value).run()
            }
            className={cn(
              "flex items-center px-2 py-1 rounded-sm hover:bg-neutral-200/80 text-sm",
              currentLineHeight === value && "bg-neutral-200/80"
            )}
          >
            {label}
          </button>
        ))}

        {/* Reset */}
        <DropdownMenuItem
          onSelect={() =>
            editor.chain().focus().unsetLineHeight().run()
          }
          className="text-xs justify-center mt-1"
        >
          Reset line height
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* ======================================================
   Font Size Button
====================================================== */
const FontSizeButton = () => {
  const { editor } = useEditorStore();
  if (!editor) return null;

  // get current font size from editor
  const getEditorFontSize = () => {
    const size = editor.getAttributes("textStyle").fontSize;
    return size ? size.replace("px", "") : "16";
  };

  const [fontSize, setFontSize] = useState(getEditorFontSize());
  const [inputVal, setInputVal] = useState(fontSize);
  const [isEditing, setIsEditing] = useState(false);

  /* sync when cursor changes */
  useEffect(() => {
    const update = () => {
      const size = getEditorFontSize();
      setFontSize(size);
      setInputVal(size);
    };

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);

    if (!isNaN(size) && size > 0) {
      editor.chain().focus().setFontSize(`${size}px`).run();
      setFontSize(newSize);
      setInputVal(newSize);
      setIsEditing(false);
    }
  };

  const increment = () => {
    const newSize = parseInt(fontSize) + 1;
    updateFontSize(newSize.toString());
  };

  const decrement = () => {
    const newSize = parseInt(fontSize) - 1;
    if (newSize > 0) {
      updateFontSize(newSize.toString());
    }
  };

  return (
    <div className="flex items-center gap-x-0.5">
      {/* Minus */}
      <button
        onClick={decrement}
        className="h-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-2"
      >
        <MinusIcon className="size-4" />
      </button>

      {/* Input / Display */}
      {isEditing ? (
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={() => updateFontSize(inputVal)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateFontSize(inputVal);
              editor.commands.focus();
            }
          }}
          className="h-7 w-10 text-sm border border-neutral-400 rounded-sm bg-transparent focus:outline-none focus:ring-0 text-center"
          autoFocus
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="w-10 h-7 border border-neutral-400 rounded-sm bg-transparent text-sm text-center"
        >
          {fontSize}
        </button>
      )}

      {/* Plus */}
      <button
        onClick={increment}
        className="h-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-2"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};

/* ======================================================
   List Button
====================================================== */

const ListButton = () => {
  const { editor } = useEditorStore();
  if (!editor) return null;

  const lists = [
    {
      label: "Bullet List",
      icon: ListIcon,
      isActive: () => editor.isActive("bulletList"),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      icon: ListOrderedIcon,
      isActive: () => editor.isActive("orderedList"),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-2">
          <ListIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {lists.map(({ label, icon: Icon, onClick, isActive }) => (
          <button
            key={label}
            onClick={onClick}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80 text-sm",
              isActive() && "bg-neutral-200/80"
            )}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


/* ======================================================
   Align Button
====================================================== */

const AlignButton = () => {
  const { editor } = useEditorStore();
  if (!editor) return null;

  const alignments = [
    {
      label: "Align Left",
      value: "left",
      icon: AlignLeftIcon,
    },
    {
      label: "Align Center",
      value: "center",
      icon: AlignCenterIcon,
    },
    {
      label: "Align Right",
      value: "right",
      icon: AlignRightIcon,
    },
    {
      label: "Align Justify",
      value: "justify",
      icon: AlignJustifyIcon,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>

       
        <button className=" h-7 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 text-sm px-2">
           <AlignLeftIcon className="size-4"/>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {alignments.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() =>
              editor.chain().focus().setTextAlign(value).run()
            }
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80 text-sm",
              editor.isActive({ textAlign: value }) &&
                "bg-neutral-200/80"
            )}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* ======================================================
   Image Button
====================================================== */

const ImageButton = () => {
  const {editor} = useEditorStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl,setImageUrl] = useState("");

  const onChange = (src : string) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  const onUplode = () =>{
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);

       
      }
    };
    input.click();
  }

  const handleImageUrlSubmit = () =>{
    if(imageUrl){
      onChange(imageUrl);
      setImageUrl("");
      setIsDialogOpen(false);

    }
  }
 

  return (
    <>
    <DropdownMenu >
      <DropdownMenuTrigger  asChild>
        <button  className="min-w-7 shrink-0 h-7 flex flex-col items-center justify-center   rounded-sm hover:bg-neutral-200/80 text-sm px-2">
          <ImageIcon className="size-4" />
        </button>
      </DropdownMenuTrigger> 
    <DropdownMenuContent>
      <DropdownMenuItem onClick={onUplode}>
        <UploadIcon className="mr-2 h-4 w-4" />
        Upload
      </DropdownMenuItem>

      <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
        <SearchIcon className="mr-2 h-4 w-4" />
        Paste image url
      </DropdownMenuItem>
    </DropdownMenuContent>   
    </DropdownMenu>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Image Url</DialogTitle>
        </DialogHeader>
        
            <Input
              placeholder="Insert image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e)=>{
                if(e.key === "Enter"){
                  handleImageUrlSubmit();
                }
              }}
            />
        <DialogFooter>
          <Button onClick={handleImageUrlSubmit}>Insert</Button>
        </DialogFooter>
      </DialogContent>


    </Dialog>
    </>


  );

}


/* ======================================================
   Link Button
====================================================== */

const LinkButton = () => {
  const {editor} = useEditorStore();
  const [value,setValue] = useState(editor?.getAttributes("link")?.href || "");

  const onChange = (href : string) => {
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setValue("");
  };
  return (
    <DropdownMenu onOpenChange={(open) => {
      if(open){

        setValue(editor?.getAttributes("link")?.href || "" )
      } 
    }}>
      <DropdownMenuTrigger  asChild>
        <button  className="min-w-7 shrink-0 h-7 flex flex-col items-center justify-center  rounded-sm hover:bg-neutral-200/80 text-sm px-2">
          <Link2Icon className="size-4" />
        </button>
      </DropdownMenuTrigger> 

      <DropdownMenuContent className="p-2 flex items-center gap-x-2">
        <Input
          placeholder="https://example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
         />
        <Button onClick={() => onChange(value)}>
          Apply
        </Button> 

        
      </DropdownMenuContent>    
    </DropdownMenu>

  );

}

/* ======================================================
   hightlight color Button
====================================================== */

const HightLightColorButton = () => {
  const { editor } = useEditorStore();
  if (!editor) return null;

  const colors = [
    "#ffffff",
    "#fff475",
    "#fbbc04",
    "#f28b82",
    "#ffab91",
    "#fdcfe8",
    "#e6c9a8",
    "#e8eaed",
    "#ccff90",
    "#a7ffeb",
    "#cbf0f8",
    "#aecbfa",
    "#d7aefb",
    "#fdcfe8",
    "#f1f3f4",
    "#d0f0c0",
    "#b3e5fc",
    "#c8e6c9",
    "#ffe0b2",
    "#ffccbc",
  ];

  const currentHighlight =
    editor.getAttributes("highlight")?.color || "transparent";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 px-2 flex items-center gap-2 rounded-sm hover:bg-neutral-200/80">
          {/* Highlight Preview */}
          <div className="flex flex-col items-center">
            <HighlighterIcon
              className="text-sm font-semibold px-1"
              style={{ backgroundColor: currentHighlight }}
            />
              
          </div>

          {/* <ChevronDownIcon className="size-4" /> */}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-2 grid grid-cols-7 gap-1">
        
        {colors.map((color, index) => (
          <DropdownMenuItem
            key={`${color}-${index}`}
            onSelect={() =>
              editor.chain().focus().toggleHighlight({ color }).run()
            }
            className={cn(
              "w-6 h-6 p-0 rounded-sm cursor-pointer border",
              currentHighlight === color && "ring-2 ring-blue-500"
            )}
          >
            <div
              className="w-full h-full rounded-sm"
              style={{ backgroundColor: color }}
            />
          </DropdownMenuItem>
        ))}

        {/* Reset Highlight */}
        <DropdownMenuItem
          onSelect={() =>
            editor.chain().focus().unsetHighlight().run()
          }
          className="col-span-7 text-xs justify-center mt-1"
        >
          Remove highlight
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* ======================================================
   Text Color Button
====================================================== */

const TextColorButton = () => {
  const { editor } = useEditorStore();
  if (!editor) return null;

 const colors = [
  // Neutral
  "#000000",
  "#1c1c1c",
  "#434343",
  "#666666",
  "#808080",
  "#999999",
  "#bfbfbf",
  "#cccccc",
  "#e6e6e6",
  "#f2f2f2",
  "#ffffff",

  // Reds
  "#ff0000",
  "#cc0000",
  "#990000",
  "#ff4d4d",
  "#ff6666",
  "#ff9999",

  // Oranges
  "#ff6600",
  "#ff8000",
  "#ff9900",
  "#ffb366",
  "#ffd1a3",

  // Yellows
  "#ffff00",
  "#ffd700",
  "#ffea00",
  "#fff066",
  "#fff7b3",

  // Greens
  "#00ff00",
  "#00cc44",
  "#009933",
  "#66ff99",
  "#b3ffd9",

  // Teal / Cyan
  "#00ffff",
  "#00cccc",
  "#009999",
  "#66ffff",
  "#b3ffff",

  // Blues
  "#0000ff",
  "#0033cc",
  "#0066ff",
  "#3399ff",
  "#66b3ff",
  "#99ccff",

  // Purples
  "#9900ff",
  "#8000ff",
  "#6600cc",
  "#b366ff",
  "#d1a3ff",

  // Pink / Magenta
  "#ff00ff",
  "#ff33cc",
  "#ff66cc",
  "#ff99dd",
  "#ffcce6",

  // Browns
  "#663300",
  "#8b4513",
  "#a0522d",
  "#cd853f",
  "#deb887",
];

  const currentColor =
    editor.getAttributes("textStyle").color || "#000000";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 px-2 flex items-center gap-2 rounded-sm hover:bg-neutral-200/80">
          {/* Color preview */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold">A</span>
            <span
              className="w-5 h-[2px] rounded-sm"
              style={{ backgroundColor: currentColor }}
            />
          </div>

          <ChevronDownIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-2 grid grid-cols-7 gap-1">
        {colors.map((color) => (
          <DropdownMenuItem
            key={color}
            onSelect={() =>
              editor.chain().focus().setColor(color).run()
            }
            className={cn(
              "w-6 h-6 p-0 rounded-sm cursor-pointer border",
              currentColor === color && "ring-2 ring-blue-500"
            )}
          >
            <div
              className="w-full h-full rounded-sm"
              style={{ backgroundColor: color }}
            />
          </DropdownMenuItem>
        ))}

        {/* Reset Color */}
        <DropdownMenuItem
          onSelect={() =>
            editor.chain().focus().unsetColor().run()
          }
          className="col-span-7 text-xs justify-center mt-1"
        >
          Reset color
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* ======================================================
   Heading Level Button
====================================================== */
const HeadingLevelButton = () => {
  const { editor } = useEditorStore();
  if (!editor) return null;

  const headings = [
    { label: "Normal text", level: 0 },
    { label: "Heading 1", level: 1 },
    { label: "Heading 2", level: 2 },
    { label: "Heading 3", level: 3 },
    { label: "Heading 4", level: 4 },
    { label: "Heading 5", level: 5 },
    { label: "Heading 6", level: 6 },
  ];

  const getCurrentHeading = () => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive("heading", { level: i })) {
        return `Heading ${i}`;
      }
    }
    return "Normal text";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-[140px] h-7 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 text-sm px-2">
          <span className="truncate">{getCurrentHeading()}</span>
          <ChevronDownIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {headings.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onSelect={() => {
              if (item.level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({
                    level: item.level as 1 | 2 | 3 | 4 | 5 | 6,
                  })
                  .run();
              }
            }}
            className={cn(
              "cursor-pointer rounded-sm",
              (item.level === 0 && !editor.isActive("heading")) ||
                editor.isActive("heading", { level: item.level })
                ? "bg-neutral-200/80"
                : ""
            )}
          >
            <span
              className={cn(
                "text-sm",
                item.level === 1 && "text-xl font-bold",
                item.level === 2 && "text-lg font-semibold",
                item.level === 3 && "text-base font-semibold"
              )}
            >
              {item.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* ======================================================
   Font Family Button
====================================================== */

const FontFamilyButton = () => {
  const { editor } = useEditorStore();

  const fonts = [
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Times New Roman", value: "'Times New Roman', serif" },
    { label: "Courier New", value: "'Courier New', monospace" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
    { label: "Tahoma", value: "Tahoma, sans-serif" },
    { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
    { label: "Impact", value: "Impact, sans-serif" },
    { label: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
    { label: "Lucida Console", value: "'Lucida Console', monospace" },
    { label: "Inter", value: "Inter, sans-serif" },
    { label: "Roboto", value: "Roboto, sans-serif" },
    { label: "Poppins", value: "Poppins, sans-serif" },
    { label: "Open Sans", value: "'Open Sans', sans-serif" },
    { label: "Montserrat", value: "Montserrat, sans-serif" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-[120px] h-7 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 text-sm px-2">
          <span className="truncate">
            {editor?.getAttributes("textStyle").fontFamily || "Arial"}
          </span>
          <ChevronDownIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {fonts.map((font) => (
          <DropdownMenuItem
            key={font.value}
            onSelect={() =>
              editor?.chain().focus().setFontFamily(font.value).run()
            }
            className={cn(
              "cursor-pointer rounded-sm",
              editor?.getAttributes("textStyle").fontFamily === font.value &&
                "bg-neutral-200/80"
            )}
            style={{ fontFamily: font.value }}
          >
            <span className="text-sm">{font.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* ======================================================
   Voice Dictation Button
====================================================== */

const VoiceDictationButton = () => {
  const { editor } = useEditorStore();
  const { transcript, interimText, isListening, isSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  
  // Track how much of the final transcript we've already inserted
  const lastInsertedLength = useRef(0);
  // Track the length of the interim placeholder currently in the editor
  const interimInsertedLength = useRef(0);

  // Insert FINAL transcript into editor as it arrives
  useEffect(() => {
    if (!editor || !transcript) return;

    const newFinalText = transcript.slice(lastInsertedLength.current);
    if (newFinalText) {
      // First, remove any interim placeholder that's currently in the editor
      if (interimInsertedLength.current > 0) {
        const { to } = editor.state.selection;
        const deleteFrom = to - interimInsertedLength.current;
        editor.chain().focus().deleteRange({ from: deleteFrom, to }).run();
        interimInsertedLength.current = 0;
      }
      // Now insert the finalized text
      editor.chain().focus().insertContent(newFinalText).run();
      lastInsertedLength.current = transcript.length;
    }
  }, [transcript, editor]);

  // Show INTERIM text as a temporary placeholder (replaced on each update)
  useEffect(() => {
    if (!editor) return;

    // Remove the previous interim placeholder
    if (interimInsertedLength.current > 0) {
      const { to } = editor.state.selection;
      const deleteFrom = to - interimInsertedLength.current;
      editor.chain().focus().deleteRange({ from: deleteFrom, to }).run();
      interimInsertedLength.current = 0;
    }

    // Insert the new interim text
    if (interimText) {
      editor.chain().focus().insertContent(interimText).run();
      interimInsertedLength.current = interimText.length;
    }
  }, [interimText, editor]);

  // Reset tracking when listening stops
  useEffect(() => {
    if (!isListening) {
      // Remove any remaining interim placeholder
      if (interimInsertedLength.current > 0 && editor) {
        const { to } = editor.state.selection;
        const deleteFrom = to - interimInsertedLength.current;
        editor.chain().focus().deleteRange({ from: deleteFrom, to }).run();
        interimInsertedLength.current = 0;
      }
      lastInsertedLength.current = 0;
      resetTranscript();
    }
  }, [isListening, resetTranscript, editor]);

  if (!isSupported || !editor) return null;

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      lastInsertedLength.current = 0;
      interimInsertedLength.current = 0;
      startListening();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "group relative flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold transition-all duration-200",
        isListening
          ? "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-200"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
      )}
      title={isListening ? "Stop dictation" : "Voice dictation"}
    >
      {/* Pulsing ring when active */}
      {isListening && (
        <span className="absolute inset-0 rounded-lg animate-ping bg-red-400 opacity-30" />
      )}
      {isListening ? (
        <MicOffIcon className="size-3.5 relative z-10" />
      ) : (
        <MicIcon className="size-3.5" />
      )}
      <span className="relative z-10">{isListening ? "Stop" : "Voice"}</span>
    </button>
  );
};

/* ======================================================
   Toolbar Button
====================================================== */

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: LucideIcon;
}

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
        isActive && "bg-neutral-200/80"
      )}
    >
      <Icon className="size-4" />
    </button>
  );
};

/* ======================================================
   Toolbar Component
====================================================== */

const Toolbar = () => {
  const { editor, isAiSidebarOpen, toggleAiSidebar } = useEditorStore();
  if (!editor) return null;

  const sections = [
    [
      {
        label: "Undo",
        icon: Undo2Icon,
        onClick: () => editor.chain().focus().undo().run(),
      },
      {
        label: "Redo",
        icon: Redo2Icon,
        onClick: () => editor.chain().focus().redo().run(),
      },
      {
        label: "Print",
        icon: PrinterIcon,
        onClick: () => window.print(),
      },
      {
        label: "Spell Check",
        icon: SpellCheckIcon,
        onClick: () => {
          const current =
            editor.view.dom.getAttribute("spellcheck") === "true";
          editor.view.dom.setAttribute("spellcheck", (!current).toString());
        },
      },
    ],
    [
      {
        label: "Bold",
        icon: BoldIcon,
        onClick: () => editor.chain().focus().toggleBold().run(),
        isActive: editor.isActive("bold"),
      },
      {
        label: "Italic",
        icon: ItalicIcon,
        onClick: () => editor.chain().focus().toggleItalic().run(),
        isActive: editor.isActive("italic"),
      },
      {
        label: "Underline",
        icon: UnderlineIcon,
        onClick: () => editor.chain().focus().toggleUnderline().run(),
        isActive: editor.isActive("underline"),
      },
    ],
    [
      {
        label: "Comment",
        icon: MessageSquarePlusIcon,
        onClick: () => editor?.chain().focus().addPendingComment().run(),
        iaAcive:editor?.isActive("liveblocksCommentMark")
      },
      {
        label: "List Todo",
        icon: ListTodoIcon,
        onClick: () => editor.chain().focus().toggleTaskList().run(),
        isActive: editor.isActive("taskList"),
      },
      {
        label: "Remove Formatting",
        icon: RemoveFormattingIcon,
        onClick: () => editor.chain().focus().unsetAllMarks().run(),
      },
    ],
  ];

  return (
    <div className="bg-[#F1F4F8] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-1 overflow-x-auto">
      {sections[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}

      <span className="h-6 w-[1px] bg-neutral-300" />

      <FontFamilyButton />

      <span className="h-6 w-[1px] bg-neutral-300" />

      <HeadingLevelButton />

      <span className="h-6 w-[1px] bg-neutral-300" />

      <FontSizeButton />

      <span className="h-6 w-[0px] bg-neutral-300" />

      {sections[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <HightLightColorButton />
      <TextColorButton />

      <span className="h-6 w-[1px] bg-neutral-300" />
      <LinkButton/>
      <ImageButton/>
      <AlignButton/>
      <LineHeighButton/>
      <ListButton/>

      {sections[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}

      <span className="h-6 w-[1px] bg-neutral-300" />

      {/* Voice Dictation Button */}
      <VoiceDictationButton />

      {/* AI Assistant Button */}
      <button
        onClick={toggleAiSidebar}
        className="group flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-md"
        style={{
          background: isAiSidebarOpen
            ? "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)"
            : "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(99,102,241,0.1) 100%)",
          color: isAiSidebarOpen ? "#fff" : "#7c3aed",
        }}
        title="AI Assistant"
      >
        <SparklesIcon className="size-3.5" />
        <span>AI</span>
      </button>
    </div>
  );
};

export default Toolbar;
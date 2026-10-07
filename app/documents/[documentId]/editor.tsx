// "use client"

// import { useEditor, EditorContent } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'
// import Heading from '@tiptap/extension-heading'
// import { TaskItem, TaskList } from '@tiptap/extension-list'
// import { TableKit } from '@tiptap/extension-table'
// import Image from '@tiptap/extension-image'
// import FileHandler from '@tiptap/extension-file-handler'
// import {  useEditorStore } from '@/store/use-editor-store'
// import { FontFamily, TextStyle } from '@tiptap/extension-text-style'
// import Highlight from '@tiptap/extension-highlight'
// import Color from '@tiptap/extension-color'

// // import { ResizableImage } from "./ResizableImage";
// const Editor = () => {
//   const {setEditor} = useEditorStore();

//     const editor = useEditor({
//         onCreate ({ editor })  {
//           setEditor(editor);
//         },
//         onDestroy ()  {
//           setEditor(null);
//         },
//         onUpdate ({ editor })  {
//           setEditor(editor);
//         },
//         onSelectionUpdate ({ editor })  {
//           setEditor(editor);
//         },
//         onTransaction ({ editor })  {
//           setEditor(editor);
//         },
//         onBlur ({ editor }) {
//           setEditor(editor);
//         },
//         onFocus ({ editor }) {
//           setEditor(editor);
//         },

//         onContentError ({ editor }) {
//           setEditor(editor);
//         },
//         editorProps: {
//             attributes: {
//               style : "padding-left:56px; padding-right:56px;",  
//               class: ' focus:outline-none print:border-0 bg-white border border-[#C7C7C7]  flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text',
//             },   
//           },
        
//         extensions: [
//             Highlight.configure({ multicolor: true }),
//             FontFamily,
//             TextStyle,
//             Color,
//             StarterKit,
//             Heading.configure({
//                 levels: [1, 2, 3,4,5,6],
//             }),
//             TaskList,
//             TaskItem.configure({
//                 nested: true,
//             }),
            
//              TableKit.configure({
//                 table: { resizable: true },
//             }),
//              FileHandler.configure({
//         allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
//         onDrop: (currentEditor, files, pos) => {
//           files.forEach(file => {
//             const fileReader = new FileReader()

//             fileReader.readAsDataURL(file)
//             fileReader.onload = () => {
//               currentEditor
//                 .chain()
//                 .insertContentAt(pos, {
//                   type: 'image',
//                   attrs: {
//                     src: fileReader.result,
//                   },
//                 })
//                 .focus()
//                 .run()
//             }
//           })
//         },
//         onPaste: (currentEditor, files, htmlContent) => {
//           files.forEach(file => {
//             if (htmlContent) {
//               // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
//               // you could extract the pasted file from this url string and upload it to a server for example
//               console.log(htmlContent) // eslint-disable-line no-console
//               return false
//             }

//             const fileReader = new FileReader()

//             fileReader.readAsDataURL(file)
//             fileReader.onload = () => {
//               currentEditor
//                 .chain()
//                 .insertContentAt(currentEditor.state.selection.anchor, {
//                   type: 'image',
//                   attrs: {
//                     src: fileReader.result,
//                   },
//                 })
//                 .focus()
//                 .run()
//             }
//           })
//         },
//       }),
//         Image.configure({
//         resize: {
//           enabled: true,
//           directions: ['top', 'bottom', 'left', 'right'], // can be any direction or diagonal combination
//           minWidth: 50,
//           minHeight: 50,
//           alwaysPreserveAspectRatio: true,
//         }
//       })
//         ],
      //   content: `
      //   <table>
      //     <tbody>
      //       <tr>
      //         <th>Name</th>
      //         <th colspan="3">Description</th>
      //       </tr>
      //       <tr>
      //         <td>Cyndi Lauper</td>
      //         <td>Singer</td>
      //         <td>Songwriter</td>
      //         <td>Actress</td>
      //       </tr>
      //     </tbody>
      //   </table>

      //   <img src="https://placehold.co/600x400" />
      //   <img src="https://placehold.co/800x400" />
      // `,
//         immediatelyRender: false,   
//   })

  
  
//   return (
//     <div className='size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-hidden'>
//         <div className='min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full '>
//             <EditorContent  editor={editor} />
//         </div> 
//     </div>
//   )
// }

// export default Editor

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TableKit } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import { useEditorStore } from "@/store/use-editor-store";
import Link from '@tiptap/extension-link'
import { FontFamily, TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import TextAlign from '@tiptap/extension-text-align'
import { FontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import { Ruler } from "./ruler";
import {useLiveblocksExtension} from "@liveblocks/react-tiptap"
import { Threads } from "./threads";
import { AiToolbar } from "./ai-toolbar";
import { useStorage } from "@liveblocks/react";
import { LEFT_MARGIN_DEFAULT,RIGHT_MARGIN_DEFAULT } from "@/constants/margins";
interface EditorProps {
  initialContent? :string | undefined;
}

const Editor = ({initialContent}:EditorProps) => {

  const leftMargin = useStorage((root) => root.leftMargin) ?? LEFT_MARGIN_DEFAULT;
  const rightMargin = useStorage((root) => root.rightMargin) ?? RIGHT_MARGIN_DEFAULT;

  const liveBlocks = useLiveblocksExtension({
    initialContent,
    offlineSupport_experimental:true,
  });
  const { setEditor } = useEditorStore();

  const editor = useEditor({
      immediatelyRender: false,
      onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },

    editorProps: {
      attributes: {
        style: `padding-left:${leftMargin}px; padding-right:${rightMargin}px;`, 
        class:
          "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
    },
    extensions: [
      liveBlocks,
      StarterKit.configure({
        history: false,
      } as Record<string, unknown>),
      LineHeightExtension.configure({
        types:["heading", "paragraph"],
        defaultLineHeight: "normal",
      }),
      FontSizeExtension,

      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),

      /* ✅ MOVE TEXT ALIGN HERE */
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
      }),

      Image,

      Highlight.configure({ multicolor: true }),

      TextStyle,

      Color.configure({
        types: ["textStyle"],
      }),

      FontFamily.configure({
        types: ["textStyle"],
      }),

      TaskList,
      TaskItem.configure({
        nested: true,
      }),

      TableKit.configure({
        table: { resizable: true },
      }),

      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
        onDrop: (currentEditor, files, pos) => {
          files.forEach((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: { src: reader.result },
                })
                .focus()
                .run();
            };
          });
        },
      }),
    ],
  });

  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 ">
      <Ruler/>
      <div className="min-w-max flex justify-center w-[816px]  mx-auto relative">
        <AiToolbar editor={editor} />
        <EditorContent editor={editor} />
        <Threads editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
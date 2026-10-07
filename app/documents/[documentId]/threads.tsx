// import { useThreads } from "@liveblocks/react/suspense";
// import {
//   AnchoredThreads,
//   FloatingComposer,
//   FloatingThreads,
// } from "@liveblocks/react-tiptap";
// import { Editor } from "@tiptap/react";

// export function Threads({ editor }: { editor: Editor | null }) {
//   const { threads } = useThreads({ query: { resolved: false } });

//   return (
//     <>
//       <div className="anchored-threads">
//         <AnchoredThreads editor={editor} threads={threads} />
//       </div>
//       <FloatingThreads
//         editor={editor}
//         threads={threads}
//         className="floating-threads"
//       />
//       <FloatingComposer editor={editor} className="floating-composer" />
//     </>
//   );
// }

"use client";

import { useThreads } from "@liveblocks/react/suspense";
import {
  AnchoredThreads,
  FloatingComposer,
  FloatingThreads,
} from "@liveblocks/react-tiptap";
import { Editor } from "@tiptap/react";

export function Threads({ editor }: { editor: Editor | null }) {
  const { threads } = useThreads({
    query: { resolved: false },
  });

  return (
    <>
      <div className="anchored-threads">
        <AnchoredThreads editor={editor} threads={threads} />
      </div>

      <FloatingThreads
        editor={editor}
        threads={threads}
        className="floating-threads"
      />

      <FloatingComposer
        editor={editor}
        className="floating-composer"
      />
    </>
  );
}

// "use client";

// import { ClientSideSuspense, useThreads } from "@liveblocks/react/suspense";
// import {
//   AnchoredThreads,
//   FloatingComposer,
//   FloatingThreads,
// } from "@liveblocks/react-tiptap";
// import { Editor } from "@tiptap/react";


// export const Threads = ({ editor }: { editor: Editor | null }) => {
//   return (
//     <ClientSideSuspense fallback={null}>
//       <ThreadsList editor={editor} />
//     </ClientSideSuspense>
//   )
// }

//  function ThreadsList({ editor }: { editor: Editor | null }) {
//   const { threads } = useThreads({
//     query: { resolved: false },
//   });

//   return (
//     <>
//       {/* Right side thread panel */}
//       <div className="fixed right-4 top-24 w-[320px] z-50">
//         <FloatingThreads
//           editor={editor}
//           threads={threads}
//           className="bg-white shadow-xl rounded-lg border p-2 max-h-[70vh] overflow-y-auto"
//         />
//       </div>

//       {/* Comment composer */}
//       <FloatingComposer
//         editor={editor}
//         className="fixed right-4 bottom-10 w-[320px] z-50"
//       />
//     </>
//   );
// }
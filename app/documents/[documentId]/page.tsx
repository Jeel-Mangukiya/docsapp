// import Editor from "./editor"
// import { Navbar } from "./navbar";
// import { Room } from "./room";
// import Toolbar from "./toolbar"
// interface DocumentIdPageProps {
//   params: Promise<{documentId: string}>  
// };


// const DocumentIdPage = async  ({params}:DocumentIdPageProps) => {
//   const {documentId} = await params;
//     return (
//     <div className=" min-h-screen bg-[#FAFBFD]  ">
//       <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden h-[112px]">
//           <Navbar/>
//           <Toolbar/> 
//       </div>
//       <div className="pt-[114px] print:pt-0">
//           <Room>
//             <Editor/>
//           </Room>
//       </div>
//     </div>
//   )
// }

// export default DocumentIdPage;




// import Editor from "./editor";
// import { Navbar } from "./navbar";
// import { Room } from "./room";
// import Toolbar from "./toolbar";

// interface DocumentIdPageProps {
//   params: {
//     documentId: string;
//   };
// }

// const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
//   const documentId = params.documentId;

//   if (!documentId) {
//     return <div>Document not found</div>;
//   }

//   return (
//     <div className="min-h-screen bg-[#FAFBFD]">
//       <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden h-[112px]">
//         <Navbar />
//         <Toolbar />
//       </div>

//       <div className="pt-[114px] print:pt-0">
//         <Room documentId={documentId}>
//           <Editor />
//         </Room>
//       </div>
//     </div>
//   );
// };

// export default DocumentIdPage;






// import Editor from "./editor";
// import { Navbar } from "./navbar";
// import { Room } from "./room";
// import Toolbar from "./toolbar";

// interface DocumentIdPageProps {
//   params: Promise<{ documentId: string }>;
// }

// const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
//   const { documentId } = await params;


//   return (
//     <Room documentId={documentId}>
//       <div className="min-h-screen bg-[#FAFBFD]">
//         <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden h-[112px]">
//           <Navbar />
//           <Toolbar />
//         </div>

//         <div className="pt-[114px] print:pt-0">
          
//             <Editor />
//         </div>
//       </div>
//     </Room>
//   );
// };

// export default DocumentIdPage;



// import Editor from "./editor";
// import { Navbar } from "./navbar";
// import { Room } from "./room";
// import Toolbar from "./toolbar";

// interface DocumentIdPageProps {
//   params: Promise<{ documentId: string }>;
// }

// const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
//   const { documentId } = await params;

//   return (
//     <Room documentId={documentId}>
//       <div className="min-h-screen bg-[#FAFBFD]">
//         <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden h-[112px]">
//           <Navbar />
//           <Toolbar />
//         </div>

//         <div className="pt-[114px] print:pt-0">
//           <Editor />
//         </div>
//       </div>
//     </Room>
//   );
// };

// export default DocumentIdPage;


import { Id } from "@/convex/_generated/dataModel";
import { Document } from "./document";
import { auth } from "@clerk/nextjs/server";

import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = await params;

  const {getToken} = await auth();
  const token = await getToken({template: "convex"}) ?? undefined;

  if (!token) {
    throw new Error("Unauthorized");
  }
  const preloadedDocument = await preloadQuery(api.documents.getById, 
    {id: documentId},
    {token}
  )
  return <Document preloadedDocument={preloadedDocument} />;
};

export default DocumentIdPage;
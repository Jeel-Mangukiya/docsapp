// "use client";

// import { ReactNode } from "react";
// import { ConvexReactClient } from "convex/react";
// import { ConvexProviderWithClerk } from "convex/react-clerk";
// import { ClerkProvider, useAuth } from "@clerk/nextjs";

// const convex = new ConvexReactClient(
//   process.env.NEXT_PUBLIC_CONVEX_URL!
// );

// export function ConvexClientProvider({ children }: { children: ReactNode }) {
//   return (
//     <ClerkProvider>
//       <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
//         {children}
//       </ConvexProviderWithClerk>
//     </ClerkProvider>
//   );
// }



// "use client";

// import { ReactNode } from "react";
// import {  ConvexReactClient,Authenticated,Unauthenticated,AuthLoading } from "convex/react";
// import {ConvexProviderWithClerk} from "convex/react-clerk";
// import {ClerkProvider,useAuth,SignIn} from "@clerk/nextjs"

// const convex = new ConvexReactClient(
//   process.env.NEXT_PUBLIC_CONVEX_URL!
// );

// // console.log(process.env.NEXT_PUBLIC_CONVEX_URL);

// export function ConvexClientProvider({ children }: { children: ReactNode }) {
//   return (
//     <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
//         <ConvexProviderWithClerk 
//         useAuth={useAuth} 
//         client={convex}
//         >
//             <Authenticated>
//               {children}
//              </Authenticated>  
//              <Unauthenticated>
//                 <div className="flex flex-col items-center min-h-screen justify-center ">
//                     <SignIn/>
//                 </div>
//              </Unauthenticated>    
//              <AuthLoading>
//                 <p>Loading auth...</p>
//              </AuthLoading>   

//         </ConvexProviderWithClerk>
//     </ClerkProvider>
//   );
  
// }
















// "use client";

// import { ReactNode } from "react";
// import { ConvexReactClient } from "convex/react";
// import { ConvexProviderWithClerk } from "convex/react-clerk";
// import { ClerkProvider, useAuth } from "@clerk/nextjs";

// const convex = new ConvexReactClient(
//   process.env.NEXT_PUBLIC_CONVEX_URL!
// );

// export function ConvexClientProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
//       <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
//         {children}
//       </ConvexProviderWithClerk>
//     </ClerkProvider>
//   );
// }




// "use client";

// import { ReactNode } from "react";
// import { ConvexReactClient } from "convex/react";
// import { ConvexProviderWithClerk } from "convex/react-clerk";
// import { ClerkProvider, useAuth } from "@clerk/nextjs";

// const convex = new ConvexReactClient(
//   process.env.NEXT_PUBLIC_CONVEX_URL!
// );

// export function ConvexClientProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
//       <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
//         {children}
//       </ConvexProviderWithClerk>
//     </ClerkProvider>
//   );
// }



































"use client";

import { ReactNode } from "react";
import {
  ConvexReactClient,
  Authenticated,
  Unauthenticated,
  AuthLoading,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth, SignIn } from "@clerk/nextjs";
import { FullScreerLoader } from "./fullscreen--loader";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const isConvexConfigured = Boolean(
  convexUrl && convexUrl.startsWith("http") && !convexUrl.includes("placeholder")
);

const convex = isConvexConfigured ? new ConvexReactClient(convexUrl!) : null;

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  if (!convex) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background text-foreground">
        <div className="max-w-md p-8 border rounded-xl shadow-lg bg-card border-border">
          <h2 className="text-xl font-bold text-destructive mb-2">Convex Backend Not Configured</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Please set a valid <code className="px-1 py-0.5 bg-muted rounded font-mono text-xs">NEXT_PUBLIC_CONVEX_URL</code> in your <code className="px-1 py-0.5 bg-muted rounded font-mono text-xs">.env.local</code> file.
          </p>
          <p className="text-xs text-muted-foreground">
            Run <code className="px-1 py-0.5 bg-muted rounded font-mono text-xs">npx convex dev</code> to generate your backend deployment URL automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        
        <Authenticated>
          {children}
        </Authenticated>

        <Unauthenticated>
          <div className="flex flex-col items-center min-h-screen justify-center">
            <SignIn routing="hash" />
          </div>
        </Unauthenticated>

        <AuthLoading>
          <FullScreerLoader label="Loading auth..." />
        </AuthLoading>

      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}





// "use client";

// import { ReactNode } from "react";
// import {
//   ConvexReactClient,
//   Authenticated,
//   Unauthenticated,
//   AuthLoading,
// } from "convex/react";
// import { ConvexProviderWithClerk } from "convex/react-clerk";
// import { ClerkProvider, useAuth, SignIn } from "@clerk/nextjs";
// import { FullScreerLoader } from "./fullscreen--loader";

// const convex = new ConvexReactClient(
//   process.env.NEXT_PUBLIC_CONVEX_URL!
// );

// export function ConvexClientProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
//       <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        
//         <Authenticated>
//           {children}
//         </Authenticated>

//         <Unauthenticated>
//           <div className="flex flex-col items-center min-h-screen justify-center">
//             <SignIn
//               routing="path"
//               signUpUrl="/sign-up"
//               signInUrl="/sign-in"
//             />
//           </div>
//         </Unauthenticated>

//         <AuthLoading>
//           <FullScreerLoader label="Loading auth..." />
//         </AuthLoading>

//       </ConvexProviderWithClerk>
//     </ClerkProvider>
//   );
// }
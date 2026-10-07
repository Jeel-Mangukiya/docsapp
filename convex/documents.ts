// import { title } from "process";
// import { v } from "convex/values"; 
// import { mutation, query } from "./_generated/server";


// export const create = mutation({
//   args: {title: v.optional(v.string()) ,intitalContent: v.optional(v.string())  },
//   handler:async (ctx,args) => {
//     const user = await ctx.auth.getUserIdentity();
//     if(!user){
//       throw new Error("Unauthorized");
//     }

//    return  await ctx.db.insert("documents",{
//       title: args.title ?? "Untitled Document",
//       ownerId: user.userId,
//       intitalContent: args.intitalContent,
//     });

//   },

// })

// export const get = query({
//   args: {},
//   handler: async (ctx) => {
//     return await ctx.db.query("documents").collect();
//   },
// });

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";


export const getByIds = query({
  args: { ids: v.array(v.id("documents")) },
  handler: async (ctx, { ids }) => {
    const documents = [];

    for (const id of ids) {
      const document = await ctx.db.get(id);

      if (document) {
        documents.push({ id: document._id, name: document.title });
      }
      else{
        documents.push({ id: id, name: "[Removed]" });
      }
    }

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    intitalContent: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

     const organizationId = (identity.organization_id ?? undefined) as 
    | string
    | undefined;

    return await ctx.db.insert("documents", {
      title: args.title ?? "Untitled Document",
      ownerId: identity.subject,
      organizationId,
      intitalContent: args.intitalContent,
    });
  },
});

export const get = query({
  args: {paginationOpts: paginationOptsValidator, search: v.optional(v.string())},
  handler: async (ctx,{search,paginationOpts}) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("Unauthorized");
    }


    const organizationId = (user.organization_id ?? undefined) as 
    | string
    | undefined;
    
    // search within organziation
    if(search && organizationId){
      return await ctx.db.query("documents").withSearchIndex("search_title",(q)=>q.search("title",search).eq("organizationId",organizationId)).paginate(paginationOpts);
    }

    // normal search
    if(search){
      return await ctx.db.query("documents").withSearchIndex("search_title",(q)=>q.search("title",search).eq("ownerId",user.subject)).paginate(paginationOpts);
    }
    

    // all docs inside organziation
    if(organizationId){
      return await ctx.db
      .query("documents")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", organizationId))
      .paginate(paginationOpts);
    }


    // all docs
      return await ctx.db
      .query("documents")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
      .paginate(paginationOpts);
  },
});




export const removeById = mutation({
  args: {id: v.id("documents")},

  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("Unauthorized");
    }


     const organizationId = (user.organization_id ?? undefined) as 
    | string
    | undefined;

    const document = await ctx.db.get(args.id);

    if(!document){
      throw new Error("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
    const isOrganizationMember = !!(document.organizationId && document.organizationId === organizationId);

    if(!isOwner && !isOrganizationMember){
      throw new Error("Unauthorized");
    }
   
    return await ctx.db.delete(args.id);
  },
})



export const UpdateById = mutation({
  args: {id: v.id("documents"),title: v.string()},

  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("Unauthorized");
    }

      const organizationId = (user.organization_id ?? undefined) as 
    | string
    | undefined;

    const document = await ctx.db.get(args.id);

    if(!document){
      throw new Error("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
     const isOrganizationMember = !!(document.organizationId && document.organizationId === organizationId);

    if(!isOwner && !isOrganizationMember){
      throw new Error("Unauthorized");
    }
   
    return await ctx.db.patch(args.id, {title:args.title});
  },
})



export const getById = query({
  args: {
    id: v.id("documents"),
  },

  handler: async (ctx, {id}) => {
  const document =  await ctx.db.get(id);
    if(!document){
      throw new Error("Document not found");
    }
    return document;
  }
})


// export const UpdateById = mutation({
//   args: {
//     id: v.id("documents"),
//     title: v.string(),
//   },

//   handler: async (ctx, args) => {
//     const user = await ctx.auth.getUserIdentity();

//     if (!user) {
//       throw new Error("Unauthorized");
//     }

//     const document = await ctx.db.get(args.id);

//     if (!document) {
//       throw new Error("Document not found");
//     }

//     const organizationRole = (user.organization_role ?? undefined) as
//       | string
//       | undefined;

//     const isOwner = document.ownerId === user.subject;

    

//     const isAdmin =
//       organizationRole === "admin" || organizationRole === "owner";

//     // PERSONAL DOCUMENT
//     if (!document.organizationId) {
//       if (!isOwner) {
//         throw new Error("Unauthorized");
//       }
//     }

//     // ORGANIZATION DOCUMENT
//     if (document.organizationId) {
//       if (!isOwner && !isAdmin) {
//         throw new Error("Unauthorized");
//       }
//     }

//     return await ctx.db.patch(args.id, {
//       title: args.title,
//     });
//   },
// });


// export const removeById = mutation({
//   args: {
//     id: v.id("documents"),
//   },

//   handler: async (ctx, args) => {
//     const user = await ctx.auth.getUserIdentity();

//     if (!user) {
//       throw new Error("Unauthorized");
//     }

//     const document = await ctx.db.get(args.id);

//     if (!document) {
//       throw new Error("Document not found");
//     }

//     const organizationRole = (user.organization_role ?? undefined) as
//       | string
//       | undefined;

//     const isOwner = document.ownerId === user.subject;

//     const isAdmin =
//       organizationRole === "admin" || organizationRole === "owner";

//     // PERSONAL DOCUMENT
//     if (!document.organizationId) {
//       if (!isOwner) {
//         throw new Error("Unauthorized");
//       }
//     }

//     // ORGANIZATION DOCUMENT
//     if (document.organizationId) {
//       if (!isOwner && !isAdmin) {
//         throw new Error("Unauthorized");
//       }
//     }

//     return await ctx.db.delete(args.id);
//   },
// });

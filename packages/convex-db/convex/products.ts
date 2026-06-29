import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .order("desc")
      .collect();
    return products;
  },
});

export const get = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

export const create = mutation({
  args: {
    thumbnail: v.string(),
    title: v.string(),
    additionalPhotos: v.array(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("archived"),
    ),
    autoDeleteAfter: v.optional(v.number()),
    createdBy: v.optional(v.id("accounts")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const productId = await ctx.db.insert("products", {
      thumbnail: args.thumbnail,
      title: args.title,
      additionalPhotos: args.additionalPhotos,
      price: args.price,
      description: args.description,
      status: args.status,
      autoDeleteAfter: args.autoDeleteAfter,
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    });
    return { productId };
  },
});

export const update = mutation({
  args: {
    productId: v.id("products"),
    thumbnail: v.optional(v.string()),
    title: v.optional(v.string()),
    additionalPhotos: v.optional(v.array(v.string())),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("inactive"),
        v.literal("archived"),
      ),
    ),
    autoDeleteAfter: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { productId, ...fields } = args;
    await ctx.db.patch(productId, {
      ...fields,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

export const remove = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.productId);
    return { success: true };
  },
});

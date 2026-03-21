import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

export const list = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();
  },
});

export const listByAccount = query({
  args: { accountId: v.union(v.id("accounts"), v.null()) },
  handler: async (ctx, args) => {
    if (!args.accountId) {
      return [];
    }
    const accountId = args.accountId;
    const profiles = await ctx.db
      .query("profiles")
      .withIndex("by_account", (q) => q.eq("accountId", accountId))
      .collect();

    const orders = [];
    for (const profile of profiles) {
      const profileOrders = await ctx.db
        .query("orders")
        .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
        .collect();
      orders.push(...profileOrders.map((order) => ({ ...order, profile })));
    }

    return orders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const get = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

export const create = mutation({
  args: {
    profileId: v.id("profiles"),
    prescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      profileId: args.profileId,
      prescription: args.prescription,
      status: "ordered",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { orderId };
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("ordered"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("out_for_delivery"),
      v.literal("delivered"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

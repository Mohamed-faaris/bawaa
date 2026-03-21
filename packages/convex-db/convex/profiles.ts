import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { accountId: v.union(v.id("accounts"), v.null()) },
  handler: async (ctx, args) => {
    const accountId = args.accountId;
    if (!accountId) {
      return [];
    }
    return await ctx.db
      .query("profiles")
      .withIndex("by_account", (q) => q.eq("accountId", accountId))
      .collect();
  },
});

export const get = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.profileId);
  },
});

export const create = mutation({
  args: {
    accountId: v.id("accounts"),
    name: v.string(),
    avatar: v.optional(v.string()),
    age: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const profileId = await ctx.db.insert("profiles", {
      accountId: args.accountId,
      name: args.name,
      avatar: args.avatar,
      age: args.age,
      createdAt: Date.now(),
    });
    return { profileId };
  },
});

export const update = mutation({
  args: {
    profileId: v.id("profiles"),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    age: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.avatar !== undefined) updates.avatar = args.avatar;
    if (args.age !== undefined) updates.age = args.age;

    await ctx.db.patch(args.profileId, updates);
    return { success: true };
  },
});

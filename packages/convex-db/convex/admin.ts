import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const verifySecret = query({
  args: { secret: v.string() },
  handler: async (ctx, args) => {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return { valid: false, error: "Admin secret not configured" };
    }
    return { valid: args.secret === adminSecret };
  },
});

export const listOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    const profiles = await ctx.db.query("profiles").collect();
    const accounts = await ctx.db.query("accounts").collect();

    const profileMap = new Map(profiles.map((p) => [p._id, p]));
    const accountMap = new Map(accounts.map((a) => [a._id, a]));

    return orders
      .map((order) => {
        const profile = profileMap.get(order.profileId);
        const account = profile ? accountMap.get(profile.accountId) : null;
        return {
          ...order,
          profile,
          account,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const updateOrderStatus = mutation({
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

export const listAccounts = query({
  args: {},
  handler: async (ctx) => {
    const accounts = await ctx.db.query("accounts").collect();
    const profiles = await ctx.db.query("profiles").collect();

    return accounts.map((account) => ({
      ...account,
      profiles: profiles.filter((p) => p.accountId === account._id),
    }));
  },
});

export const listProfiles = query({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    const accounts = await ctx.db.query("accounts").collect();

    return profiles.map((profile) => ({
      ...profile,
      account: accounts.find((a) => a._id === profile.accountId),
    }));
  },
});

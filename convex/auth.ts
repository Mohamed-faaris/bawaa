import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const OTP_CODE = "1234";

export const sendOtp = mutation({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    return { success: true, message: "OTP sent" };
  },
});

export const verifyOtp = mutation({
  args: { phone: v.string(), code: v.string() },
  handler: async (ctx, args) => {
    if (args.code !== OTP_CODE) {
      throw new Error("Invalid OTP code");
    }

    const existingAccount = await ctx.db
      .query("accounts")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();

    if (existingAccount) {
      return {
        success: true,
        accountId: existingAccount._id,
        isNewUser: false,
      };
    }

    const accountId = await ctx.db.insert("accounts", {
      phone: args.phone,
      name: `User ${args.phone.slice(-4)}`,
      createdAt: Date.now(),
    });

    return {
      success: true,
      accountId,
      isNewUser: true,
    };
  },
});

export const getAccount = query({
  args: { accountId: v.id("accounts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.accountId);
  },
});

export const getAccountByPhone = query({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("accounts")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();
  },
});

export const updateAccount = mutation({
  args: {
    accountId: v.id("accounts"),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;

    await ctx.db.patch(args.accountId, updates);
    return { success: true };
  },
});

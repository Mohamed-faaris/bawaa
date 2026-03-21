import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  accounts: defineTable({
    phone: v.string(),
    name: v.string(),
    createdAt: v.number(),
  }).index("by_phone", ["phone"]),
  profiles: defineTable({
    accountId: v.id("accounts"),
    name: v.string(),
    avatar: v.optional(v.string()),
    age: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_account", ["accountId"]),
  orders: defineTable({
    profileId: v.id("profiles"),
    prescription: v.optional(v.string()),
    status: v.union(
      v.literal("ordered"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("out_for_delivery"),
      v.literal("delivered"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_profile", ["profileId"]),
});

import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

function b64url(s: string): string {
  return btoa(s).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function pemToBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----.*?-----/g, "").replace(/\s/g, "");
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return bytes.buffer;
}

async function createJWT(
  clientEmail: string,
  privateKeyPem: string,
): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const headerB64 = b64url(JSON.stringify(header));
  const payloadB64 = b64url(JSON.stringify(payload));
  const signingInput = `${headerB64}.${payloadB64}`;

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToBuffer(privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    privateKey,
    new TextEncoder().encode(signingInput),
  );

  const sigB64 = b64url(
    String.fromCharCode(...new Uint8Array(signature)),
  );

  return `${signingInput}.${sigB64}`;
}

async function getAccessToken(): Promise<string> {
  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!saJson) throw new Error("FIREBASE_SERVICE_ACCOUNT env var not set");
  const sa = JSON.parse(saJson);
  const jwt = await createJWT(sa.client_email, sa.private_key);

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data: any = await resp.json();
  if (!data.access_token)
    throw new Error(`OAuth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function sendFCM(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  const accessToken = await getAccessToken();
  const projectId = "baawa-medicals";

  const resp = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          token,
          notification: { title, body },
          data: data ?? {},
        },
      }),
    },
  );

  if (!resp.ok) {
    const err = await resp.text();
    console.error("FCM send error:", err);
  }
}

export const listAdminTokens = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("fcmTokens")
      .withIndex("by_admin", (q) => q.eq("isAdmin", true))
      .collect();
  },
});

export const listAccountTokens = query({
  args: { accountId: v.id("accounts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fcmTokens")
      .withIndex("by_account", (q) => q.eq("accountId", args.accountId))
      .collect();
  },
});

export const registerToken = mutation({
  args: {
    accountId: v.optional(v.id("accounts")),
    isAdmin: v.boolean(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("fcmTokens")
      .filter((q) => q.eq(q.field("token"), args.token))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        accountId: args.accountId,
        isAdmin: args.isAdmin,
      });
      return { registered: true, updated: true };
    }

    await ctx.db.insert("fcmTokens", {
      accountId: args.accountId,
      isAdmin: args.isAdmin,
      token: args.token,
      createdAt: Date.now(),
    });

    return { registered: true };
  },
});

export const unregisterToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("fcmTokens")
      .filter((q) => q.eq(q.field("token"), args.token))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    return { unregistered: true };
  },
});

export const sendAdminNotification = action({
  args: {
    orderId: v.id("orders"),
    orderCode: v.string(),
    customerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tokens = await ctx.runQuery(api.notifications.listAdminTokens);

    for (const t of tokens) {
      await sendFCM(
        t.token,
        "New Order",
        `${args.orderCode}${args.customerName ? ` — ${args.customerName}` : ""}`,
        { orderId: args.orderId, type: "new_order" },
      );
    }
  },
});

export const sendCustomerNotification = action({
  args: {
    accountId: v.id("accounts"),
    orderId: v.id("orders"),
    orderCode: v.string(),
    newStatus: v.string(),
  },
  handler: async (ctx, args) => {
    const tokens = await ctx.runQuery(api.notifications.listAccountTokens, {
      accountId: args.accountId,
    });

    const statusLabels: Record<string, string> = {
      ordered: "Ordered",
      processing: "Processing",
      ready: "Ready for delivery",
      out_for_delivery: "Out for delivery",
      delivered: "Delivered",
    };

    for (const t of tokens) {
      await sendFCM(
        t.token,
        "Order Updated",
        `${args.orderCode} is now ${statusLabels[args.newStatus] || args.newStatus}`,
        { orderId: args.orderId, type: "status_update", status: args.newStatus },
      );
    }
  },
});

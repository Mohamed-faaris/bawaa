import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { useMutation } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import { messaging } from "@/lib/firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export function useFcmToken() {
  const registerToken = useMutation(api.notifications.registerToken);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | undefined>(
    typeof window !== "undefined"
      ? localStorage.getItem("accountId") || undefined
      : undefined,
  );

  useEffect(() => {
    const handler = () => {
      setAccountId(localStorage.getItem("accountId") || undefined);
    };
    window.addEventListener("fcm:login", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("fcm:login", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  useEffect(() => {
    if (fcmToken) return;

    const init = async () => {
      try {
        const swReg = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: swReg,
        });

        if (!token) return;
        setFcmToken(token);

        onMessage(messaging, (payload) => {
          const { title, body } = payload.notification || {};
          if (title) {
            new Notification(title, { body: body || "" });
          }
        });
      } catch (err) {
        console.error("FCM init error:", err);
      }
    };

    void init();
  }, [fcmToken]);

  useEffect(() => {
    if (!fcmToken) return;

    registerToken({
      accountId: accountId ? (accountId as any) : undefined,
      isAdmin: false,
      token: fcmToken,
    });
  }, [fcmToken, accountId, registerToken]);
}

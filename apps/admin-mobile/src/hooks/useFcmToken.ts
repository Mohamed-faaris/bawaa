import { useEffect, useRef } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { useMutation } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";
import { messaging } from "@/lib/firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export function useFcmToken() {
  const registerToken = useMutation(api.notifications.registerToken);
  const registered = useRef(false);

  useEffect(() => {
    if (registered.current) return;
    registered.current = true;

    const init = async () => {
      try {
        if (typeof window === "undefined") return;

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

        await registerToken({
          accountId: undefined,
          isAdmin: true,
          token,
        });

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
  }, [registerToken]);
}

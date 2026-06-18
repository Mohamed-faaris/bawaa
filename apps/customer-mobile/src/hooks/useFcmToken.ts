import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { useMutation } from "convex/react";
import { api } from "@bawaa/convex-db/convex/_generated/api";

export function useFcmToken() {
  const registerToken = useMutation(api.notifications.registerToken);
  const initialized = useRef(false);
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
    if (!accountId || initialized.current) return;
    initialized.current = true;

    let registrationListener: { remove: () => void } | undefined;
    let receivedListener: { remove: () => void } | undefined;
    let unsubscribeOnMessage: (() => void) | undefined;

    const init = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          const currentPerm = await PushNotifications.checkPermissions();
          if (currentPerm.receive !== "granted") {
            const perm = await PushNotifications.requestPermissions();
            if (perm.receive !== "granted") return;
          }

          await PushNotifications.register();

          registrationListener = await PushNotifications.addListener(
            "registration",
            (token) => {
              registerToken({
                accountId: accountId as any,
                isAdmin: false,
                token: token.value,
              });
            },
          );

          receivedListener = await PushNotifications.addListener(
            "pushNotificationReceived",
            (notification) => {
              const { title, body } = notification.notification || notification;
              if (title && typeof Notification !== "undefined") {
                new Notification(title, { body: body || "" });
              }
            },
          );
        } else {
          const { getToken, onMessage } = await import("firebase/messaging");
          const { messaging } = await import("@/lib/firebase");

          const swReg = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
          );

          const permission = await Notification.requestPermission();
          if (permission !== "granted") return;

          const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;
          const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: swReg,
          });

          if (!token) return;

          registerToken({
            accountId: accountId as any,
            isAdmin: false,
            token,
          });

          unsubscribeOnMessage = onMessage(messaging, (payload) => {
            const { title, body } = payload.notification || {};
            if (title && typeof Notification !== "undefined") {
              new Notification(title, { body: body || "" });
            }
          });
        }
      } catch (err) {
        console.error("Push init error:", err);
      }
    };

    void init();

    return () => {
      registrationListener?.remove();
      receivedListener?.remove();
      unsubscribeOnMessage?.();
    };
  }, [accountId, registerToken]);
}

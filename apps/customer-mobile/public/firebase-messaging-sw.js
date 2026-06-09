importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAiCyvd7Yx6E68iFEHu7phjIxyUshixLKg",
  authDomain: "baawa-medicals.firebaseapp.com",
  projectId: "baawa-medicals",
  storageBucket: "baawa-medicals.firebasestorage.app",
  messagingSenderId: "406265587881",
  appId: "1:406265587881:web:4015da80c75173b7ae21b8",
  measurementId: "G-9DKJDLFYVZ",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || "Bawaa", {
    body: body || "",
    icon: "/apple-touch-icon.png",
  });
});

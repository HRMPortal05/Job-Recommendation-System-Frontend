importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "FIREBASE_CONFIG") {
    firebase.initializeApp(event.data.firebaseConfig);

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log("Received background message ", payload);
      self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/pwa-192x192.png",
      });
    });
  }
});

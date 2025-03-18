// Firebase App (the core Firebase SDK) is always required and must be listed first
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

let firebaseInitialized = false;

// Cache the Firebase config when received
let cachedFirebaseConfig = null;

// Set up the event listener for the 'push' event
self.addEventListener("push", (event) => {
  console.log("Push event received", event);

  let notificationData = {};

  try {
    notificationData = event.data.json();
  } catch (e) {
    console.error("Error parsing push event data:", e);
    notificationData = {
      notification: {
        title: "New Notification",
        body: "You have a new notification",
        icon: "/pwa-192x192.png",
      },
    };
  }

  const options = {
    body: notificationData.notification.body || "",
    icon: notificationData.notification.icon || "/pwa-192x192.png",
    badge: "/pwa-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      url: notificationData.data?.click_action || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.notification.title || "New Notification",
      options
    )
  );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked", event);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (const client of windowClients) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // If no window/tab is open or URL doesn't match, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Listen for messages from the main app
self.addEventListener("message", (event) => {
  if (
    event.data &&
    event.data.type === "FIREBASE_CONFIG" &&
    !firebaseInitialized
  ) {
    // Store config for potential future use
    cachedFirebaseConfig = event.data.firebaseConfig;

    try {
      firebase.initializeApp(event.data.firebaseConfig);
      const messaging = firebase.messaging();
      firebaseInitialized = true;

      messaging.onBackgroundMessage((payload) => {
        console.log("Received background message", payload);

        const options = {
          body: payload.notification.body || "",
          icon: payload.notification.icon || "/pwa-192x192.png",
          badge: "/pwa-192x192.png",
          vibrate: [100, 50, 100],
          data: {
            url: payload.data?.click_action || "/",
          },
        };

        self.registration.showNotification(
          payload.notification.title || "New Notification",
          options
        );
      });

      console.log("Firebase Messaging initialized in service worker");
    } catch (error) {
      console.error("Failed to initialize Firebase in service worker:", error);
    }
  }
});

// If the service worker starts without receiving the config (like on a refresh),
// try to use the cached config if available
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");

  if (cachedFirebaseConfig && !firebaseInitialized) {
    try {
      firebase.initializeApp(cachedFirebaseConfig);
      const messaging = firebase.messaging();
      firebaseInitialized = true;

      console.log("Firebase Messaging initialized from cached config");
    } catch (error) {
      console.error("Failed to initialize Firebase from cached config:", error);
    }
  }
});

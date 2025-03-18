// firebase-messaging-sw.js - Place this at the root of your public directory

// Correctly import the Firebase scripts
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

// This is important - Firebase config must be directly in the service worker for mobile PWAs
const firebaseConfig = {
  apiKey: "AIzaSyBUd1MtoUOupz-CIM858rPW4f_jsKhsC_I",
  authDomain: "job-message.firebaseapp.com",
  projectId: "job-message",
  storageBucket: "job-message.firebasestorage.app",
  messagingSenderId: "16389674311",
  appId: "1:16389674311:web:ee7f4f0687f310715a6862",
  measurementId: "G-PH28LCZX9X",
};

// Initialize Firebase immediately in the service worker
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Create notification options with all required fields for mobile
  const notificationOptions = {
    body: payload.notification.body || "",
    icon: "/pwa-192x192.png", // Must be a local icon
    badge: "/badge-icon.png", // Optional, for Android devices
    vibrate: [100, 50, 100], // Vibration pattern for mobile devices
    tag: "notification-" + Date.now(), // Ensures unique notifications
    data: payload.data || {}, // Store any additional data
    actions: [
      {
        action: "open",
        title: "Open App",
      },
    ],
  };

  // Actually show the notification
  return self.registration.showNotification(
    payload.notification.title || "New Notification",
    notificationOptions
  );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification clicked", event);
  event.notification.close();

  // Determine the URL to open (either from payload data or default)
  const urlToOpen = event.notification.data.click_action || "/";

  // Open or focus the client
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If we have a matching client, focus it
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }

        // Otherwise, open a new window
        return clients.openWindow(urlToOpen);
      })
  );
});

// Handle push events directly - this is crucial for mobile PWAs
self.addEventListener("push", (event) => {
  console.log("[firebase-messaging-sw.js] Push received", event);

  let notificationData;

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      console.error("Error parsing push event data:", e);
      notificationData = {
        notification: {
          title: "New Notification",
          body: "You have a new notification",
        },
      };
    }
  } else {
    notificationData = {
      notification: {
        title: "New Notification",
        body: "You have a new notification",
      },
    };
  }

  const notificationOptions = {
    body: notificationData.notification.body || "",
    icon: "/pwa-192x192.png",
    badge: "/badge-icon.png",
    vibrate: [100, 50, 100],
    tag: "notification-" + Date.now(),
    data: notificationData.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.notification.title || "New Notification",
      notificationOptions
    )
  );
});

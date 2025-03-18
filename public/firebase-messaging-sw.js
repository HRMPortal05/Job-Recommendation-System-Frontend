// firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

// Firebase config for the service worker
const firebaseConfig = {
  apiKey: "AIzaSyBUd1MtoUOupz-CIM858rPW4f_jsKhsC_I",
  authDomain: "job-message.firebaseapp.com",
  projectId: "job-message",
  storageBucket: "job-message.firebasestorage.app",
  messagingSenderId: "16389674311",
  appId: "1:16389674311:web:ee7f4f0687f310715a6862",
  measurementId: "G-PH28LCZX9X",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Create a notification ID generator to ensure unique IDs
const generateUniqueId = () => {
  return (
    "notification-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9)
  );
};

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Extract notification data from payload
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationBody = payload.notification?.body || "";
  const notificationData = payload.data || {};

  // Generate a unique tag for this notification
  const notificationTag = generateUniqueId();

  // Create notification options
  const notificationOptions = {
    body: notificationBody,
    icon: "/pwa-192x192.png",
    badge: "/badge-icon.png", // For Android
    vibrate: [100, 50, 100],
    tag: notificationTag, // Unique tag for each notification
    data: {
      ...notificationData,
      notificationId: notificationTag,
      timestamp: Date.now(),
    },
    // Prevent notifications from being automatically grouped
    renotify: true,
    // Highest priority for mobile notifications
    priority: "high",
    // For Android, use default sound
    silent: false,
    // Add actions
    actions: [
      {
        action: "open",
        title: "Open App",
      },
    ],
  };

  // Display the notification
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// Handle push events directly (important for multiple notifications)
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

  // Generate unique ID for this notification
  const notificationTag = generateUniqueId();

  const notificationOptions = {
    body: notificationData.notification?.body || "",
    icon: "/pwa-192x192.png",
    badge: "/badge-icon.png",
    vibrate: [100, 50, 100],
    tag: notificationTag,
    data: {
      ...(notificationData.data || {}),
      notificationId: notificationTag,
      timestamp: Date.now(),
    },
    renotify: true,
    priority: "high",
    silent: false,
    actions: [
      {
        action: "open",
        title: "Open App",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.notification?.title || "New Notification",
      notificationOptions
    )
  );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification clicked", event);

  // Close the notification
  event.notification.close();

  // Get the notification ID and data
  const notificationId = event.notification.data?.notificationId;
  const clickAction = event.notification.data?.click_action || "/";

  // Handle specific actions if present
  if (event.action === "open") {
    console.log("Open action clicked");
    // Handle open action (same as default click behavior)
  }

  // Focus or open window
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Try to find an existing client with the target URL
        for (const client of clientList) {
          // More flexible URL matching
          if (
            (client.url.includes(clickAction) ||
              client.url.endsWith(clickAction)) &&
            "focus" in client
          ) {
            console.log("Focusing existing client:", client.url);
            return client.focus();
          }
        }

        // If no matching client found, open a new window
        console.log("Opening new window to:", clickAction);
        return clients.openWindow(clickAction);
      })
  );
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  console.log("[firebase-messaging-sw.js] Notification closed", event);
  // Track notification close events if needed
});

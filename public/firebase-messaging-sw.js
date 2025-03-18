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

// Use IndexedDB to track notification history
const dbName = "notificationDB";
const storeName = "notificationHistory";
let db;

// Open/initialize IndexedDB
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      resolve(false); // Continue even if DB fails
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: "id" });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;

      // Clean up old entries
      cleanupOldEntries();

      resolve(true);
    };
  });
};

// Initialize DB when service worker starts
initDB();

// Clean up notifications older than 10 seconds
const cleanupOldEntries = () => {
  if (!db) return;

  const cutoffTime = Date.now() - 10000; // 10 seconds ago
  const transaction = db.transaction([storeName], "readwrite");
  const store = transaction.objectStore(storeName);
  const index = store.index("timestamp");

  const range = IDBKeyRange.upperBound(cutoffTime);
  const request = index.openCursor(range);

  request.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      store.delete(cursor.primaryKey);
      cursor.continue();
    }
  };
};

// Check if notification is a duplicate
const isDuplicate = (notificationHash) => {
  return new Promise((resolve) => {
    if (!db) {
      resolve(false);
      return;
    }

    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.get(notificationHash);

    request.onsuccess = (event) => {
      resolve(!!event.target.result);
    };

    request.onerror = () => {
      resolve(false); // If error, assume not duplicate
    };
  });
};

// Record notification to prevent duplicates
const recordNotification = (notificationHash) => {
  if (!db) return Promise.resolve();

  const transaction = db.transaction([storeName], "readwrite");
  const store = transaction.objectStore(storeName);

  return new Promise((resolve) => {
    const request = store.put({
      id: notificationHash,
      timestamp: Date.now(),
    });

    request.onsuccess = () => resolve();
    request.onerror = () => resolve(); // Continue even if recording fails
  });
};

// Function to show notification with deduplication
const showNotification = async (title, options) => {
  // Generate a hash based on notification content
  const notificationHash = `${title}:${options.body}`;

  // Check if duplicate using IndexedDB
  const duplicate = await isDuplicate(notificationHash);
  if (duplicate) {
    console.log("Preventing duplicate notification:", notificationHash);
    return Promise.resolve();
  }

  // Record this notification
  await recordNotification(notificationHash);

  // Show the notification
  return self.registration.showNotification(title, options);
};

// Only use ONE event handler for notifications - disable onBackgroundMessage
// and only use push event handler
messaging.onBackgroundMessage(() => {
  // Deliberately empty - we'll handle all notifications via push event
  console.log(
    "Background message received but ignored - using push handler instead"
  );
});

// Handle all push events
self.addEventListener("push", (event) => {
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

  // Extract FCM data or use defaults
  const notificationTitle =
    notificationData.notification?.title ||
    notificationData.data?.title ||
    "New Notification";

  const notificationBody =
    notificationData.notification?.body || notificationData.data?.body || "";

  const notificationData2 = notificationData.data || {};

  // Generate a unique tag for this notification
  const notificationTag = generateUniqueId();

  // Create notification options
  const notificationOptions = {
    body: notificationBody,
    icon: "/pwa-192x192.png",
    badge: "/badge-icon.png",
    vibrate: [100, 50, 100],
    tag: notificationTag,
    data: {
      ...notificationData2,
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

  // Use waitUntil to ensure the promise is resolved before the event completes
  event.waitUntil(showNotification(notificationTitle, notificationOptions));
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
});

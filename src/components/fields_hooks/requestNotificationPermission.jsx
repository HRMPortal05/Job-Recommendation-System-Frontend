import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Function to request notification permission
export const requestNotificationPermission = async () => {
  try {
    // Check if notifications and service workers are supported
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      console.error("Notifications or Service Workers not supported");
      return null;
    }

    // Request permission explicitly
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission not granted");
      return null;
    }

    // Register service worker if not already registered
    const swRegistration = await registerServiceWorker();
    if (!swRegistration) {
      console.error("Service worker registration failed");
      return null;
    }

    // Check if messaging is supported
    const messagingSupported = await isSupported();
    if (!messagingSupported) {
      console.warn("Firebase messaging not supported on this device");
      return null;
    }

    // Initialize messaging
    const messaging = getMessaging(app);

    // Get FCM token with explicit service worker registration
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPIDKEY,
      serviceWorkerRegistration: swRegistration,
    });

    if (token) {
      // console.log("FCM Token acquired:", token);
      // Store token in indexedDB or localStorage for persistence
      localStorage.setItem("fcmToken", token);
      return token;
    } else {
      console.warn("Failed to get FCM token");
      return null;
    }
  } catch (error) {
    console.error("Error setting up notifications:", error);
    return null;
  }
};

// Function to register service worker
const registerServiceWorker = async () => {
  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
          scope: "/",
        }
      );

      console.log("Service Worker registered with scope:", registration.scope);
      return registration;
    }
    return null;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
};

// Setup foreground message handling
export const setupForegroundMessages = () => {
  try {
    const messaging = getMessaging(app);

    onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);

      // Custom foreground notification for PWA/mobile
      if (payload.notification && Notification.permission === "granted") {
        // If app is in foreground on mobile, we need to show notification manually
        const notification = new Notification(
          payload.notification.title || "New Message",
          {
            body: payload.notification.body || "",
            icon: "/pwa-192x192.png",
            data: payload.data || {},
          }
        );

        notification.onclick = () => {
          notification.close();
          window.focus();

          // Handle any navigation based on data
          if (payload.data?.click_action) {
            window.location.href = payload.data.click_action;
          }
        };
      }
    });
  } catch (error) {
    console.error("Error setting up foreground messages:", error);
  }
};

// Initialize everything
export const initializeNotifications = async () => {
  // Get notification permission and token
  const token = await requestNotificationPermission();

  // Setup foreground message handling
  if (token) {
    setupForegroundMessages();
    return token;
  }

  return null;
};

// Initialize with a user action (button click) for mobile browsers
export const setupNotificationsOnUserAction = () => {
  // This should be called from a user interaction like a button click
  return initializeNotifications();
};

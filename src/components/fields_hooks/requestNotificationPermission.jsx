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

// Initialize Firebase only if messaging is supported
let messaging = null;
let app = null;

// Initialize Firebase and messaging conditionally
const initializeFirebaseMessaging = async () => {
  try {
    // First check if Firebase Messaging is supported in this browser
    if (await isSupported()) {
      app = initializeApp(firebaseConfig);
      messaging = getMessaging(app);
      return true;
    } else {
      console.log("Firebase messaging is not supported in this browser/device");
      return false;
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    return false;
  }
};

export const requestNotificationPermission = async () => {
  // First make sure messaging is initialized
  const isMessagingSupported = await initializeFirebaseMessaging();
  if (!isMessagingSupported) {
    console.warn("Notification features unavailable on this browser/device");
    return null;
  }

  try {
    // First check if notification permission is already granted
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Notification permission denied");
        return null;
      }
    }

    // Wait for service worker to be ready
    const serviceWorkerRegistration = await navigator.serviceWorker.ready;
    console.log("Service worker is ready");

    // Send Firebase config to the service worker
    if (serviceWorkerRegistration.active) {
      serviceWorkerRegistration.active.postMessage({
        type: "FIREBASE_CONFIG",
        firebaseConfig: firebaseConfig,
      });
    }

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPIDKEY,
      serviceWorkerRegistration: serviceWorkerRegistration,
    });

    if (token) {
      console.log("FCM Token:", token);
      // Store token in local storage for persistence
      localStorage.setItem("fcmToken", token);
      return token;
    } else {
      console.warn("No registration token available.");
      return null;
    }
  } catch (error) {
    console.error("FCM token acquisition failed:", error);
    return null;
  }
};

// Handle foreground notifications
export const setupForegroundNotifications = () => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);

    // Display foreground notification manually since Firebase doesn't show them automatically
    if (payload.notification) {
      const { title, body } = payload.notification;

      // Only show notification if we have permission and the app is visible
      if (
        Notification.permission === "granted" &&
        document.visibilityState !== "visible"
      ) {
        const notification = new Notification(title || "New Notification", {
          body: body || "",
          icon: "/pwa-192x192.png",
          data: payload.data,
        });

        notification.onclick = (event) => {
          event.preventDefault();
          window.focus();
          notification.close();

          // Handle any click actions
          const clickAction = payload.data?.click_action;
          if (clickAction && window.location.pathname !== clickAction) {
            window.location.href = clickAction;
          }
        };
      }

      // If app is visible, you might want to show an in-app notification instead
      // e.g., using your SnackbarProvider or a custom notification component
    }
  });
};

// Function to check token validity and refresh if needed
export const ensureValidFCMToken = async () => {
  if (!messaging) await initializeFirebaseMessaging();
  if (!messaging) return null;

  try {
    const currentToken = localStorage.getItem("fcmToken");

    // If we don't have a token, request a new one
    if (!currentToken) {
      return await requestNotificationPermission();
    }

    // Validate existing token or get a new one if needed
    const serviceWorkerRegistration = await navigator.serviceWorker.ready;
    const newToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPIDKEY,
      serviceWorkerRegistration: serviceWorkerRegistration,
    });

    if (newToken !== currentToken) {
      localStorage.setItem("fcmToken", newToken);
      console.log("FCM token updated:", newToken);
    }

    return newToken;
  } catch (error) {
    console.error("Error ensuring valid FCM token:", error);
    return null;
  }
};

// Initialize listeners for foreground messages
if (typeof window !== "undefined") {
  initializeFirebaseMessaging().then((isSupported) => {
    if (isSupported) {
      setupForegroundNotifications();
    }
  });
}

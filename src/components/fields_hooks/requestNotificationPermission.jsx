import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    // Wait for service worker to be ready
    const registration = await navigator.serviceWorker.ready;

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPIDKEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    } else {
      console.warn("No registration token available.");
    }
  } catch (error) {
    console.error("Permission denied or failed:", error);
  }
};

// Listen for foreground messages
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
});

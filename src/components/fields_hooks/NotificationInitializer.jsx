import { useEffect } from "react";
import { initializeNotifications } from "./requestNotificationPermission";

const NotificationInitializer = () => {
  useEffect(() => {
    // Check if we already have permission, and if so, initialize notifications
    if ("Notification" in window && Notification.permission === "granted") {
      // Initialize notifications silently
      initializeNotifications().then((token) => {
        if (token) {
          console.log("Notifications initialized on app load");
        }
      });
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default NotificationInitializer;

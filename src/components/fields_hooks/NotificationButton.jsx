import React, { useState, useEffect } from "react";
import { setupNotificationsOnUserAction } from "./requestNotificationPermission";

const NotificationButton = () => {
  const [permissionState, setPermissionState] = useState("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if we already have permission
    if ("Notification" in window) {
      setPermissionState(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    setLoading(true);
    try {
      const token = await setupNotificationsOnUserAction();
      if (token) {
        setPermissionState("granted");
      } else {
        // Update permission state based on current status
        if ("Notification" in window) {
          setPermissionState(Notification.permission);
        }
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render button based on permission state
  if (permissionState === "granted") {
    return (
      <button className="notification-enabled-btn" disabled>
        Notifications Enabled ✓
      </button>
    );
  }

  if (permissionState === "denied") {
    return (
      <button
        className="notification-denied-btn"
        onClick={() =>
          window.open("chrome://settings/content/notifications", "_blank")
        }
      >
        Enable Notifications in Settings
      </button>
    );
  }

  return null;
};

export default NotificationButton;

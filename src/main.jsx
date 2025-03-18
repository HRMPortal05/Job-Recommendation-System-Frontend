import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import App from "./App.jsx";
import LandingPage from "./components/main/LandingPage.jsx";
import JobList from "./components/jobs/JobList.jsx";
import ChangePassword from "./components/auth/ChangePassword.jsx";
import ForgotPasswordEmail from "./components/auth/ForgotPasswordEmail.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";
import UserProfile from "./components/userprofile/UserProfile.jsx";
import AddJobForm from "./components/jobs/AddJobForm.jsx";
import CompleteProfilePage from "./components/userprofile/CompleteProfilePage.jsx";
import RemoteJobList from "./components/jobs/RemoteJobList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "joblist", element: <JobList /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "forgot-password", element: <ForgotPasswordEmail /> },
      {
        path: `reset-password/:user_id/:temp_token`,
        element: <ResetPassword />,
      },
      { path: "userprofile", element: <UserProfile /> },
      { path: "completeprofile", element: <CompleteProfilePage /> },
      { path: "postjob", element: <AddJobForm /> },
      { path: "remote-jobs", element: <RemoteJobList /> },
    ],
  },
  {
    path: "*",
    element: <></>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}>
      <RouterProvider router={router} />
    </SnackbarProvider>
  </React.StrictMode>
);

// ✅ Register Firebase Messaging Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);

      // Send Firebase config to the service worker
      registration.active?.postMessage({
        type: "FIREBASE_CONFIG",
        firebaseConfig: {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID,
          measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
        },
      });
    })
    .catch((error) =>
      console.error("Service Worker registration failed:", error)
    );
}

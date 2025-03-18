import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import App from "./App.jsx";

const LandingPage = lazy(() => import("./components/main/LandingPage.jsx"));
const JobList = lazy(() => import("./components/jobs/JobList.jsx"));
const ChangePassword = lazy(() =>
  import("./components/auth/ChangePassword.jsx")
);
const ForgotPasswordEmail = lazy(() =>
  import("./components/auth/ForgotPasswordEmail.jsx")
);
const ResetPassword = lazy(() => import("./components/auth/ResetPassword.jsx"));
const UserProfile = lazy(() =>
  import("./components/userprofile/UserProfile.jsx")
);
const AddJobForm = lazy(() => import("./components/jobs/AddJobForm.jsx"));
const CompleteProfilePage = lazy(() =>
  import("./components/userprofile/CompleteProfilePage.jsx")
);
const RemoteJobList = lazy(() => import("./components/jobs/RemoteJobList.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: "joblist",
        element: (
          <Route
            path="joblist"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <JobList />
              </Suspense>
            }
          />
        ),
      },
      {
        path: "change-password",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ChangePassword />
          </Suspense>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ForgotPasswordEmail />
          </Suspense>
        ),
      },
      {
        path: "reset-password/:user_id/:temp_token",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ResetPassword />
          </Suspense>
        ),
      },
      {
        path: "userprofile",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <UserProfile />
          </Suspense>
        ),
      },
      {
        path: "completeprofile",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <CompleteProfilePage />
          </Suspense>
        ),
      },
      {
        path: "postjob",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AddJobForm />
          </Suspense>
        ),
      },
      {
        path: "remote-jobs",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <RemoteJobList />
          </Suspense>
        ),
      },
    ],
  },
  { path: "*", element: <></> },
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
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then(async (registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );

        // Wait for the service worker to become active
        if (registration.waiting) {
          registration.waiting.postMessage({
            type: "FIREBASE_CONFIG",
            firebaseConfig: getFirebaseConfig(),
          });
        } else if (registration.active) {
          registration.active.postMessage({
            type: "FIREBASE_CONFIG",
            firebaseConfig: getFirebaseConfig(),
          });
        } else {
          console.log("Service worker is installing or not yet active.");
        }
      })
      .catch((error) =>
        console.error("Service Worker registration failed:", error)
      );
  });
}

// ✅ Function to get Firebase config securely
const getFirebaseConfig = () => ({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});

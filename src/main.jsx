import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import LandingPage from "./components/main/LandingPage.jsx";
import JobList from "./components/jobs/JobList.jsx";
import { SnackbarProvider } from "notistack";
import ChangePassword from "./components/auth/ChangePassword.jsx";
import ForgotPasswordEmail from "./components/auth/ForgotPasswordEmail.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";

const withSnackbar = (Component) => (
  <SnackbarProvider maxSnack={3}>
    <Component />
  </SnackbarProvider>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: withSnackbar(App),
    children: [
      {
        index: true,
        element: withSnackbar(LandingPage),
      },
      {
        path: "joblist",
        element: withSnackbar(JobList),
      },
      {
        path: "change-password",
        element: withSnackbar(ChangePassword),
      },
      {
        path: "forgot-password",
        element: withSnackbar(ForgotPasswordEmail),
      },
      {
        path: "reset-password",
        element: withSnackbar(ResetPassword),
      },
    ],
  },
  {
    path: "*",
    element: <></>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

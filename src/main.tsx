import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./features/authentication/pages/Login/Login";
import Register from "./features/authentication/pages/Register/Register";
import ResetPassword from "./features/authentication/pages/ResetPassword/ResetPassword";

import AuthenticationContextProvider from "./features/authentication/contexts/AuthenticationContextProvider";
import AuthenticationLayout from "./components/AuthenticationLayout/AuthenticationLayout";
import ApplicationLayout from "./components/ApplicationLayout/ApplicationLayout";
import Feed from "./features/feed/pages/Feed/Feed";
import Profile from "./features/authentication/pages/Profile/Profile";
import VerifyEmail from "./features/authentication/pages/VerifyEmail/VerifyEmail";

const router = createBrowserRouter([
  {
    element: <AuthenticationContextProvider />,
    children: [
      {
        path: "/",
        element: <ApplicationLayout />,
        children: [
          {
            index: true,
            element: <Feed />,
          },
          {
            element: "network",
            path: "network"
          },
          {
            element: "message",
            path: "messaging"
          },
          {
            element: "notification",
            path: "notifications"
          },
        ],
      },
      {
        element: <AuthenticationLayout />,
        path: "/authentication",
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "request-password-reset",
            element: <ResetPassword />,
          },
          {
            path: "verify-email",
            element: <VerifyEmail />,
          },
          {
            path: "profile/:id",
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

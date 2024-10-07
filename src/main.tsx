import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ToastContainer } from "react-toastify";

import App from "./App.tsx";

import AuthProvider from "./contexts/AuthContext.tsx";

import "react-lazy-load-image-component/src/effects/blur.css";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ToastContainer autoClose={3000} />
      <App />
    </AuthProvider>
  </StrictMode>
);

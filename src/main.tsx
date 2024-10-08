import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Toaster } from "react-hot-toast";

import App from "./App.tsx";

import AuthProvider from "./contexts/AuthContext.tsx";

import "react-lazy-load-image-component/src/effects/blur.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Toaster toastOptions={{ duration: 3000 }} />
      <App />
    </AuthProvider>
  </StrictMode>
);

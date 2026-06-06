import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { ThemeProvider } from "./app/contexts/ThemeContext";
import { SidebarProvider } from "./app/contexts/SidebarContext";
import { AuthProvider } from "./app/contexts/AuthContext";
import { PrivacyMaskProvider } from "./app/contexts/PrivacyMaskContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <SidebarProvider>
      <AuthProvider>
        <PrivacyMaskProvider>
          <App />
        </PrivacyMaskProvider>
      </AuthProvider>
    </SidebarProvider>
  </ThemeProvider>
);


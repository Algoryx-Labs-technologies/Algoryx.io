import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { ThemeProvider } from "./app/contexts/ThemeContext";
import { SidebarProvider } from "./app/contexts/SidebarContext";
import { AuthProvider } from "./app/contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AuthProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </AuthProvider>
  </ThemeProvider>
);


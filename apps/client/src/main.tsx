import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { ThemeProvider } from "./app/contexts/ThemeContext";
import { SidebarProvider } from "./app/contexts/SidebarContext";
import { ShineEffectProvider } from "./app/contexts/ShineEffectContext";
import { AuthProvider } from "./app/contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <SidebarProvider>
      <ShineEffectProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ShineEffectProvider>
    </SidebarProvider>
  </ThemeProvider>
);


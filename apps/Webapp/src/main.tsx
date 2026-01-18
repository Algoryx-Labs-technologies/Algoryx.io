import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { ThemeProvider } from "./app/contexts/ThemeContext";
import { SidebarProvider } from "./app/contexts/SidebarContext";
import { ShineEffectProvider } from "./app/contexts/ShineEffectContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <SidebarProvider>
      <ShineEffectProvider>
        <App />
      </ShineEffectProvider>
    </SidebarProvider>
  </ThemeProvider>
);


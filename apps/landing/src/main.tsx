  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { ThemeProvider } from "./app/contexts/ThemeContext";
  import { RootErrorBoundary } from "./app/components/RootErrorBoundary";

  createRoot(document.getElementById("root")!).render(
    <RootErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </RootErrorBoundary>
  );
  
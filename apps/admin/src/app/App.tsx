import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './auth/AuthPage';
import { DashboardPage } from './dashboard/DashboardPage';
import { CoursesPage } from './courses/CoursesPage';
import { ClientPage } from './client/ClientPage';

function App() {
  // TODO: Add authentication check - for now, defaulting to dashboard
  // In production, check if user is authenticated and redirect accordingly
  const isAuthenticated = true; // This should come from your auth provider (Clerk)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/client" element={<ClientPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


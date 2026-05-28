import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './auth/AuthPage';
import { DashboardPage } from './dashboard/DashboardPage';
import { PlaceholderPage } from './components/PlaceholderPage';
import { RequirementsPage } from './requirements/RequirementsPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Navigate to="/login" replace />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales-pipeline"
          element={
            <ProtectedRoute>
              <PlaceholderPage
                title="Sales Pipeline"
                description="Track leads, deals, and pipeline stages."
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/current-projects"
          element={
            <ProtectedRoute>
              <PlaceholderPage
                title="Current Projects"
                description="Active projects, status, and delivery overview."
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings"
          element={
            <ProtectedRoute>
              <PlaceholderPage
                title="Meetings"
                description="Scheduled calls, client meetings, and follow-ups."
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requirements"
          element={
            <ProtectedRoute>
              <RequirementsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <PlaceholderPage title="Feedback" description="User feedback and reviews." />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support-tickets"
          element={
            <ProtectedRoute>
              <PlaceholderPage title="Support Tickets" description="Customer support ticket queue." />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <PlaceholderPage title="Notifications" description="Publish and manage notifications." />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PlaceholderPage title="Payments" description="Payment records and billing." />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

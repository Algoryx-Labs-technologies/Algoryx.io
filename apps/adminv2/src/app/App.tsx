import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './auth/AuthPage';
import { DashboardPage } from './dashboard/DashboardPage';
import { PlaceholderPage } from './components/PlaceholderPage';
import { RequirementsPage } from './requirements/RequirementsPage';
import { SalesPipelinePage } from './sales-pipeline/SalesPipelinePage';
import { CurrentProjectsPage } from './current-projects/CurrentProjectsPage';
import { SupportTicketsPage } from './support-tickets/SupportTicketsPage';
import { TeamsPage } from './teams/TeamsPage';
import { NotesPage } from './notes/NotesPage';
import { PaymentsPage } from './payments/PaymentsPage';
import { RevenueExpensePage } from './revenue-expense/RevenueExpensePage';
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
              <SalesPipelinePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/current-projects"
          element={
            <ProtectedRoute>
              <CurrentProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <TeamsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NotesPage />
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
              <SupportTicketsPage />
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
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/revenue-expense"
          element={
            <ProtectedRoute>
              <RevenueExpensePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

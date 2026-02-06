import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './auth/AuthPage';
import { DashboardPage } from './dashboard/DashboardPage';
import { ProjectsListPage } from './projects/ProjectsListPage';
import { ProjectDetailPage } from './projects/ProjectDetailPage';
import { MessageConversationPage } from './messages/MessageConversationPage';
import { MessagesListPage } from './messages/MessagesListPage';
import { RequirementsListPage } from './requirements/RequirementsListPage';
import { CommunityPage } from './community/CommunityPage';
import { PaymentsPage } from './payments/PaymentsPage';
import { FeedbackPage } from './feedback/FeedbackPage';
import { MeetingsPage } from './meetings/MeetingsPage';
import { useAuth } from './contexts/AuthContext';
import { LoadingPage } from './components/Loading';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage message="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage message="Initializing..." />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/projects" 
          element={
            <ProtectedRoute>
              <ProjectsListPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/projects/:id" 
          element={
            <ProtectedRoute>
              <ProjectDetailPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <MessagesListPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messages/new" 
          element={
            <ProtectedRoute>
              <MessageConversationPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messages/:id" 
          element={
            <ProtectedRoute>
              <MessageConversationPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/requirements" 
          element={
            <ProtectedRoute>
              <RequirementsListPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/community" 
          element={
            <ProtectedRoute>
              <CommunityPage />
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
          path="/feedback" 
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/meetings" 
          element={
            <ProtectedRoute>
              <MeetingsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/auth" 
          element={
            user ? <Navigate to="/dashboard" replace /> : <AuthPage />
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to="/auth" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


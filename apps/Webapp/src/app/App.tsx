import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './auth/AuthPage';
import { DashboardPage } from './dashboard/DashboardPage';
import { ProjectsListPage } from './projects/ProjectsListPage';
import { ProjectDetailPage } from './projects/ProjectDetailPage';
import { MessageConversationPage } from './messages/MessageConversationPage';
import { RequirementsListPage } from './requirements/RequirementsListPage';
import { CommunityPage } from './community/CommunityPage';

function App() {
  // TODO: Add authentication check - for now, defaulting to dashboard
  // In production, check if user is authenticated and redirect accordingly
  const isAuthenticated = true; // This should come from your auth provider (Clerk)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsListPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/messages" element={<MessageConversationPage />} />
        <Route path="/requirements" element={<RequirementsListPage />} />
        <Route path="/community" element={<CommunityPage />} />
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


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './auth/AuthPage';
import { DashboardPage } from './dashboard/DashboardPage';
import { CoursesPage } from './courses/CoursesPage';
import { ClientPage } from './client/ClientPage';
import { ProjectsPage } from './projects/ProjectsPage';
import { NotificationsPage } from './notifications/NotificationsPage';
import { PaymentsPage } from './payments/PaymentsPage';
import { SupportTicketsPage } from './support-tickets/SupportTicketsPage';
import { CommunityPage } from './community/CommunityPage';
import { FeedbackPage } from './feedback/FeedbackPage';
import { RequirementsPage } from './requirements/RequirementsPage';
import { QnAPage } from './qna/QnAPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/client" element={<ClientPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/support-tickets" element={<SupportTicketsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/requirements" element={<RequirementsPage />} />
        <Route path="/qna" element={<QnAPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Common
import NotFound from '../components/common/NotFound';

// Dashboards
import HRDashboard from '../pages/hr/HRDashboard';
import CoordinatorDashboard from '../pages/coordinator/CoordinatorDashboard';
import MentorDashboard from '../pages/mentor/MentorDashboard';
import InternDashboard from '../pages/intern/InternDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

// HR subpages
import InternProfiles from '../pages/hr/InternProfiles';
import Recruitment from '../pages/hr/Recruitment';
import Reports from '../pages/hr/Reports';
import HrLayout from '../layouts/HrLayout';

// Mentor subpages
import DailyProgress from '../pages/mentor/DailyProgress';
import Communication from '../pages/mentor/Communication';
import SkillAssessment from '../pages/mentor/SkillAssessment';
import MentorLayout from '../layouts/MentorLayout';

import InterviewSchedule from '../pages/coordinator/InterviewSchedule';
import PerformanceTracking from '../pages/coordinator/PerformanceTracking';
import TrainingPrograms from '../pages/coordinator/TrainingPrograms';
import CoordinatorLayout from '../layouts/CoordinatorLayout';

// Intern subpages
import SkillTracking from '../pages/intern/SkillTracking';
import Feedback from '../pages/intern/Feedback';
import Schedule from '../pages/intern/Schedule';
import Tasks from '../pages/intern/Tasks';
import InternLayout from '../layouts/InternLayout';

// Admin layout & subpages
import AdminLayout from '../layouts/AdminLayout';
import UserManagement from '../pages/admin/UserManagement';
import SystemConfig from '../pages/admin/SystemConfig';
import TechnicalSupport from '../pages/admin/TechnicalSupport';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import ProfilePage from '../pages/profile/ProfilePage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect "/" -> "/login" */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected common routes */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <NotificationsPage />
          </PrivateRoute>
        }
      />

      {/* HR routes */}
<Route
  path="/hr"
  element={
    <PrivateRoute allowedRoles={['HR']}>
      <HrLayout /> {/* Bọc layout HR */}
    </PrivateRoute>
  }
>
  <Route index element={<HRDashboard />} />
  <Route path="interns" element={<InternProfiles />} />
  <Route path="recruitment" element={<Recruitment />} />
  <Route path="reports" element={<Reports />} />
</Route>

      {/* Coordinator routes */}
      <Route
        path="/coordinator"
        element={
          <PrivateRoute allowedRoles={['COORDINATOR']}>
            <CoordinatorLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<CoordinatorDashboard />} />
        <Route path="interviews" element={<InterviewSchedule />} />
        <Route path="performance" element={<PerformanceTracking />} />
        <Route path="training" element={<TrainingPrograms />} />
      </Route>


      {/* Mentor routes */}
      <Route
        path="/mentor"
        element={
          <PrivateRoute allowedRoles={['MENTOR']}>
            <MentorLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<MentorDashboard />} />
        <Route path="progress" element={<DailyProgress />} />
        <Route path="communication" element={<Communication />} />
        <Route path="assessment" element={<SkillAssessment />} />
      </Route>

      {/* Intern routes */}
      <Route
        path="/intern"
        element={
          <PrivateRoute allowedRoles={['INTERN']}>
            <InternLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<InternDashboard />} />
        <Route path="skills" element={<SkillTracking />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>

      {/* Admin routes with layout */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="config" element={<SystemConfig />} />
        <Route path="support" element={<TechnicalSupport />} />
      </Route>

      {/* Fallback routes */}
      <Route path="/not-authorized" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

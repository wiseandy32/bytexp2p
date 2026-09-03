import AdminDashboard from '@/components/AdminDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminDashboard>{children}</AdminDashboard>
    </ProtectedRoute>
  );
}

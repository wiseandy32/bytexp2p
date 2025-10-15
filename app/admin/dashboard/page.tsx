import ProtectedRoute from "@/components/ProtectedRoute";
import AdminOverview from "@/components/AdminOverview";

export default function AdminDashboard() {
    return (
        <ProtectedRoute>
            <AdminOverview />
        </ProtectedRoute>
    );
}
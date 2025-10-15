import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminDashboard() {
    return (
        <ProtectedRoute>
            <div>
                <h1>Admin Dashboard</h1>
            </div>
        </ProtectedRoute>
    );
}

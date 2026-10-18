import { useAuth } from "../hooks/useAuth";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600 mt-1">Welcome, {user.name}</p>
      <button
        onClick={logout}
        className="mt-6 px-4 py-2 rounded-lg bg-orange-500 text-white"
      >
        Log out
      </button>
    </div>
  );
}
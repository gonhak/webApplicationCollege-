import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';

export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

/**
 * ProtectedRoute — gates its children behind an authenticated Supabase session.
 * While the initial session lookup is in flight it renders a lightweight
 * placeholder; unauthenticated users are redirected to /login, preserving the
 * attempted location so they can be returned there after signing in.
 */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading…</div>;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

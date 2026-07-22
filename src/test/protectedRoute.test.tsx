import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const useAuthMock = vi.fn();
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => useAuthMock() }));

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function setup() {
  return render(
    <MemoryRouter initialEntries={["/secret"]}>
      <Routes>
        <Route
          path="/secret"
          element={
            <ProtectedRoute>
              <div>secret content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>login page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => useAuthMock.mockReset());

  it("renders children when authenticated", () => {
    useAuthMock.mockReturnValue({ session: { user: { id: "u1" } }, loading: false });
    setup();
    expect(screen.getByText("secret content")).toBeInTheDocument();
  });

  it("redirects to /login when unauthenticated", () => {
    useAuthMock.mockReturnValue({ session: null, loading: false });
    setup();
    expect(screen.getByText("login page")).toBeInTheDocument();
    expect(screen.queryByText("secret content")).not.toBeInTheDocument();
  });

  it("shows a loader while the session is resolving", () => {
    useAuthMock.mockReturnValue({ session: null, loading: true });
    setup();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    expect(screen.queryByText("login page")).not.toBeInTheDocument();
  });
});

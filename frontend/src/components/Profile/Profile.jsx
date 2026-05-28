// src/components/Profile/Profile.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";

export default function Profile() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const role = (currentUser.role || "").toLowerCase();
  const canGoDashboard = role === "admin" || role === "user";

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3">Profile</h2>

      <div className="card shadow-sm border-0" style={{ maxWidth: 720 }}>
        <div className="card-body">
          <div className="d-flex align-items-center gap-3">
            <img
              src={currentUser.image || "/images/avatar.jpg"}
              alt="avatar"
              width="64"
              height="64"
              style={{ borderRadius: "50%", objectFit: "cover" }}
              onError={(e) => (e.currentTarget.src = "/images/avatar.jpg")}
            />
            <div>
              <div className="fw-bold fs-5">{currentUser.username}</div>
              <div className="text-muted">Role: {currentUser.role || "-"}</div>
            </div>
          </div>

          <hr />

          <div className="row g-3">
            <div className="col-md-6">
              <div className="text-muted small">Email</div>
              <div className="fw-semibold">{currentUser.email || "-"}</div>
            </div>
            <div className="col-md-6">
              <div className="text-muted small">Status</div>
              <div className="fw-semibold">
                {currentUser.locked ? "Locked" : "Active"}
              </div>
            </div>
          </div>

          <div className="mt-4 d-flex gap-2 flex-wrap">
            <Link to="/" className="btn btn-outline-secondary">
              Back Home
            </Link>

            {canGoDashboard && (
              <Link to="/dashboard" className="btn btn-primary text-white">
                Go Dashboard
              </Link>
            )}

            <Link to="/orders" className="btn btn-outline-primary">
              My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

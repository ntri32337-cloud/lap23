// src/components/Auth/AuthMenu.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function AuthMenu() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth(); // AuthProvider của bạn có đủ các field này 

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // style giống hình: chữ trắng, có dấu | ngăn cách
  const linkCls = "text-white small";
  const sep = <span className="text-white small mx-2">|</span>;

  return (
    <div className="d-flex align-items-center">
      {/* notifications */}
      <a
        href="#"
        className={linkCls}
        onClick={(e) => e.preventDefault()}
      >
        notifications
      </a>

      {sep}

      {/* chưa login */}
      {!isAuthenticated ? (
        <>
          <Link to="/signup" className={linkCls}>
            Sign Up
          </Link>
          {sep}
          <Link to="/signin" className={linkCls}>
            Sign In
          </Link>
        </>
      ) : (
        // đã login => dropdown username
        <div className="dropdown ms-1">
          <button
            className="btn btn-sm btn-light d-flex align-items-center gap-2 rounded-pill px-2"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person-circle" />
            <span>{currentUser?.username}</span>
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
            <li>
              <Link className="dropdown-item py-2" to="/profile">
                <i className="bi bi-person me-2" />
                Profile
              </Link>
            </li>

            <li>
              <Link className="dropdown-item py-2" to="/orders">
                <i className="bi bi-bag me-2" />
                My Orders
              </Link>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            <li>
              <button
                className="dropdown-item py-2 text-danger"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
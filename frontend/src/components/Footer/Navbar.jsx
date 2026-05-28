// src/components/Footer/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";

export default function Navbar({ totalQty = 0 }) {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="container-fluid sticky-top bg-white shadow-sm">
      <div className="container px-0">
        <nav className="navbar navbar-light navbar-expand-xl">

          {/* Logo */}
          <NavLink to="/" className="navbar-brand">
            <h1 className="text-danger fw-bold m-0">
              Bia & Đồ Uống NVA
            </h1>
          </NavLink>

          {/* Mobile toggle */}
          <button
            className="navbar-toggler py-2 px-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="fa fa-bars text-danger"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarCollapse">

            {/* Menu */}
            <div className="navbar-nav mx-auto">

              <NavLink
                to="/"
                className={({ isActive }) =>
                  "nav-item nav-link fw-semibold " +
                  (isActive ? "text-danger" : "")
                }
              >
                Trang chủ
              </NavLink>

              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  "nav-item nav-link fw-semibold " +
                  (isActive ? "text-danger" : "")
                }
              >
                Cửa hàng
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  "nav-item nav-link fw-semibold " +
                  (isActive ? "text-danger" : "")
                }
              >
                Liên hệ
              </NavLink>

              {/* Dropdown */}
              <div className="nav-item dropdown">

                <span
                  className="nav-link dropdown-toggle fw-semibold"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Pages
                </span>

                <div className="dropdown-menu m-0 bg-light rounded-2 shadow">

                  <Link to="/cart" className="dropdown-item">
                    Cart
                  </Link>

                  <Link to="/checkout" className="dropdown-item">
                    Checkout
                  </Link>

                </div>

              </div>

            </div>

            {/* Right Icons */}
            <div className="d-flex align-items-center">

              {/* Search */}
              <button
                type="button"
                className="btn border border-danger rounded-circle me-4"
              >
                <i className="fas fa-search text-danger"></i>
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="position-relative me-4"
              >
                <i className="fa fa-shopping-bag fa-2x text-success"></i>

                {Number(totalQty) > 0 && (
                  <span
                    className="position-absolute bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      top: "-5px",
                      left: "18px",
                      height: 20,
                      minWidth: 20,
                      fontSize: 12
                    }}
                  >
                    {totalQty}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="dropdown">

                  <button
                    className="btn btn-link text-decoration-none p-0"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-user fa-2x text-danger"></i>
                    <span className="ms-2 fw-semibold">
                      {currentUser?.username}
                    </span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end">

                    {(currentUser?.role === "admin" ||
                      currentUser?.role === "user") && (
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/dashboard"
                        >
                          Dashboard
                        </Link>
                      </li>
                    )}

                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>

                  </ul>

                </div>
              ) : (
                <Link to="/signin">
                  <i className="fas fa-user fa-2x text-danger"></i>
                </Link>
              )}

            </div>

          </div>
        </nav>
      </div>
    </div>
  );
}
// src/components/Header/Header.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";
import { useOrders } from "../Auth/OrdersProvider";

export default function Header({ carts = [] }) {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { newOrders, markOrdersAsRead } = useOrders();

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const dropdownRef = useRef(null);

  const currentUserId = currentUser?._id ?? currentUser?.id ?? null;

  const totalQty = useMemo(() => {
    if (!isAuthenticated || !currentUserId) return 0;
    return (carts ?? [])
      .reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
  }, [carts, isAuthenticated, currentUserId]);

  const newCount = isAuthenticated ? Number(newOrders?.length || 0) : 0;

  const role = String(currentUser?.role ?? "").toLowerCase();
  const isAdminOrUser = role === "admin" || role === "user";

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setOpenUserMenu(false);
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setOpenUserMenu(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* TOPBAR */}
      <div className="container-fluid fixed-top">
        <div className="container-fluid topbar bg-primary d-none d-lg-block">
          <div className="d-flex justify-content-between align-items-center px-4"></div>
          <div className="d-flex justify-content-between">
            <div className="top-info ps-2">
              <small className="me-3">
                <a href="#" onClick={(e) => e.preventDefault()} className="text-white">
                  <i className="fas fa-map-marker-alt me-2 text-secondary"></i>
                  Hóc Môn
                </a>
              </small>
              <small className="me-3">
                <a href="#" onClick={(e) => e.preventDefault()} className="text-white">
                  <i className="fas fa-envelope me-2 text-secondary"></i>
                  Email@NguyenVanAn123gmail.com
                </a>
              </small>
            </div>

            <div className="top-link pe-2 d-flex align-items-center gap-2">
              <Link
                to={isAuthenticated ? "/notification" : "/signin"}
                className="text-white small position-relative"
                onClick={() => {
                  if (isAuthenticated) markOrdersAsRead();
                }}
              >
                notifications
                {newCount > 0 && (
                  <span className="badge bg-danger ms-1">{newCount}</span>
                )}
              </Link>

              <span className="text-white">|</span>

              {!isAuthenticated ? (
                <>
                  <Link to="/signup" className="text-white small">Sign Up</Link>
                  <span className="text-white">|</span>
                  <Link to="/signin" className="text-white small">Sign In</Link>
                </>
              ) : (
                <div className="position-relative" ref={dropdownRef}>
                  <button
                    type="button"
                    className="btn btn-sm text-white p-0 border-0 bg-transparent"
                    onClick={() => setOpenUserMenu((v) => !v)}
                  >
                    {currentUser?.username} <i className="bi bi-caret-down-fill ms-1"></i>
                  </button>

                  {openUserMenu && (
                    <div
                      className="dropdown-menu show position-absolute end-0 mt-2"
                      style={{ minWidth: 220 }}
                    >
                      <Link
                        className="dropdown-item"
                        to="/profile"
                        onClick={() => setOpenUserMenu(false)}
                      >
                        Profile
                      </Link>

                      <Link
                        className="dropdown-item"
                        to="/notification"
                        onClick={() => {
                          setOpenUserMenu(false);
                          markOrdersAsRead();
                        }}
                      >
                        My Orders
                        {newCount > 0 && (
                          <span className="badge bg-danger ms-2">{newCount}</span>
                        )}
                      </Link>

                      {isAdminOrUser && (
                        <Link
                          className="dropdown-item"
                          to="/dashboard"
                          onClick={() => setOpenUserMenu(false)}
                        >
                          Dashboard
                        </Link>
                      )}

                      <hr className="dropdown-divider" />

                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NAVBAR */}
        <div className="container-fluid bg-white shadow-sm">
  <div className="container">
    <nav className="navbar navbar-expand-xl main-navbar">
            <Link to="/" className="navbar-brand">
              <h2 style={{ color: "#e60023", fontWeight: "700" }}>
               NVA Beer & Drinks
              </h2>
            </Link>

            <button
              className="navbar-toggler py-2 px-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
            >
              <span className="fa fa-bars text-primary"></span>
            </button>

            <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
              <div className="navbar-nav mx-auto main-menu">
               <NavLink to="/" className="nav-item nav-link">
                  Home
               </NavLink>
               <NavLink to="/shop" className="nav-item nav-link">
                  Shop
              </NavLink>
              <NavLink to="/contact" className="nav-item nav-link">
                  Contact
              </NavLink>
              </div>
              <div className="d-flex m-3 me-0 align-items-center gap-3">
                <Link
                  to={isAuthenticated ? "/cart" : "/signin"}
                  className="position-relative me-4 my-auto"
                >
                  <i className="fa fa-shopping-bag fa-2x" style={{ color: "#e60023" }}></i>
                  {totalQty > 0 && (
                    <span
                      className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                      style={{ top: -5, left: 15, height: 20, minWidth: 20 }}
                    >
                      {totalQty}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </nav>
         </div>
        </div>
      </div>
    </>
  );
}
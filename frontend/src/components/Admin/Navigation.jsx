// src/components/Admin/Navigation.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../Auth/AuthProvider";

export default function Navigation() {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [openProducts, setOpenProducts] = useState(true);

  const itemClass = ({ isActive }) => `admin-item ${isActive ? "active" : ""}`;

  const handleLogout = () => {
    logout();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="admin-sidebar">
      <div
        className="admin-brand"
        role="button"
        onClick={() => navigate("/dashboard", { replace: true })}
        title="Go Dashboard"
      >
        Company name
      </div>

      <div className="admin-nav">
        <NavLink to="/dashboard" end className={itemClass}>
          Dashboard
        </NavLink>

        <button className="admin-item" onClick={() => navigate("/", { replace: true })}>
          Home
        </button>

        <button className="admin-item" onClick={() => setOpenProducts((v) => !v)}>
          All Products {openProducts ? "▾" : "▸"}
        </button>

        {openProducts && (
          <div className="admin-sub">
            <NavLink to="/dashboard/product" className={itemClass}>
              Product
            </NavLink>
          </div>
        )}

        {/* ✅ Lab19 Orders */}
        <NavLink to="/dashboard/orders" className={itemClass}>
          Orders
        </NavLink>

        <NavLink to="/dashboard/employees" className={itemClass}>
          Employees
        </NavLink>

        <NavLink to="/dashboard/customers" className={itemClass}>
          Customers
        </NavLink>
        <NavLink to="/dashboard/contacts" className={itemClass}>
           Contacts
        </NavLink>
        <NavLink to="/dashboard/user" className={itemClass}>
          Users
        </NavLink>

        <NavLink to="/dashboard/permissions" className={itemClass}>
          Users Role Permissions
        </NavLink>

        <button className="admin-item text-start text-white" onClick={handleLogout}>
          Logout {currentUser?.username ? `(${currentUser.username})` : ""}
        </button>
      </div>
    </div>
  );
}

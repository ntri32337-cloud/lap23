// src/components/Admin/Dashboard.jsx
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

export default function Dashboard() {
  return (
    <div className="d-flex">
      <Navigation />
      <div className="main-content flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
}

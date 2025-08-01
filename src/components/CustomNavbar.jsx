import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CustomNavbar({ toggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <nav className="custom-navbar navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-3">
      <div className="container-fluid">
        {user &&
          (user.role === "Administrator" || user.role === "Operatore") && (
            <button
              className="btn d-lg-none me-3"
              type="button"
              onClick={toggleSidebar}
            >
              <i className="bi bi-list fs-4 text-dark"></i>
            </button>
          )}
        <Link className="navbar-brand fw-bold" to="/">
          SERVICE DESK
        </Link>

        <div className="d-flex align-items-center ms-auto">
          {user ? (
            <div>
              <button className="btn btn-outline-primary" onClick={logout}>
                Esci
              </button>
            </div>
          ) : (
            <Link className="btn btn-outline-primary" to="/login">
              Accedi
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default CustomNavbar;

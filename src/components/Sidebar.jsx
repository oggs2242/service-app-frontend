import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar({ isOpen, toggleSidebar }) {
  const { user } = useAuth();
  const location = useLocation();

  const ADMIN = "Administrator";
  const OPERATOR = "Operatore";

  const navItems = [
    {
      path: "/backoffice",
      icon: "bi-grid-1x2",
      label: "Dashboard",
      roles: [OPERATOR, ADMIN],
    },
    {
      path: "/backoffice/tickets",
      icon: "bi-ticket-detailed",
      label: "Tutti i Tickets",
      roles: [OPERATOR],
    },
    {
      path: "/backoffice/operators",
      icon: "bi-people",
      label: "Gestione Operatori",
      roles: [ADMIN],
    },
    {
      path: "/backoffice/operators/new",
      icon: "bi-person-plus",
      label: "Nuovo Operatore",
      roles: [ADMIN],
    },
  ];

  const isActive = (path) => {
    if (path === "/backoffice") {
      return location.pathname === "/backoffice";
    }
    return location.pathname === path;
  };

  return (
    <>
      <div className="sidebar d-none d-lg-block sticky-top shadow-lg bg-light p-3">
        <ul className="nav flex-column">
          {navItems.map(
            (item) =>
              user &&
              item.roles.includes(user.role) && (
                <li className="nav-item" key={item.path}>
                  <Link
                    className={`nav-link d-flex align-items-center rounded-3 ${
                      isActive(item.path)
                        ? "active bg-primary text-white"
                        : "text-dark"
                    }`}
                    to={item.path}
                  >
                    <i className={`bi ${item.icon} me-3`}></i>
                    {item.label}
                  </Link>
                </li>
              )
          )}
        </ul>
      </div>

      <div
        className={`offcanvas offcanvas-start ${isOpen ? "show" : ""}`}
        tabIndex="-1"
        id="offcanvasSidebar"
        aria-labelledby="offcanvasSidebarLabel"
      >
        <div className="offcanvas-header text-dark">
          <h5 className="offcanvas-title fw-bold" id="offcanvasSidebarLabel">
            SERVICE DESK
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={toggleSidebar}
          ></button>
        </div>
        <div className="offcanvas-body bg-light py-1">
          <ul className="nav flex-column">
            {navItems.map(
              (item) =>
                user &&
                item.roles.includes(user.role) && (
                  <li className="nav-item" key={item.path}>
                    <Link
                      className={`nav-link d-flex align-items-center ${
                        isActive(item.path)
                          ? "active bg-primary text-white"
                          : "text-dark"
                      }`}
                      to={item.path}
                      onClick={toggleSidebar}
                    >
                      <i className={`bi ${item.icon} me-3`}></i>
                      {item.label}
                    </Link>
                  </li>
                )
            )}
          </ul>
        </div>
      </div>
      {isOpen && (
        <div
          className="offcanvas-backdrop fade show d-lg-none"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}

export default Sidebar;

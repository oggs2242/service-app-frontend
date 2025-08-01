import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import CustomerForm from "./pages/CustomerForm";
import BackofficeDashboard from "./pages/BackofficeDashboard";
import TicketDetail from "./pages/TicketDetail";
import CreateOperator from "./pages/CreateOperator";
import OperatorsDashboard from "./pages/OperatorsDashboard";
import EditOperator from "./pages/EditOperator";
import Login from "./pages/Login";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { useAuth } from "./context/AuthContext";

import CustomNavbar from "./components/CustomNavbar";
import Sidebar from "./components/Sidebar";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">In carica...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="alert alert-danger mt-5">Accesso non autorizzato</div>
    );
  }

  return children;
};

function App() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isBackofficeRoute = window.location.pathname.startsWith("/backoffice");

  const ADMIN = "Administrator";
  const OPERATOR = "Operatore";

  return (
    <>
      <CustomNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="d-flex" style={{ minHeight: "calc(100vh - 56px)" }}>
        {isBackofficeRoute &&
          user &&
          (user.role === ADMIN || user.role === OPERATOR) && (
            <Sidebar
              isOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          )}

        <main
          className={`content-wrapper flex-grow-1 p-3 ${
            isBackofficeRoute ? "ps-lg-3 " : ""
          }`}
        >
          <Routes>
            <Route path="/" element={<CustomerForm />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/backoffice"
              element={
                <PrivateRoute allowedRoles={[OPERATOR, ADMIN]}>
                  <BackofficeDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/backoffice/tickets"
              element={
                <PrivateRoute allowedRoles={[OPERATOR, ADMIN]}>
                  <BackofficeDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/backoffice/ticket/:id"
              element={
                <PrivateRoute allowedRoles={[OPERATOR, ADMIN]}>
                  <TicketDetail />
                </PrivateRoute>
              }
            />

            <Route
              path="/backoffice/operators/new"
              element={
                <PrivateRoute allowedRoles={[ADMIN]}>
                  <CreateOperator />
                </PrivateRoute>
              }
            />

            <Route
              path="/backoffice/operators"
              element={
                <PrivateRoute allowedRoles={[ADMIN]}>
                  <OperatorsDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/backoffice/operators/edit/:id"
              element={
                <PrivateRoute allowedRoles={[ADMIN]}>
                  <EditOperator />
                </PrivateRoute>
              }
            />

            <Route
              path="/backoffice/users/reset-password/:userId"
              element={
                <PrivateRoute allowedRoles={[ADMIN]}>
                  <ResetPasswordPage />
                </PrivateRoute>
              }
            />

            <Route
              path="*"
              element={
                <h1 className="text-center mt-5">404 - Pagina non trovata</h1>
              }
            />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;

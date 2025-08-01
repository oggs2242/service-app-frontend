import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function ResetPasswordPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "Administrator") {
      navigate("/backoffice");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (newPassword.length < 6) {
      setMessage("La password deve contenere almeno 6 caratteri.");
      setIsError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Le password non corrispondono.");
      setIsError(true);
      return;
    }

    try {
      await api.put(`/users/reset-password/${userId}`, {
        password: newPassword,
      });
      setMessage("Password aggiornata con successo.");
      setIsError(false);
      setTimeout(() => {
        navigate("/backoffice/operators");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg || "Errore durante il reset della password.";
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card p-4 shadow-lg rounded-4">
            <h2 className="mb-4 text-center text-primary fw-bold">
              Reset Password Utente
            </h2>
            {message && (
              <div
                className={`alert ${
                  isError ? "alert-danger" : "alert-success"
                } text-center`}
                role="alert"
              >
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label fw-bold">
                  Nuova Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Almeno 6 caratteri"
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
                <small className="form-text text-muted">
                    La password deve contenere almeno 6 caratteri.
                </small>
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-bold">
                  Conferma Nuova Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Reset Password
              </button>
              <button
                type="button"
                className="btn btn-secondary w-100 mt-2"
                onClick={() => navigate("/backoffice/operators")}
              >
                Annulla
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
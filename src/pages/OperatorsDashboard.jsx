import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const isOperatorCurrentlyAvailable = (operator) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinutes;

  const [startHour, startMinutes] = operator.availabilityHours.start
    .split(":")
    .map(Number);
  const [endHour, endMinutes] = operator.availabilityHours.end
    .split(":")
    .map(Number);

  const startTimeInMinutes = startHour * 60 + startMinutes;
  const endTimeInMinutes = endHour * 60 + endMinutes;

  return (
    currentTimeInMinutes >= startTimeInMinutes &&
    currentTimeInMinutes <= endTimeInMinutes
  );
};

function OperatorsDashboard() {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      navigate("/login");
      return;
    }
    if (user.role !== "Administrator") {
      navigate("/backoffice");
      return;
    }
    fetchOperators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchOperators = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/operators");
      setOperators(res.data);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "Errore durante il caricamento degli operatori."
      );
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Caricamento operatori...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  const getStatusInfo = (operator) => {
    const isAvailableByTime = isOperatorCurrentlyAvailable(operator);
    const isBusy = operator.activeTicketsCount > 0;

    const statusBadgeClass =
      isAvailableByTime && !isBusy
        ? "text-bg-success"
        : isAvailableByTime && isBusy
        ? "text-bg-warning"
        : "text-bg-danger";

    const statusText =
      isAvailableByTime && !isBusy
        ? "Libero"
        : isAvailableByTime && isBusy
        ? "Occupato"
        : "Chiuso";

    return { statusBadgeClass, statusText };
  };

  return (
    <div className="card p-4 mx-auto mb-5">
      <h2 className="mb-4 text-center text-primary fw-bold">
        Gestione Operatori
      </h2>

      {operators.length === 0 ? (
        <p className="text-center">Nessun operatore registrato.</p>
      ) : (
        <>
          <div className="d-lg-none">
            {operators.map((operator) => {
              const { statusBadgeClass, statusText } = getStatusInfo(operator);
              return (
                <div key={operator._id} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-primary fw-bold mb-3">
                      {operator.name} {operator.lastName}
                    </h5>
                    <p className="card-text mb-1">
                      <strong>Email:</strong> {operator.userEmail}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Tipi di Richiesta:</strong>
                      <br />
                      {operator.manageableRequestTypes.map((type, index) => (
                        <span
                          key={index}
                          className="badge text-bg-secondary me-1"
                        >
                          {type}
                        </span>
                      ))}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Disponibilità Oraria:</strong>{" "}
                      {operator.availabilityHours.start} -{" "}
                      {operator.availabilityHours.end}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Ticket Attivi:</strong>
                      <span
                        className={`badge rounded-pill ms-2 ${
                          operator.activeTicketsCount > 0
                            ? "text-bg-info"
                            : "text-bg-light text-dark"
                        }`}
                      >
                        {operator.activeTicketsCount}
                      </span>
                    </p>
                    <p className="card-text mb-3">
                      <strong>Stato Attuale:</strong>
                      <span
                        className={`badge rounded-pill ms-2 ${statusBadgeClass}`}
                      >
                        {statusText}
                      </span>
                    </p>
                    <div className="d-flex flex-column">
                      <Link
                        to={`/backoffice/operators/edit/${operator._id}`}
                        className="btn btn-sm me-lg-2 btn-info mb-2"
                      >
                        Modifica
                      </Link>
                      <Link
                        to={`/backoffice/users/reset-password/${operator.user._id}`}
                        className="btn btn-sm btn-warning"
                      >
                        Reset Password
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="table-responsive d-none d-lg-block">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Tipi di Richiesta</th>
                  <th>Disponibilidad Oraria</th>
                  <th>Ticket Attivi</th>
                  <th>Stato Attuale</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {operators.map((operator) => {
                  const { statusBadgeClass, statusText } =
                    getStatusInfo(operator);
                  return (
                    <tr key={operator._id}>
                      <td>
                        {operator.name} {operator.lastName}
                      </td>
                      <td>{operator.userEmail}</td>
                      <td>
                        {operator.manageableRequestTypes.map((type, index) => (
                          <span
                            key={index}
                            className="badge text-bg-secondary me-1"
                          >
                            {type}
                          </span>
                        ))}
                      </td>
                      <td>
                        {operator.availabilityHours.start} -{" "}
                        {operator.availabilityHours.end}
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            operator.activeTicketsCount > 0
                              ? "text-bg-info"
                              : "text-bg-light text-dark"
                          }`}
                        >
                          {operator.activeTicketsCount}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill ${statusBadgeClass}`}
                        >
                          {statusText}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/backoffice/operators/edit/${operator._id}`}
                          className="btn btn-sm btn-info me-2"
                        >
                          Modifica
                        </Link>
                        <Link
                          to={`/backoffice/users/reset-password/${operator.user._id}`}
                          className="btn btn-sm btn-warning"
                        >
                          Reset Password
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default OperatorsDashboard;

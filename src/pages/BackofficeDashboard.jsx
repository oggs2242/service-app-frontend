import React, { useState, useEffect, useMemo } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function BackofficeDashboard() {
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const statusOptions = {
    all: "Tutti",
    Aperto: "Aperti",
    "In Lavorazione": "In Lavorazione",
    Chiuso: "Chiusi",
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      navigate("/login");
      return;
    }

    if (user.role !== "Operatore" && user.role !== "Administrator") {
      navigate("/login");
      return;
    }
    fetchTickets();
  }, [user, navigate]);

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/tickets");
      setAllTickets(res.data);
    } catch (err) {
      setError(
        `Errore durante il caricamento dei ticket. Assicurati di aver effettuato l'accesso come operatore/amministratore. ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    let currentTickets = [...allTickets];

    if (filterStatus !== "all") {
      if (filterStatus === "Assegnato a me") {
        currentTickets = currentTickets.filter(
          (ticket) =>
            user.role === "Operatore" &&
            ticket.assignedTo &&
            ticket.assignedTo._id === user.operatorId
        );
      } else {
        currentTickets = currentTickets.filter(
          (ticket) => ticket.status === filterStatus
        );
      }
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentTickets = currentTickets.filter(
        (ticket) =>
          (ticket._id &&
            ticket._id.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (ticket.type &&
            ticket.type.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (ticket.userEmail &&
            ticket.userEmail.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (ticket.description &&
            ticket.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (ticket.status &&
            ticket.status.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (ticket.assignedTo &&
            (ticket.assignedTo.name
              .toLowerCase()
              .includes(lowerCaseSearchTerm) ||
              ticket.assignedTo.lastName
                .toLowerCase()
                .includes(lowerCaseSearchTerm)))
      );
    }

    return currentTickets;
  }, [allTickets, filterStatus, searchTerm, user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Aperto":
        return "text-bg-info";
      case "In Lavorazione":
        return "text-bg-warning";
      case "Chiuso":
        return "text-bg-success";
      default:
        return "text-bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">Caricamento ticket in corso...</div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  return (
    <div className="card p-4 mx-auto mb-5">
      <h2 className="mb-4 text-center text-primary fw-bold">Gestione Ticket</h2>

      <div className="row mb-4 align-items-center">
        <div className="col-md-4 mb-3 mb-md-0">
          <label htmlFor="filterStatus" className="form-label visually-hidden">
            Filtra per Stato
          </label>
          <select
            id="filterStatus"
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {Object.entries(statusOptions).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-8">
          <label htmlFor="searchTerm" className="form-label visually-hidden">
            Cerca Ticket
          </label>
          <input
            type="text"
            className="form-control"
            id="searchTerm"
            placeholder="Cerca per email, descrizione, tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <p className="text-center">
          Nessun ticket corrisponde ai filtri applicati.
        </p>
      ) : (
        <>
          <div className="d-lg-none">
            {filteredTickets.map((ticket) => (
              <div key={ticket._id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary fw-bold mb-3">
                    Ticket #{ticket._id.substring(0, 8)}...
                  </h5>
                  <p className="card-text mb-1">
                    <strong>Tipo:</strong> {ticket.type}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Email Cliente:</strong> {ticket.userEmail}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Stato:</strong>{" "}
                    <span
                      className={`badge rounded-pill ${getStatusBadge(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </p>
                  <p className="card-text mb-1">
                    <strong>Assegnato A:</strong>{" "}
                    {ticket.assignedTo
                      ? `${ticket.assignedTo.name} ${ticket.assignedTo.lastName}`
                      : "Non Assegnato"}
                  </p>
                  <p className="card-text mb-3">
                    <strong>Descrizione:</strong> {ticket.description}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Creato il:{" "}
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </small>
                    <Link
                      to={`/backoffice/ticket/${ticket._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Visualizza
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="table-responsive d-none d-lg-block">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID Ticket</th>
                  <th>Tipo</th>
                  <th>Email Cliente</th>
                  <th>Descrizione</th>
                  <th>Stato</th>
                  <th>Assegnato A</th>
                  <th>Data Creazione</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>{ticket._id.substring(0, 8)}...</td>
                    <td>{ticket.type}</td>
                    <td>{ticket.userEmail}</td>
                    <td>
                      {ticket.description.substring(0, 50)}
                      {ticket.description.length > 50 ? "..." : ""}
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill ${getStatusBadge(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td>
                      {ticket.assignedTo
                        ? `${ticket.assignedTo.name} ${ticket.assignedTo.lastName}`
                        : "Non Assegnato"}
                    </td>
                    <td>
                      {" "}
                      {new Date(ticket.createdAt).toISOString().split("T")[0]}
                    </td>
                    <td>
                      <Link
                        to={`/backoffice/ticket/${ticket._id}`}
                        className="btn btn-sm btn-primary"
                      >
                        Visualizza
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default BackofficeDashboard;

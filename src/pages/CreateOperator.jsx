import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function CreateOperator() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [manageableRequestTypes, setManageableRequestTypes] = useState([]);
  const [availabilityStart, setAvailabilityStart] = useState("");
  const [availabilityEnd, setAvailabilityEnd] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user && user.role !== "Administrator") {
    navigate("/backoffice");
  }

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setManageableRequestTypes([...manageableRequestTypes, value]);
    } else {
      setManageableRequestTypes(
        manageableRequestTypes.filter((type) => type !== value)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    try {
      await api.post("/operators", {
        name,
        lastName,
        manageableRequestTypes,
        availabilityHours: {
          start: availabilityStart,
          end: availabilityEnd,
        },
        email,
        password,
      });
      setMessage("Operatore e account utente creati con successo.");
      setName("");
      setLastName("");
      setManageableRequestTypes([]);
      setAvailabilityStart("");
      setAvailabilityEnd("");
      setEmail("");
      setPassword("");
    } catch (err) {
      const errorMessage =
        err.response &&
        err.response.data &&
        (err.response.data.msg ||
          (err.response.data.errors && err.response.data.errors[0].msg))
          ? err.response.data.msg || err.response.data.errors[0].msg
          : "Errore durante la creazione dell'operatore.";
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <div className="card p-4 shadow-lg rounded-4 mx-auto mt-5 mb-5" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4">Crea un Nuovo Operatore</h2>
      {message && (
        <div
          className={`alert ${isError ? "alert-danger" : "alert-success"}`}
          role="alert"
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nome
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Cognome
          </label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label d-block">
            Tipi di Richiesta Gestibili:
          </label>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="installazione"
              value="Installazione"
              checked={manageableRequestTypes.includes("Installazione")}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="installazione">
              Installazione
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="configurazione"
              value="Configurazione"
              checked={manageableRequestTypes.includes("Configurazione")}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="configurazione">
              Configurazione
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="aggiornamento"
              value="Aggiornamento"
              checked={manageableRequestTypes.includes("Aggiornamento")}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="aggiornamento">
              Aggiornamento
            </label>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="availabilityStart" className="form-label">
            Disponibilità (Inizio)
          </label>
          <input
            type="time"
            className="form-control"
            id="availabilityStart"
            value={availabilityStart}
            onChange={(e) => setAvailabilityStart(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="availabilityEnd" className="form-label">
            Disponibilità (Fine)
          </label>
          <input
            type="time"
            className="form-control"
            id="availabilityEnd"
            value={availabilityEnd}
            onChange={(e) => setAvailabilityEnd(e.target.value)}
            required
          />
        </div>
        <hr className="my-4" />
        <h5>Credenziali per l'Operatore (Accesso al Backoffice)</h5>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Crea Operatore
        </button>
      </form>
    </div>
  );
}

export default CreateOperator;

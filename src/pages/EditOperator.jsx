import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function EditOperator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    manageableRequestTypes: [],
    availabilityHours: { start: "", end: "" },
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const requestTypeOptions = [
    "Installazione",
    "Configurazione",
    "Aggiornamento",
  ];

  useEffect(() => {
    if (!user || user.role !== "Administrator") {
      navigate("/backoffice");
      return;
    }

    const fetchOperatorData = async () => {
      try {
        const res = await api.get(`/operators`);
        const operatorToEdit = res.data.find((op) => op._id === id);

        if (operatorToEdit) {
          setFormData({
            name: operatorToEdit.name,
            lastName: operatorToEdit.lastName,
            manageableRequestTypes: operatorToEdit.manageableRequestTypes,
            availabilityHours: operatorToEdit.availabilityHours,
            email: operatorToEdit.userEmail || "Email non disponibile",
          });
        } else {
          setError("Operatore non trovato.");
        }
      } catch (err) {
        setError(`Errore durante il caricamento dei dati dell'operatore: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOperatorData();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("availabilityHours.")) {
      const hourField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        availabilityHours: {
          ...prev.availabilityHours,
          [hourField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRequestTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      manageableRequestTypes: checked
        ? [...prev.manageableRequestTypes, value]
        : prev.manageableRequestTypes.filter((type) => type !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.put(`/operators/${id}`, formData);
      setMessage("Operatore aggiornato con successo.");
      navigate("/backoffice/operators");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "Errore durante l'aggiornamento dell'operatore."
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">Caricamento dati operatore...</div>
    );
  }

  if (error && !message) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  return (
    <div className="card p-4 shadow-lg rounded-4 mx-auto mt-5 mb-5" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4 text-center text-primary fw-bold">
        Modifica Operatore
      </h2>
      {message && (
        <div className="alert alert-success text-center">{message}</div>
      )}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold">Email dell'Utente:</label>
          <input
            type="text"
            className="form-control"
            value={formData.email}
            disabled
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-bold">
            Nome
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label fw-bold">
            Cognome
          </label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">
            Tipi di Richiesta Gestibili
          </label>
          {requestTypeOptions.map((type) => (
            <div className="form-check" key={type}>
              <input
                className="form-check-input"
                type="checkbox"
                value={type}
                id={`type-${type}`}
                checked={formData.manageableRequestTypes.includes(type)}
                onChange={handleRequestTypeChange}
              />
              <label className="form-check-label" htmlFor={`type-${type}`}>
                {type}
              </label>
            </div>
          ))}
        </div>

        <div className="row mb-4">
          <div className="col-12 col-md-6">
            <label htmlFor="startHour" className="form-label fw-bold">
              Ora di Inizio (HH:MM)
            </label>
            <input
              type="time"
              className="form-control"
              id="startHour"
              name="availabilityHours.start"
              value={formData.availabilityHours.start}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <label
              htmlFor="endHour"
              className="form-label fw-bold mt-3 mt-md-0"
            >
              Ora di Fine (HH:MM)
            </label>
            <input
              type="time"
              className="form-control"
              id="endHour"
              name="availabilityHours.end"
              value={formData.availabilityHours.end}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 shadow">
          Aggiorna Operatore
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
  );
}

export default EditOperator;

import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState('');
  const [response, setResponse] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTicket();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const fetchTicket = async () => {
    setLoading(true);
    setMessage('');
    setIsError(false);
    try {
      const res = await api.get(`/tickets/${id}`);
      setTicket(res.data);
      setStatus(res.data.status);
      setResponse(res.data.response || '');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Errore durante il caricamento del ticket.');
      setIsError(true);
      if (err.response && (err.response.status === 403 || err.response.status === 404)) {
        navigate('/backoffice');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      const res = await api.put(`/tickets/${id}`, {
        status,
        response,
      });
      setTicket(res.data);
      setMessage('Ticket aggiornato con successo.');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Errore durante l\'aggiornamento del ticket.');
      setIsError(true);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Caricamento ticket...</div>;
  }

  if (!ticket) {
    return <div className="text-center mt-5">Ticket non trovato o accesso negato.</div>;
  }

  return (
    <div className="card p-4 shadow-lg rounded-4 mx-auto mt-5 mb-5" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4">Dettaglio del Ticket - ID: {ticket._id}</h2>
      {message && (
        <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
          {message}
        </div>
      )}
      <div className="mb-3">
        <strong>Tipo di richiesta:</strong> {ticket.type}
      </div>
      <div className="mb-3">
        <strong>Email dell'utente:</strong> {ticket.userEmail}
      </div>
      <div className="mb-3">
        <strong>Data di richiesta:</strong> {new Date(ticket.createdAt).toLocaleString()}
      </div>
      <div className="mb-3">
        <strong>Assegnato a:</strong> {ticket.assignedTo ? `${ticket.assignedTo.name} ${ticket.assignedTo.lastName}` : 'N/A'}
      </div>
      <div className="mb-3">
        <strong>Descrizione:</strong>
        <p className="border p-2 rounded">{ticket.description}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Stato</label>
          <select
            className="form-select"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Aperto">Aperto</option>
            <option value="In Lavorazione">In Lavorazione</option>
            <option value="Chiuso">Chiuso</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="response" className="form-label">Risposta dell'Operatore</label>
          <textarea
            className="form-control"
            id="response"
            rows="5"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary me-2">Aggiorna Ticket</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/backoffice')}>Indietro</button>
      </form>
    </div>
  );
}

export default TicketDetail;
import React, { useState } from 'react';
import api from '../api/axios';

function CustomerForm() {
  const [requestType, setRequestType] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      await api.post('/tickets', {
        type: requestType,
        userEmail,
        description,
      });
      setMessage('Ticket creato con successo e assegnato a un operatore.');
      setRequestType('');
      setUserEmail('');
      setDescription('');
    } catch (err) {
      setMessage(err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Errore durante la creazione del ticket. Riprova.');
      setIsError(true);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card p-4 shadow-lg rounded-4">
            <h2 className="mb-4 text-center text-primary fw-bold">Apri un Nuovo Ticket di Supporto</h2>
            {message && (
              <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} text-center`} role="alert">
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="requestType" className="form-label fw-bold">Tipo di richiesta</label>
                <select
                  className="form-select shadow-sm"
                  id="requestType"
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  required
                >
                  <option value="">Seleziona un tipo</option>
                  <option value="Installazione">Installazione</option>
                  <option value="Configurazione">Configurazione</option>
                  <option value="Aggiornamento">Aggiornamento</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="userEmail" className="form-label fw-bold">Email dell'utente</label>
                <input
                  type="email"
                  className="form-control shadow-sm"
                  id="userEmail"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="form-label fw-bold">Descrizione della richiesta</label>
                <textarea
                  className="form-control shadow-sm"
                  id="description"
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100 shadow">Invia Richiesta</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerForm;
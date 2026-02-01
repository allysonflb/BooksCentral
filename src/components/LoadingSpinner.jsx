import React from 'react';

// Componente simples de spinner de carregamento
function LoadingSpinner() {
  return (
    <div className="loading-spinner-container" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true"></div>
      <p>Carregando...</p>
    </div>
  );
}

export default LoadingSpinner;

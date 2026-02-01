import React from 'react';

// Componente simples de spinner de carregamento
function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p>Carregando...</p>
    </div>
  );
}

export default LoadingSpinner;

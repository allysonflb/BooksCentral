import React from 'react';

// Componente para exibir mensagens de erro
function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="error-message" role="alert">
      <p>Erro: {message}</p>
    </div>
  );
}

export default ErrorMessage;

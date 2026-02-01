import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders the loading message and spinner element', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Esperando um elemento com role 'status' ou similar para o spinner
    // Ou se for um div com classe específica:
    expect(screen.getByRole('progressbar')).toBeInTheDocument(); // Se for um elemento semântico
    // Se for apenas um div com classe, podemos verificar a classe:
    const spinnerElement = screen.getByText(/Carregando.../i).previousElementSibling;
    expect(spinnerElement).toHaveClass('loading-spinner');
  });
});

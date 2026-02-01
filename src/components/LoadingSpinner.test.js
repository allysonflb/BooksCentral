import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders the loading message and spinner element', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Verifica que o spinner tem o atributo aria-hidden
    const spinnerElement = screen.getByRole('status').querySelector('.loading-spinner');
    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement).toHaveAttribute('aria-hidden', 'true');
  });
});

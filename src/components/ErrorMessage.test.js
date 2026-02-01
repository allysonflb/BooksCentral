import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component', () => {
  it('renders the error message when provided', () => {
    const errorMessage = 'Failed to fetch data';
    render(<ErrorMessage message={errorMessage} />);

    expect(screen.getByText(/Erro: Failed to fetch data/i)).toBeInTheDocument();
  });

  it('renders nothing when message is null or undefined', () => {
    render(<ErrorMessage message={null} />);
    expect(screen.queryByText(/Erro:/i)).not.toBeInTheDocument();

    render(<ErrorMessage message={undefined} />);
    expect(screen.queryByText(/Erro:/i)).not.toBeInTheDocument();
  });

  it('renders nothing when message is an empty string', () => {
    render(<ErrorMessage message="" />);
    expect(screen.queryByText(/Erro:/i)).not.toBeInTheDocument();
  });
});

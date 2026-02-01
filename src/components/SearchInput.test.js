import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SearchInput from './SearchInput';

// Mocka o store Zustand para controlar suas ações
jest.mock('../store/bookStore', () => ({
  useBookStore: jest.fn(),
}));

const { useBookStore } = require('../store/bookStore');

describe('SearchInput Component', () => {
  const mockFetchBooks = jest.fn();

  beforeEach(() => {
    // Limpa mocks antes de cada teste
    mockFetchBooks.mockClear();
    
    // Configura o mock do useBookStore para retornar fetchBooks quando chamado como seletor
    useBookStore.mockImplementation((selector) => {
      if (selector) {
        return selector({ fetchBooks: mockFetchBooks });
      }
      return { fetchBooks: mockFetchBooks };
    });
  });

  it('renders an input field with a placeholder', () => {
    render(<SearchInput placeholder="Search books..." />);
    const inputElement = screen.getByPlaceholderText(/Search books.../i);
    expect(inputElement).toBeInTheDocument();
  });

  it('calls fetchBooks with debounced value after user stops typing', async () => {
    render(<SearchInput />);

    const inputElement = screen.getByLabelText(/Book search input/i);
    const testQuery = "The Lord of the Rings";

    // Simula o usuário digitando
    await userEvent.type(inputElement, testQuery);

    // Espera que fetchBooks seja chamado após o debounce (500ms + margem)
    await waitFor(() => {
      expect(mockFetchBooks).toHaveBeenCalled();
    }, { timeout: 1000 });
    
    // Verifica que foi chamado com o valor final
    expect(mockFetchBooks).toHaveBeenCalledWith(testQuery);
  });

  it('updates local state when user types', async () => {
    render(<SearchInput placeholder="Search books..." />);
    const inputElement = screen.getByPlaceholderText(/Search books.../i);
    
    await userEvent.type(inputElement, "test");
    
    expect(inputElement.value).toBe("test");
  });
});

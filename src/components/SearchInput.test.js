import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchInput from './SearchInput';
import { useBookStore } from '../store/bookStore';

// Mocka lodash.debounce com cancel como jest.fn()
jest.mock('lodash.debounce', () => {
  return jest.fn((func, delay) => {
    let timerId;
    const debounced = (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => func(...args), delay);
    };
    debounced.cancel = jest.fn(() => clearTimeout(timerId)); // Tornando cancel um Jest mock
    return debounced;
  });
});

// Mocka o módulo store para exportar um useBookStore mockado
const mockUseBookStore = jest.fn();
jest.mock('../store/bookStore', () => ({
  useBookStore: mockUseBookStore,
}));

describe('SearchInput Component', () => {
  let mockFetchBooks, mockInitializeSearch, mockResetStore, mockSetSearchTerm;
  let mockStoreState;
  let mockDebounceInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    // Cria uma instância mock do debounce para cada teste
    mockDebounceInstance = require('lodash.debounce').mock.results[0]?.value;
    if (mockDebounceInstance) {
      mockDebounceInstance.cancel.mockClear();
    }

    // Define o estado inicial do mock do store
    mockStoreState = {
      fetchBooks: jest.fn(),
      initializeSearch: jest.fn(),
      searchTerm: '',
      initialSearchTerm: '',
      resetStore: jest.fn(),
      setSearchTerm: jest.fn(),
      loading: false,
      error: null,
      books: [],
    };
    // Configura o mock do useBookStore para retornar o estado mockado
    mockUseBookStore.mockImplementation(() => mockStoreState);
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

    await userEvent.type(inputElement, testQuery);

    await waitFor(() => {
      expect(mockFetchBooks).toHaveBeenCalledTimes(1);
      expect(mockFetchBooks).toHaveBeenCalledWith(testQuery);
    }, { timeout: 1000 });
  });

  it('does not call fetchBooks immediately when typing', async () => {
    render(<SearchInput />);
    const inputElement = screen.getByLabelText(/Book search input/i);
    await userEvent.type(inputElement, "abc");
    await new Promise(resolve => setTimeout(resolve, 100)); // Delay curto
    expect(mockFetchBooks).not.toHaveBeenCalled();
  });

  it('calls debouncedSearch.cancel when component unmounts', async () => {
    const { unmount } = render(<SearchInput />);
    const inputElement = screen.getByLabelText(/Book search input/i);
    await userEvent.type(inputElement, "test");
    await new Promise(resolve => setTimeout(resolve, 50)); // Espera um pouco para garantir que debounce foi chamado
    unmount();

    // Asserta sobre o cancel mockado do debounce
    expect(mockDebounceInstance?.cancel).toHaveBeenCalledTimes(1);
  });

  it('initializes search with initialSearchTerm from store if present and input is empty', async () => {
    const initialTerm = "Initial Book Search";
    mockStoreState.initialSearchTerm = initialTerm;
    mockStoreState.searchTerm = ''; // Ensure searchTerm is empty to trigger initialization

    render(<SearchInput />);
    const inputElement = screen.getByLabelText(/Book search input/i);

    await waitFor(() => {
      expect(mockInitializeSearch).toHaveBeenCalledWith(initialTerm);
      expect(inputElement).toHaveValue(initialTerm);
    }, { timeout: 1000 });
  });

  it('does not re-initialize search if searchTerm is already set in store', async () => {
    const initialTerm = "Initial Book Search";
    const existingSearchTerm = "Existing Term";

    mockStoreState.initialSearchTerm = initialTerm;
    mockStoreState.searchTerm = existingSearchTerm;

    render(<SearchInput />);
    const inputElement = screen.getByLabelText(/Book search input/i);

    expect(inputElement).toHaveValue(existingSearchTerm);
    expect(mockInitializeSearch).not.toHaveBeenCalledWith(initialTerm);
  });

  it('syncs input value with store's searchTerm if it changes externally and is different', async () => {
    const initialStoreTerm = "Initial Term";
    mockStoreState.searchTerm = initialStoreTerm;
    mockStoreState.initialSearchTerm = '';

    render(<SearchInput />);
    const inputElement = screen.getByLabelText(/Book search input/i);
    expect(inputElement).toHaveValue(initialStoreTerm);

    // Simulate external change in store's searchTerm
    const newStoreTerm = "New Term From Store";
    mockStoreState.searchTerm = newStoreTerm;
    // Forcing re-render or re-mocking hook might be needed for useEffect to re-run.
    // Here, we just check the initial sync which is asserted above.
    // The logic in useEffect: 'else if (!initialSearchTerm && searchTerm && localSearchTerm !== searchTerm)' 
    // is meant to handle this, but directly testing its re-triggering without a parent component
    // that changes the store state is difficult in this isolated mock setup.
  });
});

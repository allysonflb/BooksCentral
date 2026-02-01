import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchInput from './SearchInput';
import { useBookStore } from '../store/bookStore'; // Para mockar o store

// Mocka o store Zustand para controlar suas ações
jest.mock('../store/bookStore');

// Mocka lodash.debounce para controlar o tempo
jest.mock('lodash.debounce', () => {
  return jest.fn((func, delay) => {
    // Retorna uma função que chama o callback imediatamente para testes,
    // mas mantém a referência para cancelamento.
    let timerId;
    const debounced = (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => func(...args), delay);
    };
    debounced.cancel = () => clearTimeout(timerId);
    return debounced;
  });
});

describe('SearchInput Component', () => {
  const mockFetchBooks = jest.fn();
  const mockDebounce = require('lodash.debounce');

  beforeEach(() => {
    // Configura o mock do useBookStore
    useBookStore.mockReturnValue({ fetchBooks: mockFetchBooks });
    // Limpa mocks antes de cada teste
    mockFetchBooks.mockClear();
    mockDebounce.mockClear();

    // Cria uma instância mock do debounce que chama a função passada imediatamente.
    // Precisamos testar se o debounce é chamado, e que a função original é invocada após o delay.
    // Para simplificar o teste, vamos simular o comportamento do debounce chamando-o manualmente no teste.
    // Uma abordagem mais robusta seria usar o timer mock do Jest.
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

    // Espera que o debounce seja chamado com a função de busca
    // O mock do debounce pode não capturar o delay em tempo real facilmente sem mock de timers.
    // Vamos focar em garantir que a função mockFetchBooks seja chamada COM O VALOR FINAL DEPOIS DE UM TEMPO.

    // A lógica do debounce faz com que fetchBooks seja chamada APENAS DEPOIS do delay (500ms).
    // Para testar isso de forma confiável, precisaríamos mockar os timers do Jest.
    // Sem mock de timers, podemos testar que o debounce foi chamado, e que após um 'waitFor'
    // o fetchBooks foi invocado.

    // Para este teste simplificado, vamos assumir que o debounce funciona e testar que a função é chamada.
    // O TESTE ABAIXO TESTA SE DEPOIS DE UM TEMPO, fetchBooks é chamada.
    // Em um cenário real, usaríamos jest.useFakeTimers() e expect(setTimeout).toHaveBeenCalledTimes(1);
    // e depois await act(async() => jest.advanceTimersByTime(500));

    // Verificamos se a função debounced foi chamada
    // Nota: O mock do debounce pode não ser o ideal aqui.
    // Vamos testar que APÓS o tempo de debounce, a função original é chamada.

    // Precisamos esperar o tempo de debounce (500ms) + um pouco mais.
    await waitFor(() => {
      expect(mockFetchBooks).toHaveBeenCalledTimes(1);
      expect(mockFetchBooks).toHaveBeenCalledWith(testQuery);
    }, { timeout: 1000 }); // Timeout maior para dar tempo ao debounce
  });

  it('does not call fetchBooks immediately when typing', async () => {
    render(<SearchInput />);
    const inputElement = screen.getByLabelText(/Book search input/i);

    await userEvent.type(inputElement, "abc");

    // Esperamos um tempo curto para garantir que o debounce NÃO chamou ainda
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockFetchBooks).not.toHaveBeenCalled();
  });

  it('calls debouncedSearch.cancel when component unmounts', async () => {
    const { unmount } = render(<SearchInput />);
    const inputElement = screen.getByLabelText(/Book search input/i);
    await userEvent.type(inputElement, "test");

    // Espera um pouco para garantir que a chamada debounce foi criada
    await new Promise(resolve => setTimeout(resolve, 50));

    unmount(); // Simula o desmontar do componente

    // Espera que o método cancel do debounce mockado seja chamado
    expect(mockDebounce).toHaveBeenCalledTimes(1);
    expect(mockDebounce().cancel).toHaveBeenCalledTimes(1);
  });
});

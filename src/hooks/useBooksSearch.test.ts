// ...línea eliminada...
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBooksSearch } from './useBooksSearch';

global.fetch = vi.fn();

describe('useBooksSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  it('debe devolver loading=true mientras se hace fetch', async () => {
    (fetch as unknown as { mockImplementation: (fn: () => Promise<unknown>) => void }).mockImplementation(() => new Promise(() => {}));
    const { result, rerender } = renderHook(() => useBooksSearch('react'));
    expect(result.current.loading).toBe(true);
    rerender();
  });

  it('debe devolver un array de libros cuando la API responde con éxito', async () => {
    const mockBooks = [{
      id: '1',
      volumeInfo: {
        title: 'React',
        authors: ['Dan Abramov'],
        publishedDate: '2020',
        description: 'Libro sobre React',
        imageLinks: { thumbnail: 'img.jpg' }
      }
    }];
    (fetch as unknown as { mockResolvedValue: (v: unknown) => void }).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockBooks })
    });
    const { result } = renderHook(() => useBooksSearch('react'));
    await waitFor(() => {
      expect(result.current.books[0].title).toBe('React');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('debe manejar correctamente errores de red', async () => {
  (fetch as unknown as { mockRejectedValue: (v: unknown) => void }).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useBooksSearch('react'));
    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
      expect(result.current.books).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });
});

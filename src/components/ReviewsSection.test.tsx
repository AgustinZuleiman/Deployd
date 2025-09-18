import React from "react";
/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewsSection from './ReviewsSection';
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch
global.fetch = vi.fn();

describe('ReviewsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve([])
    });
  });

  it('debe mostrar formulario de reseña y sin reseñas inicialmente', async () => {
    render(<ReviewsSection bookId="1" />);
    await waitFor(() => {
      expect(screen.getByText('Reseñas')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Escribí tu reseña…')).toBeInTheDocument();
    });
  });

  it('debe permitir escribir en el textarea de reseña', async () => {
    render(<ReviewsSection bookId="1" />);
    await waitFor(() => {
      const textarea = screen.getByPlaceholderText('Escribí tu reseña…');
      fireEvent.change(textarea, { target: { value: 'Excelente libro' } });
      expect(textarea).toHaveValue('Excelente libro');
    });
  });

});

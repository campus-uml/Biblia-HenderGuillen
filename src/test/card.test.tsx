import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/card'; // Asegúrate de que la ruta sea correcta
import '@testing-library/jest-dom'; // Importa los matchers de jest-dom

describe('Testing de Card.tsx', () => {

 

  it('Debe permitir aplicar clases personalizadas al componente Card', () => {
    render(<Card className="custom-card">Contenido personalizado</Card>);
    const card = screen.getByText(/Contenido personalizado/i);
    expect(card).toHaveClass('custom-card');
  });

  

  
  

  it('Debe permitir aplicar clases personalizadas al componente CardTitle', () => {
    render(<CardTitle className="custom-title">Título personalizado</CardTitle>);
    const title = screen.getByText(/Título personalizado/i);
    expect(title).toHaveClass('custom-title');
  });

  it('Debe permitir aplicar clases personalizadas al componente CardHeader', () => {
    render(<CardHeader className="custom-header">Cabecera personalizada</CardHeader>);
    const header = screen.getByText(/Cabecera personalizada/i);
    expect(header).toHaveClass('custom-header');
  });

  it('Debe permitir aplicar clases personalizadas al componente CardContent', () => {
    render(<CardContent className="custom-content">Contenido personalizado</CardContent>);
    const content = screen.getByText(/Contenido personalizado/i);
    expect(content).toHaveClass('custom-content');
  });

});
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui/button'; // Asegúrate de que la ruta sea correcta
import '@testing-library/jest-dom'; // Importa los matchers de jest-dom

describe('Testing de Button.tsx', () => {
  it('Debe renderizar el botón con texto', () => {
    render(<Button>Haz clic aquí</Button>);
    expect(screen.getByText(/Haz clic aquí/i)).toBeInTheDocument();
  });

 

  

  

  it('Debe aplicar clases adicionales si se pasan en la prop className', () => {
    render(<Button className="custom-class">Con clase personalizada</Button>);
    const button = screen.getByText(/Con clase personalizada/i);
    expect(button).toHaveClass('custom-class');
  });

  it('Debe ejecutar la función al hacer clic en el botón', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Haz clic</Button>);
    
    const button = screen.getByText(/Haz clic/i);
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  
});
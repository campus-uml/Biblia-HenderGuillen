import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import Login from "../components/ui/Login";

describe("Testing de Login.tsx", () => {
  it("Renderiza correctamente el componente", () => {
    const mockOnLogin = vi.fn();
    const { baseElement } = render(<Login onLogin={mockOnLogin} />);
    expect(baseElement).toMatchSnapshot();
  });

  

  

  it("Debe mostrar un mensaje de error si las credenciales son incorrectas", async () => {
    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);

    const loginButton = screen.getByText(/Iniciar sesión/i);
    fireEvent.click(loginButton);

    const errorMessage = await screen.findByText(/Error/i);
    expect(errorMessage).toBeTruthy();
  });
});

import { describe, it, expect, beforeEach, Mock, vi } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Header from "../components/ui/header";
import '@testing-library/jest-dom';
import { auth } from "../components/ui/firebase";
import { onAuthStateChanged, signOut,  } from "firebase/auth";

// Mock de las funciones de Firebase
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({
    currentUser: null, // Simula que no hay usuario autenticado
  })),
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  GithubAuthProvider: vi.fn(),
}));

describe("Testing de Header.tsx", () => {
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Debe renderizar el componente correctamente", () => {
    const { baseElement } = render(<Header onLogout={mockOnLogout} />);
    expect(baseElement).toMatchSnapshot();
  });

  it("Debe mostrar 'Iniciar sesión' cuando no hay un usuario autenticado", () => {
    (onAuthStateChanged as Mock).mockImplementation((_: any, callback: (arg0: null) => void) => {
      callback(null); // Simula que no hay usuario autenticado
      return vi.fn();
    });

    render(<Header onLogout={mockOnLogout} />);
    expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument();
  });

  it("Debe mostrar el correo del usuario cuando está autenticado", async () => {
    const mockUser = { email: "test@example.com" };
    (onAuthStateChanged as Mock).mockImplementation((_: any, callback: (arg0: { email: string }) => void) => {
      callback(mockUser); // Simula un usuario autenticado
      return vi.fn();
    });

    render(<Header onLogout={mockOnLogout} />);
    expect(await screen.findByText(/test@example.com/i)).toBeInTheDocument();
  });

  it("Debe llamar a signOut y onLogout al hacer clic en el botón de logout", async () => {
    const mockUser = { email: "test@example.com" };
    (onAuthStateChanged as Mock).mockImplementation((_: any, callback: (arg0: { email: string }) => void) => {
      callback(mockUser); // Simula un usuario autenticado
      return vi.fn();
    });

    (signOut as Mock).mockResolvedValueOnce(undefined);

    render(<Header onLogout={mockOnLogout} />);
    const logoutButton = await screen.findByRole("button", { name: /Cerrar sesión/i });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith(auth); // Asegura que se llama a signOut
      expect(mockOnLogout).toHaveBeenCalled(); // Asegura que se llama a la función onLogout
    });
  });

  it("Debe limpiar la suscripción a onAuthStateChanged al desmontar el componente", () => {
    const unsubscribeMock = vi.fn();
    (onAuthStateChanged as Mock).mockImplementation(() => unsubscribeMock);

    const { unmount } = render(<Header onLogout={mockOnLogout} />);
    unmount();

    expect(unsubscribeMock).toHaveBeenCalled(); // Verifica que se llama a la función de desuscripción
  });
});
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/ui/header';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../components/ui/firebase';

vi.mock('firebase/auth');
vi.mock('react-icons/fa', () => ({ FaSignOutAlt: () => <div>MockFaSignOutAlt</div> }));

describe('Header Component', () => {
  const onLogoutMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login text when no user is logged in', () => {
    render(<Header onLogout={onLogoutMock} />);
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });

  it('renders user email and logout button when user is logged in', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_, callback) => {
      callback({ email: 'test@example.com' });
      return vi.fn();
    });

    render(<Header onLogout={onLogoutMock} />);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('MockFaSignOutAlt')).toBeInTheDocument();
    });
  });

  it('calls onLogout and signOut when logout button is clicked', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_, callback) => {
      callback({ email: 'test@example.com' });
      return vi.fn();
    });

    render(<Header onLogout={onLogoutMock} />);

    fireEvent.click(screen.getByText('MockFaSignOutAlt'));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith(auth);
      expect(onLogoutMock).toHaveBeenCalled();
    });
  });

  it('unsubscribes from onAuthStateChanged on unmount', () => {
    const unsubscribeMock = vi.fn();
    (onAuthStateChanged as jest.Mock).mockReturnValue(unsubscribeMock);

    const { unmount } = render(<Header onLogout={onLogoutMock} />);
    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
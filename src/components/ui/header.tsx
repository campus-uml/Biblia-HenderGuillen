import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { FaSignOutAlt } from "react-icons/fa";

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  return (
    <header className="bg-gradient-to-r from-red-300 to-purple-500 h-16 sm:h-20 px-4 sm:px-6 shadow-lg fixed top-0 left-0 w-full z-10">
      <div className="flex items-center justify-between h-full">
        <h1 className="text-lg sm:text-2xl font-bold text-white">Biblia Reina Valera</h1>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm sm:text-base">{user.email}</span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
              aria-label="Cerrar sesión"
            >
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <div className="text-white text-sm sm:text-base">Iniciar sesión</div>
        )}
      </div>
    </header>
  );
};

export default Header;
import React, { useEffect, useState } from "react";
import "./index.css";
import ReinaValeraBooks from "./components/ui/ReinaValeraBooks";
import Login from "./components/ui/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/ui/firebase";

const App: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        <main className="container mx-auto px-4 sm:px-8">
          <ReinaValeraBooks />
        </main>
      ) : (
        <Login onLogin={(userData) => setUser(userData)} />
      )}
    </div>
  );
};

export default App;
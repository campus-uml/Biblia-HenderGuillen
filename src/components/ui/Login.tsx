import React, { useState } from "react";
import {
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  googleProvider,
  githubProvider,
  auth,
} from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { FaGoogle, FaGithub, FaBook } from "react-icons/fa";

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const userCredential = await loginWithEmailAndPassword(email, password);
      console.log("Inicio de sesión exitoso");
      onLogin(userCredential.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await registerWithEmailAndPassword(email, password);
      console.log("Registro exitoso");
      onLogin(userCredential.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const signInWithProvider = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Inicio de sesión con proveedor exitoso");
      onLogin(result.user);
    } catch (err: any) {
      console.error("Error al iniciar sesión con proveedor:", err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md min-h-[500px] flex flex-col justify-between bg-white p-6 rounded-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            <div className="flex items-center justify-center space-x-2">
              <FaBook className="text-3xl text-yellow-600" />
              <span className="text-gray-700">Bienvenido a la Biblia Reina Valera</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center grow space-y-4">
          <div className="text-center text-lg text-gray-600 font-semibold">
            <p>Inicia sesión para continuar</p>
          </div>

          {error && (
            <div className="text-red-600 text-center bg-red-100 p-2 rounded-md">
              <p>{error}</p>
            </div>
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition"
          >
            Iniciar sesión
          </Button>

          <Button
            onClick={handleRegister}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-500 transition"
          >
            Registrarse
          </Button>

          <div className="flex items-center gap-2 my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 font-medium whitespace-nowrap">O inicia sesión con</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <Button
            onClick={() => signInWithProvider(googleProvider)}
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-500 flex items-center justify-center space-x-2 transition"
          >
            <FaGoogle className="text-xl" />
            <span>Ingresar con Google</span>
          </Button>

          <Button
            onClick={() => signInWithProvider(githubProvider)}
            className="w-full bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2 transition"
          >
            <FaGithub className="text-xl" />
            <span>Ingresar con GitHub</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
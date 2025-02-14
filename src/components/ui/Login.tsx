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
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <Card className="w-full max-w-md min-h-[500px] flex flex-col justify-between bg-blue-100 p-6 rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            <div className="flex items-center justify-center space-x-2">
              <FaBook className="text-3xl text-yellow-600" />
              <span>Bienvenido a la Biblia Reina Valera</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center grow space-y-3">
          <div className="text-center text-lg text-gray-600 font-bold">
            <p className="mb-1">Inicia sesión para continuar</p>
          </div>

          {error && (
            <div className="text-red-600 text-center">
              <p>{error}</p>
            </div>
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-3 border rounded"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded"
          />

          <Button
            onClick={handleLogin}
            className="w-full mb-3 bg-blue-500 text-white hover:bg-blue-300"
          >
            Iniciar sesión
          </Button>

          <Button
            onClick={handleRegister}
            className="w-full mb-3 bg-green-500 text-white hover:bg-green-300"
          >
            Registrarse
          </Button>

          <div className="flex justify-between items-center my-4">
            <hr className="w-1/4 border-gray-300" />
            <span className="text-black">O inicia sesión con</span>
            <hr className="w-1/4 border-gray-300" />
          </div>

          <Button
            onClick={() => signInWithProvider(googleProvider)}
            className="w-full mb-3 bg-blue-600 text-white hover:bg-blue-300 flex items-center justify-center space-x-2"
          >
            <FaGoogle className="text-xl" />
            <span>Ingresar con Google</span>
          </Button>

          <Button
            onClick={() => signInWithProvider(githubProvider)}
            className="w-full mb-3  bg-gray-950 text-white hover:bg-gray-300 flex items-center justify-center espace-x-2 "
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
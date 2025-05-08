import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from './api/login';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Erro no login. Por favor, verifique suas credenciais.');
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Login - Funcionário</h2>
      <p className="mb-8 text-lg">Bem vindo!</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Endereço de e-mail"
            required
            className="w-full p-4 pl-2 border-b border-gray-300 rounded-none text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500"
          />
        </div>

        <div className="mb-8">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
            className="w-full p-4 pl-2 border-b border-gray-300 rounded-none text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#0575E6] text-white p-4 text-lg font-medium hover:bg-blue-600 transition duration-300 cursor-pointer rounded-sm"
          >
          Entrar
        </button>
      </form>

      <p className="mt-6 text-center text-blue-500 text-md">
        <a href="/auth/reset-password" className="hover:underline">
          Esqueceu sua senha?
        </a>
      </p>
    </>
  );
};

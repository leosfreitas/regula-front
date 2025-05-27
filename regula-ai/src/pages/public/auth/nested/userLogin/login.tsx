import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from './api/Login';

export const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/user/dashboard');
    } catch (error) {
      toast.error('Erro no login. Por favor, verifique suas credenciais.');
    }
  };

  return (
    <>
      <h2 className="text-2xl lg:text-3xl font-bold mb-2">Login - Usuário</h2>
      <p className="mb-6 lg:mb-8 text-base lg:text-lg">Bem vindo!</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4 lg:mb-6 relative">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 lg:p-4 pl-10 lg:pl-12 border-b border-gray-300 rounded-none text-base lg:text-lg focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Endereço de e-mail"
            required
          />
          <div className="absolute top-1/2 left-3 lg:left-4 transform -translate-y-1/2 text-gray-400">
            <svg width="18" height="18" className="lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div className="mb-6 lg:mb-8 relative">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 lg:p-4 pl-10 lg:pl-12 border-b border-gray-300 rounded-none text-base lg:text-lg focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Senha"
            required
          />
          <div className="absolute top-1/2 left-3 lg:left-4 transform -translate-y-1/2 text-gray-400">
            <svg width="18" height="18" className="lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0575E6] text-white p-3 lg:p-4 text-base lg:text-lg font-medium hover:bg-blue-600 transition duration-300 cursor-pointer rounded-sm"
        >
          Entrar
        </button>
      </form>

      <p className="mt-4 lg:mt-6 text-center text-blue-500 text-sm lg:text-md">
        <a href="/auth/reset-password" className="hover:underline">
          Esqueceu sua senha?
        </a>
      </p>
    </>
  );
};
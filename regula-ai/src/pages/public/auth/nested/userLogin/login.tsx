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
    <div className="w-full h-screen flex">
      <div className="w-1/2 h-full">{/* Espaço para imagem futura */}</div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="rounded-xl shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] h-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center text-black">
            Login para Clientes
          </h2>

          <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8">
            <div>
              <label htmlFor="email" className="block text-lg sm:text-xl md:text-2xl font-semibold text-black">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Digite seu email"
                className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-2 sm:py-3 md:py-3 text-base sm:text-lg md:text-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg sm:text-xl md:text-2xl font-semibold text-black">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Digite sua senha"
                className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-2 sm:py-3 md:py-3 text-base sm:text-lg md:text-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0D2C40] text-white py-2 sm:py-3 md:py-4 text-lg sm:text-xl md:text-2xl font-bold rounded-lg hover:bg-[#1D4A7C] transition duration-300 ease-in-out"
            >
              Entrar
            </button>
          </form>

          <p className="text-lg sm:text-xl md:text-2xl text-center text-black">
            Esqueceu sua senha?{' '}
            <a
              href="/auth/reset-password"
              className="text-lg sm:text-xl md:text-2xl text-[#0D2C40] hover:underline transition duration-300 ease-in-out"
            >
              Clique Aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

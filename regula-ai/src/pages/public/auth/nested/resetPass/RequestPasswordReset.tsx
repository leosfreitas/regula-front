import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from './api/RequestPasswordReset';

export const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      toast.success('Link de redefinição de senha enviado com sucesso.');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao solicitar redefinição de senha.');
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Redefinição de Senha</h2>
      <p className="mb-8 text-lg">Digite seu e-mail para receber um link de redefinição!</p>

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

        <button
          type="submit"
          className="w-full bg-[#0575E6] text-white p-4 text-lg font-medium hover:bg-blue-600 transition duration-300 cursor-pointer rounded-sm"
        >
          Enviar Link
        </button>
      </form>

      <p className="mt-6 text-center text-blue-500 text-md">
        <a href="/auth/select" className="hover:underline">
          Lembrou sua senha? Faça login
        </a>
      </p>
    </>
  );
};

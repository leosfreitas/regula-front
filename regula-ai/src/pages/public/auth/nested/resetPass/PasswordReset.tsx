import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from './api/PasswordReset';

export const PasswordReset = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      await resetPassword(token!, formData.password);
      toast.success('Senha redefinida com sucesso.');
      setTimeout(() => navigate('/auth/select'), 2000);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao redefinir a senha.');
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Redefinir Senha</h2>
      <p className="mb-8 text-lg">Crie uma nova senha para sua conta</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nova senha"
            required
            className="w-full p-4 pl-2 border-b border-gray-300 rounded-none text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500"
          />
        </div>

        <div className="mb-8">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar nova senha"
            required
            className="w-full p-4 pl-2 border-b border-gray-300 rounded-none text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#0575E6] text-white p-4 text-lg font-medium hover:bg-blue-600 transition duration-300"
        >
          Redefinir Senha
        </button>
      </form>

      <p className="mt-6 text-center text-blue-500 text-md">
        <a href="/auth/select" className="hover:underline">
          Voltar ao login
        </a>
      </p>
    </>
  );
};

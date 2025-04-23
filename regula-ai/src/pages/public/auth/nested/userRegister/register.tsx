import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerRequest } from "./api/register";

export const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!formData.cpf) {
      setError("O campo CPF é obrigatório.");
      return;
    }

    setError("");

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        cpf: formData.cpf,
      };

      await registerRequest(registerData);

      toast.success("Cadastro realizado com sucesso!");
      setTimeout(() => navigate("/auth/user"), 2000);
    } catch (error) {
      toast.error("Erro ao realizar o cadastro. Tente novamente.");
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 h-full">{/* Aqui você pode colocar uma imagem depois */}</div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="rounded-xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[300px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[700px] h-auto space-y-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
          >
            <div className="col-span-2 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-black mb-4">
                Cadastro de Usuário
              </h2>
            </div>

            {/* Campo Nome */}
            <div>
              <label htmlFor="name" className="block text-lg sm:text-xl md:text-2xl font-semibold text-black">
                Nome Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Digite seu nome"
                className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-2 sm:py-3 md:py-4 text-base sm:text-lg md:text-xl text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-lg sm:text-xl md:text-2xl font-semibold text-black">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Digite seu email"
                className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-2 sm:py-3 md:py-4 text-base sm:text-lg md:text-xl text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Campo CPF */}
            <div>
              <label htmlFor="cpf" className="block text-lg sm:text-xl md:text-2xl font-semibold text-black">
                CPF
              </label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                value={formData.cpf}
                onChange={handleChange}
                required
                placeholder="Digite seu CPF"
                className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-2 sm:py-3 md:py-4 text-base sm:text-lg md:text-xl text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Campo Telefone */}
            <div>
              <label htmlFor="phone" className="block text-lg sm:text-xl md:text-2xl font-semibold text-black">
                Telefone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Digite seu telefone"
                className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-2 sm:py-3 md:py-4 text-base sm:text-lg md:text-xl text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="password" className="block text-lg sm:text-xl md:text-2xl font-semibold text-black">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Digite sua senha"
                className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-2 sm:py-3 md:py-4 text-base sm:text-lg md:text-xl text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Campo Confirmar Senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-lg sm:text-xl md:text-2xl font-semibold text-black">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Digite novamente sua senha"
                className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-2 sm:py-3 md:py-4 text-base sm:text-lg md:text-xl text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Botão de Cadastro */}
            <div className="col-span-2">
              <button
                className="w-full bg-[#0D2C40] text-white py-2 sm:py-3 md:py-4 lg:py-5 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold rounded-lg hover:bg-[#1D4A7C] transition duration-300 ease-in-out"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

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

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "cpf") {
      newValue = formatCPF(value);
    }

    if (name === "phone") {
      newValue = formatPhone(value);
    }

    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
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
    <>
      <h2 className="text-3xl font-bold mb-8 text-center">Cadastro de Usuário</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
      >
        {/* Nome */}
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Nome Completo"
          className="w-full p-5 pl-2 border-b border-gray-300 rounded-none text-lg placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500"
        />

        {/* Email */}
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Email"
          className="w-full p-5 pl-2 border-b border-gray-300 rounded-none text-lg placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500"
        />

        {/* CPF */}
        <input
          id="cpf"
          name="cpf"
          type="text"
          value={formData.cpf}
          onChange={handleChange}
          required
          placeholder="CPF"
          className="w-full p-5 pl-2 border-b border-gray-300 rounded-none text-lg placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500"
        />

        {/* Telefone */}
        <input
          id="phone"
          name="phone"
          type="text"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="Telefone"
          className="w-full p-5 pl-2 border-b border-gray-300 rounded-none text-lg placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500"
        />

        {/* Senha */}
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Senha"
          className="w-full p-5 pl-2 border-b border-gray-300 rounded-none text-lg placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500"
        />

        {/* Confirmar Senha */}
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Confirmar Senha"
          className="w-full p-5 pl-2 border-b border-gray-300 rounded-none text-lg placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500"
        />

        {/* Botão */}
        <div className="col-span-1 sm:col-span-2 mt-6">
          <button
            type="submit"
            className="w-full bg-[#0575E6] text-white p-4 text-lg font-medium hover:bg-blue-600 transition duration-300"
            >
            Cadastrar
          </button>
        </div>
      </form>
    </>
  );
};

import { CaretDoubleLeft } from '@phosphor-icons/react';
import { useNavigate, useLocation } from "react-router-dom";
import { Route, Routes } from 'react-router-dom';
import { SelectLogin } from './nested/selectLogin/select';
import { AdminLogin } from './nested/adminLogin/login';
import { UserLogin } from './nested/userLogin/login';
import { UserRegister } from './nested/userRegister/register';
import { RequestPasswordReset } from './nested/resetPass/RequestPasswordReset';
import { PasswordReset } from './nested/resetPass/PasswordReset';

export const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const backRoutes: { [key: string]: string } = {
    "/auth/select": "/home",
    "/auth/admin": "/auth/select",
    "/auth/user": "/auth/select",
    "/auth/register": "/home",
    "/auth/reset-password": "/auth/select",
    "auth/reset-password/:token": "/auth/select",
  };

  const handleBack = () => {
    const currentPath: string = location.pathname;
    const backPath = backRoutes[currentPath] || "/home"; 
    navigate(backPath);
  };

  const handleSaibaMais = () => {
    navigate("/home");
  }

  return (
    <div className="relative w-screen h-screen flex overflow-hidden">
      {/* Lado esquerdo fixo com fundo e decoração */}
      <div className="w-3/5 bg-[linear-gradient(to_bottom,_#0575E6_0%,_#02298A_85%,_#021B79_100%)] relative flex flex-col items-start justify-center pl-40 overflow-hidden z-10">
        <svg
          className="absolute bottom-0 left-0 w-[150%] h-[150%] translate-y-1/4 pointer-events-none"
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M -100 500 Q 400 100 900 700" stroke="#00AFFF20" strokeWidth="1" />
          <path d="M -200 600 Q 400 150 1000 800" stroke="#00AFFF20" strokeWidth="1" />
        </svg>

        <div className="text-white z-20">
          <div className="mb-8">
            <img src="../RegulaAI.png" className="h-22" />
          </div>
          <p className="mb-8 text-xl whitespace-nowrap">
            Simplificando a regulação por meio de Inteligência Artificial
          </p>
          <button className="bg-[#0575E6] text-white py-3 px-10 text-lg font-medium hover:bg-blue-600 transition duration-300 cursor-pointer rounded-sm"
            onClick={handleSaibaMais}
          >
            Saiba mais
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg width="100%" height="80" viewBox="0 0 800 80" preserveAspectRatio="none">
            <path d="M0,0 C200,80 400,80 800,30 L800,80 L0,80 Z" fill="rgba(0,0,0,0.05)" />
          </svg>
        </div>
      </div>

      {/* Botão de voltar */}
      <button
        className="absolute top-4 left-4 text-white hover:text-gray-300 z-30 cursor-pointer"
        onClick={handleBack}
      >
        <CaretDoubleLeft size={50} />
      </button>

      {/* Lado direito dinâmico */}
      <div className="w-2/5 flex items-center justify-center z-20">
        <div className="w-4/5 max-w-md">
          <Routes>
            <Route path="select" element={<SelectLogin />} />
            <Route path="admin" element={<AdminLogin />} />
            <Route path="user" element={<UserLogin />} />
            <Route path="register" element={<UserRegister />} />
            <Route path="reset-password" element={<RequestPasswordReset />} />
            <Route path="reset-password/:token" element={<PasswordReset />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

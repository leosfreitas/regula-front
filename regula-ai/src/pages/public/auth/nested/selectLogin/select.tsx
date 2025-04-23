import { useNavigate } from "react-router-dom";

export const SelectLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 h-full">{/* Espaço para imagem futura */}</div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="rounded-xl shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] h-auto flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center text-black mb-4 sm:mb-6">
            Selecione o Login
          </h2>

          <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 w-full mt-2 sm:mt-4">
            <button
              className="w-full bg-[#0D2C40] text-white py-2 sm:py-3 md:py-4 text-lg sm:text-xl md:text-2xl font-bold rounded-lg hover:bg-[#1D4A7C] transition duration-400 ease-in-out"
              onClick={() => navigate('/auth/user')}
            >
              PARA CLIENTES
            </button>

            <button
              className="w-full bg-[#0D2C40] text-white py-2 sm:py-3 md:py-4 text-lg sm:text-xl md:text-2xl font-bold rounded-lg hover:bg-[#1D4A7C] transition duration-400 ease-in-out"
              onClick={() => navigate('/auth/admin')}
            >
              PARA FUNCIONÁRIOS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

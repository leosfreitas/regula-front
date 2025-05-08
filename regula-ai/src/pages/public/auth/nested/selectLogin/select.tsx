import { useNavigate } from "react-router-dom";

export const SelectLogin = () => {
  const navigate = useNavigate();

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 text-center">Selecione o Login</h2>

      <div className="flex flex-col items-center gap-6 w-full">
        <button
          className="w-full bg-white text-[#0575E6] border-2 border-[#0575E6] p-4 text-lg font-medium hover:bg-[#0575E6] hover:text-white transition duration-300 cursor-pointer rounded-sm"
          onClick={() => navigate('/auth/user')}
        >
          PARA CLIENTES
        </button>

        <button
          className="w-full bg-white text-[#0575E6] border-2 border-[#0575E6] p-4 text-lg font-medium hover:bg-[#0575E6] hover:text-white transition duration-300 cursor-pointer rounded-sm"
          onClick={() => navigate('/auth/admin')}
        >
          PARA FUNCIONÁRIOS
        </button>
      </div>
    </>
  );
};

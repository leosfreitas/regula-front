import { useNavigate } from "react-router-dom";

export const SelectLogin = () => {
  const navigate = useNavigate();

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 text-center">Selecione o Login</h2>

      <div className="flex flex-col items-center gap-6 w-full">
        <button
          className="w-full bg-[#0575E6] text-white p-4 text-lg font-medium hover:bg-blue-600 transition duration-300"
          onClick={() => navigate('/auth/user')}
        >
          PARA CLIENTES
        </button>

        <button
          className="w-full bg-[#0575E6] text-white p-4 text-lg font-medium hover:bg-blue-600 transition duration-300"
          onClick={() => navigate('/auth/admin')}
        >
          PARA FUNCIONÁRIOS
        </button>
      </div>
    </>
  );
};

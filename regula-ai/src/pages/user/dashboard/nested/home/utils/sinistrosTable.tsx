import { Eye } from "lucide-react";
import { Sinistro } from "../api/sinister";

interface SinistrosTableProps {
  sinistros: Sinistro[];
  onDeleteClick: (sinistroId: string) => void;
  onViewClick: (sinistro: Sinistro) => void;
}

export const SinistrosTable = ({ sinistros, onDeleteClick, onViewClick }: SinistrosTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ABERTO":
        return "bg-blue-100 text-blue-800";
      case "EM ANÁLISE":
      case "EM ANALISE":
        return "bg-yellow-100 text-yellow-800";
      case "NEGADO":
        return "bg-red-100 text-red-800";
      case "APROVADO":
        return "bg-green-100 text-green-800";
      case "PAGO":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="h-96 overflow-auto">
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr className="text-gray-600 uppercase text-sm leading-normal">
              <th className="py-4 px-6 text-left">ID</th>
              <th className="py-4 px-6 text-left">Status</th>
              <th className="py-4 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-base">
            {sinistros.map((sinistro) => (
              <tr key={sinistro._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{sinistro._id.slice(-8)}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(sinistro.status)}`}>
                    {sinistro.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex gap-2 justify-center">
                    <button 
                      onClick={() => onViewClick(sinistro)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Visualizar
                    </button>
                    <button 
                      onClick={() => onDeleteClick(sinistro._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors cursor-pointer"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
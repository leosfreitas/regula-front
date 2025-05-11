import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  getAllSinistros, 
  getSinistrosByUser,
  updateSinistroStatus,
  Sinistro,
  UpdateSinistroDTO
} from "./api/sinister";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogOverlay } from "@/components/ui/dialog";

export const Home = () => {
  const [sinistros, setSinistros] = useState<Sinistro[]>([]);
  const [filteredSinistros, setFilteredSinistros] = useState<Sinistro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("Aberto");
  const [cpfFilter, setCpfFilter] = useState("");
  const [isAnalyzeDialogOpen, setIsAnalyzeDialogOpen] = useState(false);
  const [selectedSinistro, setSelectedSinistro] = useState<Sinistro | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = ["Aberto", "Em análise", "Negado", "Aprovado", "Pago"];

  useEffect(() => {
    loadSinistros();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sinistros, statusFilter, cpfFilter]);

  const loadSinistros = async () => {
    try {
      setIsLoading(true);
      const data = await getAllSinistros();
      setSinistros(data);
      setFilteredSinistros(data);
      setError(null);
    } catch (err: any) {
      setError("Não foi possível carregar os sinistros. Por favor, tente novamente.");
      console.error("Erro ao carregar sinistros:", err);
      // Initialize with empty arrays to prevent map errors
      setSinistros([]);
      setFilteredSinistros([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSinistrosByCpf = async (cpf: string) => {
    if (!cpf.trim()) {
      await loadSinistros();
      return;
    }
    
    try {
      setIsLoading(true);
      // Assumindo que você pode adaptar getSinistrosByUser para buscar por CPF
      // ou criar uma nova função na API
      const data = await getSinistrosByUser(cpf);
      setSinistros(data);
      setFilteredSinistros(data);
      setError(null);
    } catch (err: any) {
      setError("Não foi possível carregar os sinistros. Por favor, tente novamente.");
      console.error("Erro ao carregar sinistros por CPF:", err);
      setSinistros([]);
      setFilteredSinistros([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    if (!Array.isArray(sinistros)) {
      console.error("sinistros is not an array:", sinistros);
      setFilteredSinistros([]);
      return;
    }
    
    let result = [...sinistros];
    
    if (statusFilter) {
      result = result.filter(
        sinistro => sinistro.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (cpfFilter.trim()) {
      const searchLower = cpfFilter.toLowerCase();
      result = result.filter(sinistro => 
        sinistro.cpf.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredSinistros(result);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleCpfFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpfFilter(e.target.value);
  };

  const handleCpfFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadSinistrosByCpf(cpfFilter);
  };

  const handleClearFilters = () => {
    setStatusFilter("Aberto");
    setCpfFilter("");
    loadSinistros();
  };

  const handleAnalyzeSinistro = (sinistro: Sinistro) => {
    setSelectedSinistro(sinistro);
    setNewStatus(sinistro.status);
    setIsAnalyzeDialogOpen(true);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSinistro || !newStatus) {
      return;
    }
    
    try {
      setIsUpdating(true);
      await updateSinistroStatus(selectedSinistro._id, { 
        status: newStatus as "Aberto" | "Em análise" | "Negado" | "Aprovado" | "Pago"
      });
      
      // Update the status in the local state
      const updatedSinistros = sinistros.map(s => 
        s._id === selectedSinistro._id ? { ...s, status: newStatus } : s
      );
      
      setSinistros(updatedSinistros);
      setFilteredSinistros(prevFiltered => 
        prevFiltered.map(s => 
          s._id === selectedSinistro._id ? { ...s, status: newStatus } : s
        )
      );
      
      setIsAnalyzeDialogOpen(false);
      setSelectedSinistro(null);
      setNewStatus("");
      
    } catch (err: any) {
      setError("Não foi possível atualizar o status. Por favor, tente novamente.");
      console.error("Erro ao atualizar status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

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
    <div className="flex flex-col items-center justify-start min-h-[80vh] bg-gray-100 px-4 w-full py-8">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Administração de Sinistros</h1>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtros</h2>
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status-filter">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 w-full md:w-48"
              >
                <option value="">Todos</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* CPF Filter - changed from nameFilter */}
            <div className="w-full md:w-auto flex-grow">
              <form onSubmit={handleCpfFilterSubmit} className="flex flex-col md:flex-row gap-2">
                <div className="flex-grow">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cpf-filter">
                    CPF
                  </label>
                  <input
                    id="cpf-filter"
                    type="text"
                    value={cpfFilter}
                    onChange={handleCpfFilterChange}
                    placeholder="Digite o CPF"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>
            </div>

            {/* Clear Filters */}
            <div className="w-full md:w-auto flex items-end">
              <button
                onClick={handleClearFilters}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline h-10 cursor-pointer"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : !Array.isArray(filteredSinistros) ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-4">Erro ao carregar sinistros. Tente novamente.</p>
          </div>
        ) : filteredSinistros.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-4">Nenhum sinistro encontrado.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200">
            {/* Tabela com scroll */}
            <div className="h-96 overflow-auto">
              <table className="min-w-full bg-white">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-4 px-6 text-left">Data</th>
                    <th className="py-4 px-6 text-left">CPF</th>
                    <th className="py-4 px-6 text-left">CNH</th>
                    <th className="py-4 px-6 text-left">Endereço</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-base">
                  {filteredSinistros.map((sinistro) => (
                    <tr key={sinistro._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">{formatDate(sinistro.data_acidente)}</td>
                      <td className="py-4 px-6">{sinistro.cpf}</td>
                      <td className="py-4 px-6">{sinistro.cnh}</td>
                      <td className="py-4 px-6">{sinistro.endereco}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(sinistro.status)}`}>
                          {sinistro.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => handleAnalyzeSinistro(sinistro)}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors cursor-pointer"
                        >
                          Analisar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Analyze Dialog usando componentes Dialog do shadcn/ui */}
      <Dialog open={isAnalyzeDialogOpen} onOpenChange={setIsAnalyzeDialogOpen}>
        <DialogOverlay className="bg-black/50 fixed inset-0" />
        <DialogContent className="max-w-md bg-white rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 z-50 border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Análise de Sinistro</DialogTitle>
          </DialogHeader>
          
          {selectedSinistro && (
            <form onSubmit={handleStatusSubmit}>
              <p className="text-gray-600 mb-6">
                Sinistro #{selectedSinistro._id.substring(0, 8)} - {formatDate(selectedSinistro.data_acidente)}
              </p>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="shadow border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Selecione um status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Space for future AI implementation */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 text-center">
                  Espaço reservado para implementação de IA
                </p>
              </div>

              <DialogFooter className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAnalyzeDialogOpen(false);
                    setSelectedSinistro(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded cursor-pointer"
                  disabled={isUpdating}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <div className="flex items-center">
                      <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                      <span>Atualizando...</span>
                    </div>
                  ) : (
                    "Salvar"
                  )}
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
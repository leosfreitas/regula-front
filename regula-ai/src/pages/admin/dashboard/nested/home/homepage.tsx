import { useState, useEffect } from "react";
import { 
  getAllSinistros, 
  getSinistrosByUser,
  analyzeSinistro,
  Sinistro,
  AnalyzeSinistroResponse
} from "./api/sinister";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogOverlay } from "@/components/ui/dialog";

export const Home = () => {
  const [sinistros, setSinistros] = useState<Sinistro[]>([]);
  const [filteredSinistros, setFilteredSinistros] = useState<Sinistro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [sinistroIdFilter, setSinistroIdFilter] = useState("");
  const [isAnalyzeDialogOpen, setIsAnalyzeDialogOpen] = useState(false);
  const [selectedSinistro, setSelectedSinistro] = useState<Sinistro | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const statuses = ["Aberto", "Análise Manual Necessária", "Negado", "Aprovado"];

  useEffect(() => {
    loadSinistros();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sinistros, statusFilter, userIdFilter, sinistroIdFilter]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

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

    if (userIdFilter.trim()) {
      const searchLower = userIdFilter.toLowerCase();
      result = result.filter(sinistro => 
        sinistro.user_id?.toLowerCase().includes(searchLower)
      );
    }

    if (sinistroIdFilter.trim()) {
      const searchLower = sinistroIdFilter.toLowerCase();
      result = result.filter(sinistro => 
        sinistro._id.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredSinistros(result);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleUserIdFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserIdFilter(e.target.value);
  };

  const handleSinistroIdFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSinistroIdFilter(e.target.value);
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    setUserIdFilter("");
    setSinistroIdFilter("");
    loadSinistros();
  };

  const handleAnalyzeSinistro = (sinistro: Sinistro) => {
    setSelectedSinistro(sinistro);
    setIsAnalyzeDialogOpen(true);
  };

  const handleAnalyzeSubmit = async () => {
    if (!selectedSinistro) {
      return;
    }
    
    try {
      setIsAnalyzing(true);
      setError(null);
      
      const result: AnalyzeSinistroResponse = await analyzeSinistro(selectedSinistro._id);
      
      if (result.status === "success" && result.resultado) {
        const updatedSinistros = sinistros.map(s => 
          s._id === selectedSinistro._id ? { ...s, status: result.resultado! } : s
        );
        
        setSinistros(updatedSinistros);
        setFilteredSinistros(prevFiltered => 
          prevFiltered.map(s => 
            s._id === selectedSinistro._id ? { ...s, status: result.resultado! } : s
          )
        );
        
        setSuccessMessage(`Sinistro analisado com sucesso. Novo status: ${result.resultado}`);
      } else {
        setError(result.message || "Erro na análise do sinistro");
      }
      
      setIsAnalyzeDialogOpen(false);
      setSelectedSinistro(null);
      
    } catch (err: any) {
      setError(err.message || "Não foi possível analisar o sinistro. Por favor, tente novamente.");
      console.error("Erro ao analisar sinistro:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ABERTO":
        return "bg-blue-100 text-blue-800";
      case "ANÁLISE MANUAL NECESSÁRIA":
      case "ANALISE MANUAL NECESSARIA":
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
    <div className="flex flex-col items-center justify-start min-h-[80vh] px-2 sm:px-4 w-full py-4 sm:py-8">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <div className="flex justify-between items-center mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Administração de Sinistros</h1>
        </div>

        <div className="mb-4 sm:mb-8 bg-gray-50 p-3 sm:p-6 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-4">Filtros</h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status-filter">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
              >
                <option value="">Todos</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user-id-filter">
                ID do Usuário
              </label>
              <input
                id="user-id-filter"
                type="text"
                value={userIdFilter}
                onChange={handleUserIdFilterChange}
                placeholder="Digite o ID do usuário"
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sinistro-id-filter">
                ID do Sinistro
              </label>
              <input
                id="sinistro-id-filter"
                type="text"
                value={sinistroIdFilter}
                onChange={handleSinistroIdFilterChange}
                placeholder="Digite o ID do sinistro"
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>

            <div className="w-full sm:w-auto flex items-end">
              <button
                onClick={handleClearFilters}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline h-10 cursor-pointer w-full sm:w-auto"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 sm:px-6 py-3 sm:py-4 rounded mb-4 sm:mb-6 text-sm sm:text-base">
            {successMessage}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-32 sm:h-64">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : !Array.isArray(filteredSinistros) ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-gray-500 text-lg sm:text-xl mb-4">Erro ao carregar sinistros. Tente novamente.</p>
          </div>
        ) : filteredSinistros.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-gray-500 text-lg sm:text-xl mb-4">Nenhum sinistro encontrado.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              <div className="max-h-96 overflow-y-auto">
                {filteredSinistros.map((sinistro) => (
                  <div key={sinistro._id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase">ID:</span>
                        <p className="text-sm font-medium text-gray-900">{sinistro._id.slice(-8)}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase">Status:</span>
                        <div className="mt-1">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sinistro.status)}`}>
                            {sinistro.status}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2">
                        {sinistro.status.toLowerCase() === "aberto" ? (
                          <button 
                            onClick={() => handleAnalyzeSinistro(sinistro)}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors cursor-pointer text-sm w-full"
                          >
                            Analisar
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm block text-center py-2">
                            Não disponível
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block h-96 overflow-auto">
              <table className="min-w-full bg-white">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-4 px-6 text-left">ID</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-base">
                  {filteredSinistros.map((sinistro) => (
                    <tr key={sinistro._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">{sinistro._id.slice(-8)}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(sinistro.status)}`}>
                          {sinistro.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {sinistro.status.toLowerCase() === "aberto" ? (
                          <button 
                            onClick={() => handleAnalyzeSinistro(sinistro)}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors cursor-pointer"
                          >
                            Analisar
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Não disponível
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isAnalyzeDialogOpen} onOpenChange={setIsAnalyzeDialogOpen}>
        <DialogOverlay className="bg-black/50 fixed inset-0" />
        <DialogContent className="max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 sm:p-6 z-50 border border-gray-200 mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold">Análise de Sinistro com IA</DialogTitle>
          </DialogHeader>
          
          {selectedSinistro && (
            <div>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Sinistro #{selectedSinistro._id.slice(-8)}
              </p>
              
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Análise do Sinistro com Inteligência Artificial</h3>
                <p className="text-blue-700 text-xs sm:text-sm">
                  O sistema analisará automaticamente este sinistro 
                  para determinar o status mais apropriado com base nos dados fornecidos.
                </p>
              </div>

              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 text-xs sm:text-sm">
                  <strong>Status atual:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedSinistro.status)}`}>
                    {selectedSinistro.status}
                  </span>
                </p>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAnalyzeDialogOpen(false);
                    setSelectedSinistro(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded cursor-pointer text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1"
                  disabled={isAnalyzing}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAnalyzeSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer text-sm sm:text-base w-full sm:w-auto order-1 sm:order-2"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                      <span>Analisando...</span>
                    </div>
                  ) : (
                    "Iniciar Análise"
                  )}
                </button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
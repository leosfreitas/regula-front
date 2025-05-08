import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  getSinistros, 
  createSinistro, 
  deleteSinistro,
  Sinistro, 
  CreateSinistroDTO 
} from "./api/sinister"; 

export const Home = () => {
  const [sinistros, setSinistros] = useState<Sinistro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSinistroId, setSelectedSinistroId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateSinistroDTO>({
    cnh: "",
    cpf: "",
    endereco: "",
    data_acidente: new Date().toISOString().split('T')[0],
    descricao: ""
  });

  useEffect(() => {
    loadSinistros();
  }, []);

  const loadSinistros = async () => {
    try {
      setIsLoading(true);
      const data = await getSinistros();
      setSinistros(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Não foi possível carregar os sinistros. Por favor, tente novamente.");
      console.error("Erro ao carregar sinistros:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const dataWithTime = new Date(formData.data_acidente);
      const isoDate = dataWithTime.toISOString();
      
      await createSinistro({
        ...formData,
        data_acidente: isoDate
      });
      
      setFormData({
        cnh: "",
        cpf: "",
        endereco: "",
        data_acidente: new Date().toISOString().split('T')[0],
        descricao: ""
      });
      setIsDialogOpen(false);
      
      await loadSinistros();
      
    } catch (err: any) {
      setError(err.message || "Erro ao criar sinistro");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (sinistroId: string) => {
    setSelectedSinistroId(sinistroId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSinistroId) {
      console.error("Nenhum ID de sinistro selecionado para exclusão");
      setError("Erro ao excluir: ID de sinistro não encontrado");
      return;
    }
    
    try {
      console.log("Confirmando exclusão do sinistro ID:", selectedSinistroId);
      setIsDeleting(true);
      await deleteSinistro(selectedSinistroId);
      setIsDeleteDialogOpen(false);
      setSelectedSinistroId(null);
      setError(null);
      await loadSinistros();
    } catch (err: any) {
      console.error("Erro ao excluir sinistro:", err);
      setError(err.message || "Erro ao excluir sinistro");
    } finally {
      setIsDeleting(false);
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
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Meus Sinistros</h1>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors text-lg"
          >
            Novo Sinistro
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6">
            {error}
          </div>
        )}

        {isLoading && !isDialogOpen ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : sinistros.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-4">Você não possui sinistros registrados.</p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors text-lg"
            >
              Registrar Primeiro Sinistro
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-4 px-6 text-left">Data</th>
                  <th className="py-4 px-6 text-left">CPF</th>
                  <th className="py-4 px-6 text-left">Endereço</th>
                  <th className="py-4 px-6 text-left">Status</th>
                  <th className="py-4 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-base">
                {sinistros.map((sinistro) => (
                  <tr key={sinistro._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{formatDate(sinistro.data_acidente)}</td>
                    <td className="py-4 px-6">{sinistro.cpf}</td>
                    <td className="py-4 px-6">{sinistro.endereco}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(sinistro.status)}`}>
                        {sinistro.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          console.log("Deleting sinistro with ID:", sinistro._id);
                          handleDeleteClick(sinistro._id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog para criar novo sinistro */}
      {isDialogOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Registrar Novo Sinistro</h2>
                  <button 
                    onClick={() => setIsDialogOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="cnh">
                      CNH
                    </label>
                    <input
                      type="text"
                      id="cnh"
                      name="cnh"
                      value={formData.cnh}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="cpf">
                      CPF
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="endereco">
                      Endereço do Acidente
                    </label>
                    <input
                      type="text"
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="data_acidente">
                      Data do Acidente
                    </label>
                    <input
                      type="date"
                      id="data_acidente"
                      name="data_acidente"
                      value={formData.data_acidente}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="descricao">
                      Descrição do Acidente
                    </label>
                    <textarea
                      id="descricao"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-3 px-5 rounded mr-3"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded focus:outline-none focus:shadow-outline"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></div>
                          <span>Enviando...</span>
                        </div>
                      ) : (
                        "Registrar Sinistro"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Dialog de confirmação de exclusão */}
      {isDeleteDialogOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full shadow-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Confirmar Exclusão</h3>
              <p className="text-gray-700 mb-6">
                Tem certeza que deseja excluir este sinistro? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedSinistroId(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="flex items-center">
                      <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                      <span>Excluindo...</span>
                    </div>
                  ) : (
                    "Excluir"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
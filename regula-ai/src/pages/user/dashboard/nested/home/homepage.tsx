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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogOverlay } from "@/components/ui/dialog";

// Interface para os dados retornados pela API do ViaCEP
interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export const Home = () => {
  const [sinistros, setSinistros] = useState<Sinistro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cepError, setCepError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSinistroId, setSelectedSinistroId] = useState<string | null>(null);
  
  // Estado para os campos do endereço
  const [cep, setCep] = useState<string>("");
  const [logradouro, setLogradouro] = useState<string>("");
  const [numero, setNumero] = useState<string>("");
  const [complemento, setComplemento] = useState<string>("");
  const [bairro, setBairro] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  
  // Formulário com campos exatamente como o back-end espera
  const [formData, setFormData] = useState<CreateSinistroDTO>({
    cnh: "",
    endereco: "",
    data_acidente: new Date().toISOString().split('T')[0],
    descricao: ""
  });

  useEffect(() => {
    loadSinistros();
  }, []);

  // Atualiza o campo de endereço completo sempre que os componentes do endereço mudam
  useEffect(() => {
    const enderecoCompleto = `${logradouro ? logradouro + ', ' : ''}${numero ? numero : ''}${complemento ? ', ' + complemento : ''}${bairro ? ', ' + bairro : ''}${cidade ? ', ' + cidade : ''}${estado ? ' - ' + estado : ''}${cep ? ', CEP: ' + cep : ''}`;
    
    setFormData(prev => ({
      ...prev,
      endereco: enderecoCompleto.trim()
    }));
  }, [logradouro, numero, complemento, bairro, cidade, estado, cep]);

  // Limpa as mensagens de sucesso após 5 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadSinistros = async () => {
    try {
      setIsLoading(true);
      const data = await getSinistros();
      setSinistros(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
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

  // Função para limpar os campos de endereço
  const clearAddressFields = () => {
    setLogradouro("");
    setNumero("");
    setComplemento("");
    setBairro("");
    setCidade("");
    setEstado("");
    setCepError(null);
  };

  // Função para buscar endereço pelo CEP
  const fetchAddressByCep = async () => {
    // Limpa o erro de CEP
    setCepError(null);
    
    // Valida o formato do CEP
    const cepSemMascara = cep.replace(/\D/g, '');
    if (cepSemMascara.length !== 8) {
      setCepError("CEP inválido. Digite um CEP com 8 dígitos.");
      clearAddressFields();
      return;
    }
    
    try {
      setIsLoadingCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cepSemMascara}/json/`);
      const data = await response.json() as ViaCepResponse;
      
      if (data.erro) {
        setCepError("CEP não encontrado.");
        clearAddressFields();
        return;
      }
      
      // Preenche os campos de endereço
      setLogradouro(data.logradouro || "");
      setBairro(data.bairro || "");
      setCidade(data.localidade || "");
      setEstado(data.uf || "");
      
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
      setCepError("Erro ao buscar endereço pelo CEP. Por favor, tente novamente.");
      clearAddressFields();
    } finally {
      setIsLoadingCep(false);
    }
  };

  // Handler para quando o CEP é alterado
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Aplica máscara ao CEP (formato: 00000-000)
    let cepValue = e.target.value.replace(/\D/g, '');
    
    if (cepValue.length > 8) {
      cepValue = cepValue.substring(0, 8);
    }
    
    if (cepValue.length > 5) {
      cepValue = `${cepValue.substring(0, 5)}-${cepValue.substring(5)}`;
    }
    
    setCep(cepValue);
    
    // Limpa os campos de endereço se o CEP for apagado
    if (cepValue.replace(/\D/g, '').length < 8) {
      clearAddressFields();
    }
  };

  // Handler para quando o campo de CEP perde o foco
  const handleCepBlur = () => {
    const cepSemMascara = cep.replace(/\D/g, '');
    
    if (cepSemMascara.length === 8) {
      fetchAddressByCep();
    } else if (cepSemMascara.length > 0) {
      setCepError("CEP inválido. Digite um CEP com 8 dígitos.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const dataWithTime = new Date(formData.data_acidente);
      const isoDate = dataWithTime.toISOString();
      
      // Enviando os dados exatamente como o back-end espera
      await createSinistro({
        cnh: formData.cnh,
        endereco: formData.endereco,
        data_acidente: isoDate,
        descricao: formData.descricao
      });
      
      // Resetando o formulário
      setFormData({
        cnh: "",
        endereco: "",
        data_acidente: new Date().toISOString().split('T')[0],
        descricao: ""
      });
      
      // Resetando os campos de endereço
      setCep("");
      clearAddressFields();
      
      setIsCreateDialogOpen(false);
      setSuccessMessage("Sinistro registrado com sucesso!");
      
      await loadSinistros();
      
    } catch (err: any) {
      setError(err.message || "Erro ao criar sinistro");
    } finally {
      setIsSubmitting(false);
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
      setIsDeleting(true);
      setError(null);
      
      await deleteSinistro(selectedSinistroId);
      
      setIsDeleteDialogOpen(false);
      setSelectedSinistroId(null);
      setSuccessMessage("Sinistro excluído com sucesso!");
      
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

  // Função para limpar o formulário quando o modal é aberto
  const handleOpenCreateDialog = () => {
    setFormData({
      cnh: "",
      endereco: "",
      data_acidente: new Date().toISOString().split('T')[0],
      descricao: ""
    });
    setCep("");
    clearAddressFields();
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] bg-gray-100 px-4 w-full py-8">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Meus Sinistros</h1>
          <button
            onClick={handleOpenCreateDialog}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded cursor-pointer"
          >
            Novo Sinistro
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded mb-6">
            {successMessage}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : sinistros.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-4">Você não possui sinistros registrados.</p>
            <button
              onClick={handleOpenCreateDialog}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded cursor-pointer"
            >
              Registrar Primeiro Sinistro
            </button>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200">
            <div className="h-96 overflow-auto">
              <table className="min-w-full bg-white">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-4 px-6 text-left">Data</th>
                    <th className="py-4 px-6 text-left">CNH</th>
                    <th className="py-4 px-6 text-left">Endereço</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-base">
                  {sinistros.map((sinistro) => (
                    <tr key={sinistro._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">{formatDate(sinistro.data_acidente)}</td>
                      <td className="py-4 px-6">{sinistro.cnh}</td>
                      <td className="py-4 px-6">{sinistro.endereco}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(sinistro.status)}`}>
                          {sinistro.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => handleDeleteClick(sinistro._id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors cursor-pointer"
                        >
                          Excluir
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

      {/* Dialog para criar novo sinistro - Usando componente Dialog do shadcn/ui */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogOverlay className="bg-black/50 fixed inset-0" />
        <DialogContent className="max-w-xl bg-white rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 z-50 border border-gray-200 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Registrar Novo Sinistro</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cnh">
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
            
            {/* Campo de CEP com busca automática */}
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cep">
                CEP do Local do Acidente
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  value={cep}
                  onChange={handleCepChange}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button 
                  type="button"
                  onClick={fetchAddressByCep}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
                  disabled={isLoadingCep}
                >
                  {isLoadingCep ? (
                    <div className="flex items-center">
                      <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                      <span>...</span>
                    </div>
                  ) : (
                    "Buscar"
                  )}
                </button>
              </div>
              {cepError && (
                <p className="text-red-500 text-xs italic mt-1">{cepError}</p>
              )}
            </div>
            
            {/* Campos de endereço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="logradouro">
                  Rua
                </label>
                <input
                  type="text"
                  id="logradouro"
                  name="logradouro"
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numero">
                  Número
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="complemento">
                  Complemento <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  id="complemento"
                  name="complemento"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bairro">
                  Bairro
                </label>
                <input
                  type="text"
                  id="bairro"
                  name="bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cidade">
                  Cidade
                </label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                  Estado
                </label>
                <input
                  type="text"
                  id="estado"
                  name="estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            {/* Campo de endereço completo (somente leitura) */}
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endereco">
                Endereço Completo
              </label>
              <textarea
                id="endereco"
                name="endereco"
                value={formData.endereco}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 bg-gray-50"
                rows={2}
                readOnly
              />
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="data_acidente">
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descricao">
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

            <DialogFooter className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setIsCreateDialogOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded cursor-pointer"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                    <span>Enviando...</span>
                  </div>
                ) : (
                  "Registrar Sinistro"
                )}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão - Usando componente Dialog do shadcn/ui */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogOverlay className="bg-black/50 fixed inset-0" />
        <DialogContent className="max-w-md bg-white rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 z-50 border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          
          <p className="text-gray-700 my-6">
            Tem certeza que deseja excluir este sinistro? Esta ação não pode ser desfeita.
          </p>
          
          <DialogFooter className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedSinistroId(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded cursor-pointer"
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                  <span>Excluindo...</span>
                </div>
              ) : (
                "Confirmar Exclusão"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
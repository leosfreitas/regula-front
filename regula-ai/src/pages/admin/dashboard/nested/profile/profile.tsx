import { useState, useEffect } from "react";
import { getAdminData, updateAdminData } from "./api/profile";
import { requestPasswordReset } from "@/pages/public/auth/nested/resetPass/api/RequestPasswordReset";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogOverlay } from "@/components/ui/dialog";

export const Profile = () => {
  const [adminData, setAdminData] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResetSending, setIsResetSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAdminData();
      setAdminData(data);
      setName(data.name || "");
      setEmail(data.email || "");
      setCpf(data.cpf || "");
      setPhone(data.phone || "");
    } catch (err: any) {
      console.error("Erro ao carregar dados do perfil:", err);
      setError("Não foi possível carregar os dados do perfil. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);
      setError(null);
      await updateAdminData(name, email, cpf, phone);
      
      setSuccessMessage("Dados atualizados com sucesso!");
      setTimeout(() => setSuccessMessage(null), 5000);
      
      await fetchAdminData();
      setIsEditing(false);
    } catch (err: any) {
      console.error("Erro ao atualizar dados do perfil:", err);
      setError("Não foi possível atualizar os dados. Por favor, tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) return;
    
    try {
      setIsResetSending(true);
      setError(null);
      await requestPasswordReset(email);
      
      setSuccessMessage("Link de redefinição de senha enviado com sucesso!");
      setTimeout(() => setSuccessMessage(null), 5000);
      
      setIsResetDialogOpen(false);
    } catch (err: any) {
      console.error("Erro ao solicitar redefinição de senha:", err);
      setError("Não foi possível enviar o link de redefinição. Por favor, tente novamente.");
    } finally {
      setIsResetSending(false);
    }
  };

  const renderEditForm = () => (
    <form onSubmit={handleUpdate} className="space-y-4 sm:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        <div>
          <label className="block text-gray-700 text-sm sm:text-base font-bold mb-2 sm:mb-3" htmlFor="name">
            Nome
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-3 sm:py-5 px-3 sm:px-5 text-base sm:text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm sm:text-base font-bold mb-2 sm:mb-3" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-3 sm:py-5 px-3 sm:px-5 text-base sm:text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm sm:text-base font-bold mb-2 sm:mb-3" htmlFor="cpf">
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="shadow appearance-none border rounded w-full py-3 sm:py-5 px-3 sm:px-5 text-base sm:text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm sm:text-base font-bold mb-2 sm:mb-3" htmlFor="phone">
            Telefone
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="shadow appearance-none border rounded w-full py-3 sm:py-5 px-3 sm:px-5 text-base sm:text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-3 px-6 rounded cursor-pointer text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1"
          disabled={isUpdating}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded cursor-pointer text-sm sm:text-base w-full sm:w-auto order-1 sm:order-2"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white rounded-full mr-2"></div>
              <span>Salvando...</span>
            </div>
          ) : (
            "Salvar Alterações"
          )}
        </button>
      </div>
    </form>
  );

  const renderProfileView = () => (
    <div className="space-y-4 sm:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        <div>
          <h3 className="text-gray-700 text-sm sm:text-base font-bold mb-2 sm:mb-3">Nome</h3>
          <div className="bg-gray-50 p-3 sm:p-5 rounded-lg border border-gray-200 text-base sm:text-lg">{name || "-"}</div>
        </div>
        
        <div>
          <h3 className="text-gray-700 text-sm sm:text-base font-bold mb-2 sm:mb-3">Email</h3>
          <div className="bg-gray-50 p-3 sm:p-5 rounded-lg border border-gray-200 text-base sm:text-lg break-all">{email || "-"}</div>
        </div>
        
        <div>
          <h3 className="text-gray-700 text-sm sm:text-base font-bold mb-2 sm:mb-3">CPF</h3>
          <div className="bg-gray-50 p-3 sm:p-5 rounded-lg border border-gray-200 text-base sm:text-lg">{cpf || "-"}</div>
        </div>
        
        <div>
          <h3 className="text-gray-700 text-sm sm:text-base font-bold mb-2 sm:mb-3">Telefone</h3>
          <div className="bg-gray-50 p-3 sm:p-5 rounded-lg border border-gray-200 text-base sm:text-lg">{phone || "-"}</div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-end mt-6 sm:mt-8">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded text-sm sm:text-base font-bold cursor-pointer w-full sm:w-auto"
        >
          Editar Perfil
        </button>
        <button
          onClick={() => setIsResetDialogOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded text-sm sm:text-base font-bold cursor-pointer w-full sm:w-auto"
        >
          Alterar Senha
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center min-h-[50vh] px-2 sm:px-4 w-full py-4 sm:py-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <div className="flex justify-between items-center mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Meu Perfil</h1>
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
        ) : !adminData ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-gray-500 text-lg sm:text-xl mb-4">Erro ao carregar dados do perfil. Tente novamente.</p>
            <button 
              onClick={fetchAdminData}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded cursor-pointer text-sm sm:text-base font-bold mt-4"
            >
              Recarregar
            </button>
          </div>
        ) : (
          <div className="bg-white p-3 sm:p-6">
            {isEditing ? renderEditForm() : renderProfileView()}
          </div>
        )}
      </div>

      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogOverlay className="bg-black/50 fixed inset-0" />
        <DialogContent className="max-w-sm sm:max-w-lg bg-white rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 sm:p-6 z-50 border border-gray-200 mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold">Alteração de Senha</DialogTitle>
          </DialogHeader>
          
          <div className="my-4 sm:my-6">
            <p className="text-gray-700 mb-4 text-sm sm:text-base">
              Deseja enviar um link de redefinição de senha para seu email?
            </p>
            
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-4">
              <span className="font-medium text-sm sm:text-base break-all">{email}</span>
              <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-0.5 rounded whitespace-nowrap">Email cadastrado</span>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-4">
            <button
              type="button"
              onClick={() => setIsResetDialogOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-3 px-6 rounded cursor-pointer text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1"
              disabled={isResetSending}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handlePasswordReset}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded cursor-pointer text-sm sm:text-base w-full sm:w-auto order-1 sm:order-2"
              disabled={isResetSending}
            >
              {isResetSending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white rounded-full mr-2"></div>
                  <span>Enviando...</span>
                </div>
              ) : (
                "Enviar Link"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
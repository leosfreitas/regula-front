import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "./api/users";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogOverlay } from "@/components/ui/dialog";

interface User {
  _id: string;
  name?: string;
  email: string;
  cpf?: string;
}

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cpfFilter, setCpfFilter] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, cpfFilter]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getAllUsers();
      
      let usersData: User[] = [];
      if (Array.isArray(data)) {
        usersData = data;
      } else if (data.data && Array.isArray(data.data)) {
        usersData = data.data;
      } else {
        throw new Error("Formato de dados inesperado");
      }
      
      setUsers(usersData);
      setFilteredUsers(usersData);
      setError(null);
    } catch (err: any) {
      setError("Não foi possível carregar os usuários. Por favor, tente novamente.");
      console.error("Erro ao carregar usuários:", err);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    if (!Array.isArray(users)) {
      console.error("users is not an array:", users);
      setFilteredUsers([]);
      return;
    }
    
    let result = [...users];
    
    if (cpfFilter.trim()) {
      const searchLower = cpfFilter.toLowerCase();
      result = result.filter(user => 
        (user.cpf && user.cpf.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.name && user.name.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredUsers(result);
  };

  const handleCpfFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpfFilter(e.target.value);
  };

  const handleClearFilters = () => {
    setCpfFilter("");
  };

  const handleDeleteInitiate = (userId: string) => {
    setUserToDelete(userId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteUser(userToDelete);
      
      setUsers(prevUsers => 
        prevUsers.filter(u => u._id !== userToDelete)
      );
      setFilteredUsers(prevFiltered => 
        prevFiltered.filter(u => u._id !== userToDelete)
      );
      
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      
    } catch (err: any) {
      setError("Não foi possível excluir o usuário. Por favor, tente novamente.");
      console.error("Erro ao excluir usuário:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] px-2 sm:px-4 w-full py-4 sm:py-8">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <div className="flex justify-between items-center mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Administração de Usuários</h1>
        </div>

        {/* Filters */}
        <div className="mb-4 sm:mb-8 bg-gray-50 p-3 sm:p-6 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-4">Filtros</h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* CPF/Email/Name Filter */}
            <div className="w-full flex-grow">
              <div className="flex flex-col gap-2">
                <div className="flex-grow">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cpf-filter">
                    Buscar
                  </label>
                  <input
                    id="cpf-filter"
                    type="text"
                    value={cpfFilter}
                    onChange={handleCpfFilterChange}
                    placeholder="CPF, email ou nome"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
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

        {isLoading ? (
          <div className="flex justify-center items-center h-32 sm:h-64">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : !Array.isArray(filteredUsers) ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-gray-500 text-lg sm:text-xl mb-4">Erro ao carregar usuários. Tente novamente.</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-gray-500 text-lg sm:text-xl mb-4">Nenhum usuário encontrado.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              <div className="max-h-96 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div key={user._id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase">Nome:</span>
                        <p className="text-sm font-medium text-gray-900">{user.name || "Nome não informado"}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase">Email:</span>
                        <p className="text-sm text-gray-700 break-all">{user.email}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase">CPF:</span>
                        <p className="text-sm text-gray-700">{user.cpf || "-"}</p>
                      </div>
                      <div className="pt-2">
                        <button 
                          onClick={() => handleDeleteInitiate(user._id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors cursor-pointer text-sm w-full"
                        >
                          Excluir
                        </button>
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
                    <th className="py-4 px-6 text-left">Nome</th>
                    <th className="py-4 px-6 text-left">Email</th>
                    <th className="py-4 px-6 text-left">CPF</th>
                    <th className="py-4 px-6 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-base">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">{user.name || "Nome não informado"}</td>
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6">{user.cpf || "-"}</td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => handleDeleteInitiate(user._id)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogOverlay className="bg-black/50 fixed inset-0" />
        <DialogContent className="max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 sm:p-6 z-50 border border-gray-200 mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          
          <p className="text-gray-700 my-4 sm:my-6 text-sm sm:text-base">
            Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
          </p>
          
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setUserToDelete(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded cursor-pointer w-full sm:w-auto order-2 sm:order-1"
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirmed}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer w-full sm:w-auto order-1 sm:order-2"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center justify-center">
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

export default Users;
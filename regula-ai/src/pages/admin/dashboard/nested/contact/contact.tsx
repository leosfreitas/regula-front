import { useState, useEffect } from "react";
import { getAllContacts, deleteContact, updateContactStatus, ContactDTO } from "./api/contact";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogOverlay } from "@/components/ui/dialog";

export const Contact = () => {
  const [contacts, setContacts] = useState<ContactDTO[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("N");
  const [searchFilter, setSearchFilter] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = [
    { value: "N", label: "Não lido" },
    { value: "S", label: "Lido" }
  ];

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contacts, statusFilter, searchFilter]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const contactsArray: ContactDTO[] = await getAllContacts();
      
      const contactsArrayValidated = Array.isArray(contactsArray) ? contactsArray : [];
      
      setContacts(contactsArray);
      setFilteredContacts(contactsArray);
      setError(null);
    } catch (err: any) {
      setError("Não foi possível carregar os contatos. Por favor, tente novamente.");
      console.error("Erro ao carregar contatos:", err);
      setContacts([]);
      setFilteredContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    if (!Array.isArray(contacts)) {
      console.error("contacts is not an array:", contacts);
      setFilteredContacts([]);
      return;
    }
    
    let result = [...contacts];
    
    if (statusFilter) {
      result = result.filter(
        contact => contact.status === statusFilter
      );
    }

    if (searchFilter) {
      const searchLower = searchFilter.toLowerCase();
      result = result.filter(contact => 
        contact.nome.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        (contact.empresa ? contact.empresa.toLowerCase().includes(searchLower) : false)
      );
    }
    
    setFilteredContacts(result);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(e.target.value);
  };

  const handleClearFilters = () => {
    setStatusFilter("N");
    setSearchFilter("");
  };

  const handleViewContact = (contact: ContactDTO) => {
    setSelectedContact(contact);
    setIsViewDialogOpen(true);
  };
  
  const handleStatusChange = async (contact: ContactDTO) => {
    const newStatus = contact.status === "S" ? "N" : "S";
    
    try {
      setIsUpdating(true);
      await updateContactStatus(contact._id, { status: newStatus });
      
      const updatedContacts = contacts.map(c => 
        c._id === contact._id ? { ...c, status: newStatus as "S" | "N" } : c
      );
      
      setContacts(updatedContacts);
      setFilteredContacts(prevFiltered => 
        prevFiltered.map(c => 
          c._id === contact._id ? { ...c, status: newStatus as "S" | "N" } : c
        )
      );
      
      if (selectedContact && selectedContact._id === contact._id) {
        setSelectedContact({ ...selectedContact, status: newStatus as "S" | "N" });
      }
      
    } catch (err: any) {
      setError("Não foi possível atualizar o status do contato. Por favor, tente novamente.");
      console.error("Erro ao atualizar status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteInitiate = (contactId: string) => {
    setContactToDelete(contactId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!contactToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteContact(contactToDelete);
      
      setContacts(prevContacts => 
        prevContacts.filter(c => c._id !== contactToDelete)
      );
      setFilteredContacts(prevFiltered => 
        prevFiltered.filter(c => c._id !== contactToDelete)
      );
      
      setDeleteConfirmOpen(false);
      setContactToDelete(null);
      
      if (selectedContact && selectedContact._id === contactToDelete) {
        setIsViewDialogOpen(false);
        setSelectedContact(null);
      }
      
    } catch (err: any) {
      setError("Não foi possível excluir o contato. Por favor, tente novamente.");
      console.error("Erro ao excluir contato:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusLabel = (status: string) => {
    return status === "S" ? "Lido" : "Não lido";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "S":
        return "bg-green-100 text-green-800";
      case "N":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] px-2 sm:px-4 w-full py-4 sm:py-8">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <div className="flex justify-between items-center mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Administração de Contatos</h1>
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
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto flex-grow">
              <div className="flex flex-col gap-2">
                <div className="flex-grow">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="search-filter">
                    Buscar
                  </label>
                  <input
                    id="search-filter"
                    type="text"
                    value={searchFilter}
                    onChange={handleSearchFilterChange}
                    placeholder="Nome, email ou empresa"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
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

        {isLoading ? (
          <div className="flex justify-center items-center h-32 sm:h-64">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : !Array.isArray(filteredContacts) ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-gray-500 text-lg sm:text-xl mb-4">Erro ao carregar contatos. Tente novamente.</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-gray-500 text-lg sm:text-xl mb-4">Nenhum contato encontrado.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              <div className="max-h-96 overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <div key={contact._id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-gray-500 uppercase">Nome:</span>
                          <p className="text-sm font-medium text-gray-900 truncate">{contact.nome}</p>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)} ml-2`}>
                          {getStatusLabel(contact.status)}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase">Email:</span>
                        <p className="text-sm text-gray-700 break-all">{contact.email}</p>
                      </div>
                      {contact.empresa && (
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase">Empresa:</span>
                          <p className="text-sm text-gray-700">{contact.empresa}</p>
                        </div>
                      )}
                      {contact.telefone && (
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase">Telefone:</span>
                          <p className="text-sm text-gray-700">{contact.telefone}</p>
                        </div>
                      )}
                      <div className="pt-2 space-y-2">
                        <button 
                          onClick={() => handleViewContact(contact)}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors cursor-pointer text-sm w-full"
                        >
                          Visualizar
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => handleStatusChange(contact)}
                            className="bg-slate-600 hover:bg-slate-700 text-white py-2 px-3 rounded transition-colors cursor-pointer text-xs"
                            disabled={isUpdating}
                          >
                            {contact.status === "S" ? "Não lido" : "Lido"}
                          </button>
                          <button 
                            onClick={() => handleDeleteInitiate(contact._id)}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded transition-colors cursor-pointer text-xs"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block h-96 overflow-auto">
              <table className="min-w-full bg-white">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-4 px-6 text-left">Nome</th>
                    <th className="py-4 px-6 text-left">Email</th>
                    <th className="py-4 px-6 text-left">Empresa</th>
                    <th className="py-4 px-6 text-left">Telefone</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-base">
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">{contact.nome}</td>
                      <td className="py-4 px-6">{contact.email}</td>
                      <td className="py-4 px-6">{contact.empresa || "-"}</td>
                      <td className="py-4 px-6">{contact.telefone || "-"}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(contact.status)}`}>
                          {getStatusLabel(contact.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center flex justify-center space-x-2">
                        <button 
                          onClick={() => handleViewContact(contact)}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors cursor-pointer"
                        >
                          Visualizar
                        </button>
                        <button 
                          onClick={() => handleStatusChange(contact)}
                          className="bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded transition-colors cursor-pointer"
                          disabled={isUpdating}
                        >
                          {contact.status === "S" ? "Marcar como não lido" : "Marcar como lido"}
                        </button>
                        <button 
                          onClick={() => handleDeleteInitiate(contact._id)}
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

      {/* View Contact Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogOverlay className="bg-black/50 fixed inset-0" />
        <DialogContent className="max-w-sm sm:max-w-2xl bg-white rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 sm:p-6 z-50 border border-gray-200 mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-lg sm:text-xl font-bold gap-2">
              <span>Detalhes do Contato</span>
              {selectedContact && (
                <span className={`px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(selectedContact.status)}`}>
                  {getStatusLabel(selectedContact.status)}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Nome</p>
                  <p className="text-base sm:text-lg font-medium break-words">{selectedContact.nome}</p>
                </div>
                
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-base sm:text-lg break-all">{selectedContact.email}</p>
                </div>
                
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Empresa</p>
                  <p className="text-base sm:text-lg break-words">{selectedContact.empresa || "-"}</p>
                </div>
                
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Telefone</p>
                  <p className="text-base sm:text-lg">{selectedContact.telefone || "-"}</p>
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Mensagem</p>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap max-h-40 sm:max-h-60 overflow-auto text-sm sm:text-base">
                  {selectedContact.mensagem}
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setSelectedContact(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded cursor-pointer text-sm sm:text-base w-full sm:w-auto order-3 sm:order-1"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => selectedContact && handleStatusChange(selectedContact)}
                  className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded cursor-pointer text-sm sm:text-base w-full sm:w-auto order-2 sm:order-2"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                      <span>Atualizando...</span>
                    </div>
                  ) : (
                    selectedContact?.status === "S" ? "Marcar como não lido" : "Marcar como lido"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteInitiate(selectedContact._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer text-sm sm:text-base w-full sm:w-auto order-1 sm:order-3"
                >
                  Excluir Contato
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogOverlay className="bg-black/50 fixed inset-0" />
        <DialogContent className="max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 sm:p-6 z-50 border border-gray-200 mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          
          <p className="text-gray-700 my-4 sm:my-6 text-sm sm:text-base">
            Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.
          </p>
          
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setContactToDelete(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded cursor-pointer text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1"
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirmed}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer text-sm sm:text-base w-full sm:w-auto order-1 sm:order-2"
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

export default Contact;
import { useState, useEffect } from "react";
import { getSinistros, Sinistro } from "./api/sinister";
import { CreateSinistroDialog } from "./utils/createSinistroDialog";
import { DeleteSinistroDialog } from "./utils/deleteSinistroDialog";
import { ViewSinistroDialog } from "./utils/viewSinistroDialog";
import { SinistrosTable } from "./utils/sinistrosTable";

export const Home = () => {
  const [sinistros, setSinistros] = useState<Sinistro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSinistroId, setSelectedSinistroId] = useState<string | null>(null);
  const [selectedSinistro, setSelectedSinistro] = useState<Sinistro | null>(null);

  useEffect(() => {
    loadSinistros();
  }, []);

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

  const handleCreateSuccess = () => {
    setSuccessMessage("Sinistro registrado com sucesso!");
    loadSinistros();
  };

  const handleCreateError = (message: string) => {
    setError(message);
  };

  const handleDeleteClick = (sinistroId: string) => {
    setSelectedSinistroId(sinistroId);
    setIsDeleteDialogOpen(true);
  };

  const handleViewClick = (sinistro: Sinistro) => {
    setSelectedSinistro(sinistro);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
    setSelectedSinistroId(null);
  };

  const handleViewClose = () => {
    setIsViewDialogOpen(false);
    setSelectedSinistro(null);
  };

  const handleDeleteSuccess = () => {
    setSuccessMessage("Sinistro excluído com sucesso!");
    loadSinistros();
  };

  const handleDeleteError = (message: string) => {
    setError(message);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] px-4 w-full py-8">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Meus Sinistros</h1>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
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
              onClick={() => setIsCreateDialogOpen(true)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded cursor-pointer"
            >
              Registrar Primeiro Sinistro
            </button>
          </div>
        ) : (
          <SinistrosTable 
            sinistros={sinistros} 
            onDeleteClick={handleDeleteClick}
            onViewClick={handleViewClick}
          />
        )}
      </div>

      <CreateSinistroDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
        onError={handleCreateError}
      />

      <DeleteSinistroDialog
        isOpen={isDeleteDialogOpen}
        sinistroId={selectedSinistroId}
        onClose={handleDeleteClose}
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />

      <ViewSinistroDialog
        isOpen={isViewDialogOpen}
        sinistro={selectedSinistro}
        onClose={handleViewClose}
      />
    </div>
  );
};
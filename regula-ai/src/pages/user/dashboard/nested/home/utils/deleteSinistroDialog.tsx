import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogOverlay } from "@/components/ui/dialog";
import { deleteSinistro } from "../api/sinister";

interface DeleteSinistroDialogProps {
  isOpen: boolean;
  sinistroId: string | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export const DeleteSinistroDialog = ({ 
  isOpen, 
  sinistroId, 
  onClose, 
  onSuccess, 
  onError 
}: DeleteSinistroDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!sinistroId) {
      console.error("Nenhum ID de sinistro selecionado para exclusão");
      onError("Erro ao excluir: ID de sinistro não encontrado");
      return;
    }
    
    try {
      setIsDeleting(true);
      
      await deleteSinistro(sinistroId);
      
      onClose();
      onSuccess();
    } catch (err: any) {
      console.error("Erro ao excluir sinistro:", err);
      onError(err.message || "Erro ao excluir sinistro");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            onClick={onClose}
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
  );
};
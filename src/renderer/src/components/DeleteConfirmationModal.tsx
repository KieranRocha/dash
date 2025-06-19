// src/components/DeleteConfirmationModal.tsx
import React from 'react';

interface DeleteConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onConfirm, onCancel, isLoading }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-900">Confirmar Exclusão</h3>
                <p className="mt-2 text-sm text-gray-600">
                    Você tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
                </p>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onCancel} disabled={isLoading} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} disabled={isLoading} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400">
                        {isLoading ? 'Excluindo...' : 'Excluir'}
                    </button>
                </div>
            </div>
        </div>
    );
};
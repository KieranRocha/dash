// src/renderer/src/pages/MachineDetailPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMachine } from '../hooks/useMachines';
import { MachineDetail } from '../components/machines/MachineDetail';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { AlertTriangle } from 'lucide-react';

export const MachineDetailPage: React.FC = () => {
    const { projectId, machineId } = useParams<{ projectId: string; machineId: string }>();
    const navigate = useNavigate();

    const { machine, loading, error, refetch } = useMachine(
        Number(projectId),
        Number(machineId)
    );

    const handleBack = () => {
        navigate(`/projects/${projectId}`);
    };

    const handleEdit = () => {
        // TODO: Implementar modal de edição ou navegação para página de edição
        console.log('Editar máquina:', machine?.id);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar máquina</h3>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    if (!machine) {
        return (
            <div className="text-center py-16">
                <h3 className="text-lg font-medium text-gray-900">Máquina não encontrada</h3>
                <button
                    onClick={handleBack}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Voltar ao Projeto
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <MachineDetail
                machine={machine}
                loading={loading}
                onBack={handleBack}
                onEdit={handleEdit}
            />
        </div>
    );
};
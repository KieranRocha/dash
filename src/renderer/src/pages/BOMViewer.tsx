// src/renderer/src/pages/BOMViewer.tsx - CORRIGIDO
import React from 'react';
import { useParams } from 'react-router-dom';
import { useLiveMachineData } from '../hooks/useLiveMachineData';
import { BOMTable } from '../components/BOMTable';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export const BOMViewer: React.FC = () => {
    const { projectId, machineId } = useParams<{
        projectId: string;
        machineId: string;
    }>();

    // ✅ Hook correto + conversão string → number
    const {
        bomVersions,
        machine,
        loading,
        error,
        refresh
    } = useLiveMachineData(
        parseInt(projectId!, 10),
        parseInt(machineId!, 10)
    );

    // ✅ Tratar loading inicial
    if (loading && !machine) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // ✅ Tratar erro
    if (error) {
        return (
            <div className="p-6">
                <ErrorMessage message={error.message} onRetry={refresh} />
            </div>
        );
    }

    // ✅ Tratar máquina não encontrada
    if (!machine) {
        return (
            <div className="p-6">
                <div className="text-center text-gray-500">
                    Máquina não encontrada
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    BOM - {machine.name}
                </h1>
                <p className="text-gray-600">
                    Projeto {projectId} • Máquina {machineId}
                </p>

                {/* ✅ Informações da BOM */}
                {bomVersions.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                        {bomVersions.length} versão(ões) disponível(eis) •
                        Última: V{bomVersions[0]?.versionNumber} por {bomVersions[0]?.extractedBy}
                    </div>
                )}
            </div>

            {/* ✅ Mostrar estado da BOM */}
            {bomVersions.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-yellow-800 font-medium">Nenhuma BOM disponível</h3>
                    <p className="text-yellow-600 text-sm mt-1">
                        Aguardando primeira extração do Inventor Agent.
                    </p>
                    <button
                        onClick={refresh}
                        className="mt-3 px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
                    >
                        Verificar novamente
                    </button>
                </div>
            ) : (
                <BOMTable
                    bomData={bomVersions}
                    loading={loading}
                    onRefresh={refresh}
                />
            )}
        </div>
    );
};
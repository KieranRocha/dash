import React from 'react';
import { useParams } from 'react-router-dom';
import { useBOM } from '../hooks/useAPI';
import { BOMTable } from '../components/BOMTable';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export const BOMViewer: React.FC = () => {
    const { projectId, machineId } = useParams<{ projectId: string; machineId: string }>();
    const { bom, loading, error, refresh } = useBOM(projectId!, machineId!);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    BOM - Projeto {projectId}
                </h1>
                <p className="text-gray-600">Máquina: {machineId}</p>
            </div>

            {error && (
                <ErrorMessage message={error.message} onRetry={refresh} />
            )}

            <BOMTable
                bomData={bom}
                loading={loading}
                onRefresh={refresh}
            />
        </div>
    );
};
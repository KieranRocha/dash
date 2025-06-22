// src/renderer/src/pages/MachineDetailPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MachineDetailLive } from '../components/machines/MachineDetailLive';

export const MachineDetailPage: React.FC = () => {
    const { projectId, machineId } = useParams();
    const navigate = useNavigate();

    if (!projectId || !machineId) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl text-red-600">Parâmetros inválidos</h1>
                <button
                    onClick={() => navigate('/projects')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Voltar aos Projetos
                </button>
            </div>
        );
    }

    return (
        <MachineDetailLive
            projectId={Number(projectId)}
            machineId={Number(machineId)}
            onBack={() => navigate(`/projects/${projectId}`)}
            onEdit={() => {
                // TODO: Implementar edição
                console.log('Editar máquina', machineId);
            }}
        />
    );
};
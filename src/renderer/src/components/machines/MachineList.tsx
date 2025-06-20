// src/renderer/src/components/machines/MachineList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MachineSummary } from '../../types/machines';
import {
    Settings,
    Calendar,
    Activity,
    Wrench,
    Database,
    PlayCircle,
    Pause,
    CheckCircle2,
    Clock,
    Eye,
    Cog
} from 'lucide-react';

interface MachineListProps {
    machines: MachineSummary[];
    projectId: number;
    loading?: boolean;
}

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Planning':
                return { icon: Clock, bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200', label: 'Planejamento' };
            case 'Design':
                return { icon: Cog, bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200', label: 'Em Projeto' };
            case 'Review':
                return { icon: Eye, bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200', label: 'Em Revisão' };
            case 'Manufacturing':
                return { icon: Wrench, bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Fabricação' };
            case 'Testing':
                return { icon: Activity, bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200', label: 'Teste' };
            case 'Completed':
                return { icon: CheckCircle2, bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200', label: 'Finalizada' };
            default:
                return { icon: Clock, bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200', label: status };
        }
    };

    const { icon: Icon, bgColor, textColor, borderColor, label } = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${bgColor} ${textColor} ${borderColor}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
};

// Machine Card Component
const MachineCard: React.FC<{
    machine: MachineSummary;
    projectId: number;
    onClick: () => void;
}> = ({ machine, projectId, onClick }) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Nunca';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <div
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-all hover:shadow-md group"
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {machine.name}
                    </h3>
                    {machine.operationNumber && (
                        <p className="text-sm text-gray-500 mt-1">
                            OP: {machine.operationNumber}
                        </p>
                    )}
                </div>
                <StatusBadge status={machine.status} />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Database className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">Versões BOM</p>
                        <p className="font-semibold text-sm">{machine.totalBomVersions}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">Última Extração</p>
                        <p className="font-semibold text-sm">{formatDate(machine.lastBomExtraction)}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                    ID: {machine.id}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implementar edição
                        }}
                        className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                        Editar
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Navegar para BOM
                        }}
                        className="text-xs px-2 py-1 text-green-600 hover:bg-green-50 rounded"
                    >
                        Ver BOM
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Component
export const MachineList: React.FC<MachineListProps> = ({ machines, projectId, loading = false }) => {
    const navigate = useNavigate();

    const handleMachineClick = (machine: MachineSummary) => {
        navigate(`/projects/${projectId}/machines/${machine.id}`);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="h-12 bg-gray-200 rounded"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (machines.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma máquina cadastrada</h3>
                <p className="text-gray-500 mb-6">
                    Adicione máquinas ao projeto para começar o controle de produção
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Adicionar Primeira Máquina
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Máquinas ({machines.length})
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Equipamentos e operações do projeto
                    </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    + Nova Máquina
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {machines.map((machine) => (
                    <MachineCard
                        key={machine.id}
                        machine={machine}
                        projectId={projectId}
                        onClick={() => handleMachineClick(machine)}
                    />
                ))}
            </div>
        </div>
    );
};
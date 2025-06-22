// src/renderer/src/components/machines/MachineDetailLive.tsx
import React from 'react';
import {
    ArrowLeft,
    Edit,
    Settings,
    Database,
    Clock,
    FileText,
    Download,
    RefreshCw,
    Wifi,
    WifiOff,
    Activity
} from 'lucide-react';
import { useLiveMachineData } from '../../hooks/useLiveMachineData';
import { SimpleBOMTable } from './SimpleBOMTable';

interface MachineDetailLiveProps {
    projectId: number;
    machineId: number;
    onBack: () => void;
    onEdit?: () => void;
}

export const MachineDetailLive: React.FC<MachineDetailLiveProps> = ({
    projectId,
    machineId,
    onBack,
    onEdit
}) => {
    const {
        machine,
        bomVersions,
        loading,
        error,
        lastUpdate,
        isRealTimeEnabled,
        refresh,
        toggleRealTime
    } = useLiveMachineData(projectId, machineId);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('pt-BR');
    };

    const formatLastUpdate = () => {
        if (!lastUpdate) return '';
        const now = new Date();
        const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);

        if (diff < 60) return 'Agora há pouco';
        if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
        return `há ${Math.floor(diff / 3600)} h`;
    };

    if (loading && !machine) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-64 bg-gray-200 rounded"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-red-800 font-medium">Erro ao carregar máquina</h3>
                    <p className="text-red-600 text-sm mt-1">{error.message}</p>
                    <button
                        onClick={refresh}
                        className="mt-3 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    if (!machine) {
        return (
            <div className="p-8">
                <div className="text-center text-gray-500">
                    Máquina não encontrada
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{machine.name}</h1>
                        <p className="text-gray-600">#{machine.operationNumber || 'N/A'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Status de tempo real */}
                    <div className="flex items-center gap-2 text-sm">
                        {isRealTimeEnabled ? (
                            <Wifi className="w-4 h-4 text-green-500" />
                        ) : (
                            <WifiOff className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={isRealTimeEnabled ? 'text-green-600' : 'text-gray-500'}>
                            {isRealTimeEnabled ? 'Tempo Real' : 'Manual'}
                        </span>
                    </div>

                    {/* Última atualização */}
                    {lastUpdate && (
                        <span className="text-sm text-gray-500">
                            Atualizado {formatLastUpdate()}
                        </span>
                    )}

                    {/* Controles */}
                    <button
                        onClick={toggleRealTime}
                        className={`p-2 rounded-lg transition-colors ${isRealTimeEnabled
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        title={isRealTimeEnabled ? 'Desativar tempo real' : 'Ativar tempo real'}
                    >
                        <Activity className="w-4 h-4" />
                    </button>

                    <button
                        onClick={refresh}
                        disabled={loading}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                        title="Atualizar dados"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            Editar
                        </button>
                    )}
                </div>
            </div>

            {/* Status da máquina */}
            <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Ativa
                </div>
            </div>

            {/* Cards de informações */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Informações Gerais */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Informações Gerais
                    </h3>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Descrição</dt>
                            <dd className="text-sm text-gray-900">{machine.description || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Número da Operação</dt>
                            <dd className="text-sm text-gray-900">{machine.operationNumber || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Pasta do Projeto</dt>
                            <dd className="text-sm text-gray-900 font-mono break-all">{machine.folderPath || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Assembly Principal</dt>
                            <dd className="text-sm text-gray-900 font-mono break-all">{machine.mainAssemblyPath || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                            <dd className="text-sm text-gray-900">{formatDate(machine.createdAt)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Última atualização</dt>
                            <dd className="text-sm text-gray-900">{formatDate(machine.updatedAt)}</dd>
                        </div>
                    </dl>
                </div>

                {/* Estatísticas BOM */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Estatísticas BOM
                    </h3>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Total de Versões</dt>
                            <dd className="text-2xl font-bold text-blue-600">{bomVersions.length}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Última Extração</dt>
                            <dd className="text-sm text-gray-900">{formatDate(machine.lastBomExtraction)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Status da BOM</dt>
                            <dd className="text-sm text-gray-900">
                                {bomVersions.length > 0 ? (
                                    <span className="text-green-600 font-medium">Disponível</span>
                                ) : (
                                    <span className="text-yellow-600 font-medium">Aguardando extração</span>
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Versões Disponíveis</dt>
                            <dd className="text-sm text-gray-900">
                                {bomVersions.length > 0 ? (
                                    <div className="space-y-1">
                                        {bomVersions.slice(0, 3).map((version, index) => (
                                            <div key={index} className="flex justify-between text-xs">
                                                <span>Versão {version.versionNumber}</span>
                                                <span className="text-gray-500">{formatDate(version.extractedAt)}</span>
                                            </div>
                                        ))}
                                        {bomVersions.length > 3 && (
                                            <div className="text-xs text-gray-500">
                                                +{bomVersions.length - 3} versões anteriores
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    'Nenhuma versão disponível'
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Ações */}
            <div className="flex gap-3">

                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Ver BOM Atual

                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Histórico de Versões
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar BOM
                </button>
            </div>
            <SimpleBOMTable
                projectId={projectId}
                machineId={machineId}
                onOpenFile={() => {
                    // lógica para abrir arquivo
                }}
            />
        </div>
    );
};
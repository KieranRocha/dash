// src/renderer/src/pages/MachineDetailPage.tsx - ATUALIZADO
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Settings, FileText, Clock, Download, Package } from 'lucide-react';
import { useLiveMachineData } from '../hooks/useLiveMachineData';
import { ClickableBOMTable } from '../components/machines/ClickableBOMTable'; // ✅ NOVA TABELA
import { ErrorMessage } from '../components/ui/ErrorMessage';

export const MachineDetailPage: React.FC = () => {
    const { projectId, machineId } = useParams<{
        projectId: string;
        machineId: string;
    }>();

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Loading inicial
    if (loading && !machine) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // Erro
    if (error) {
        return (
            <div className="p-6">
                <ErrorMessage message={error.message} onRetry={refresh} />
            </div>
        );
    }

    // Máquina não encontrada
    if (!machine) {
        return (
            <div className="p-6">
                <div className="text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Máquina não encontrada</h3>
                    <p className="text-gray-600 mb-4">
                        A máquina solicitada não foi encontrada ou foi removida.
                    </p>
                    <Link
                        to={`/projects/${projectId}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar ao Projeto
                    </Link>
                </div>
            </div>
        );
    }

    const latestVersion = bomVersions.length > 0 ? bomVersions[0] : null;

    return (
        <div className="p-6 space-y-6">
            {/* Navegação */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        to={`/projects/${projectId}`}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar ao Projeto
                    </Link>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <nav className="flex items-center space-x-2 text-sm text-gray-500">
                        <Link to="/projects" className="hover:text-gray-700">Projetos</Link>
                        <span>/</span>
                        <Link to={`/projects/${projectId}`} className="hover:text-gray-700">
                            Projeto {projectId}
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{machine.name}</span>
                    </nav>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Settings className="w-4 h-4" />
                    Configurações
                </button>
            </div>

            {/* Informações da máquina */}
            <div className="bg-white rounded-lg border">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{machine.name}</h1>
                            <p className="text-gray-600 mt-1">
                                Máquina {machineId} • Projeto {projectId}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                to={`/projects/${projectId}/machines/${machineId}/bom`}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <FileText className="w-4 h-4" />
                                Ver BOM Completo
                            </Link>
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Histórico de Versões
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Status da BOM</dt>
                            <dd className="text-sm text-gray-900 mt-1">
                                {latestVersion ? (
                                    <span className="text-green-600 font-medium">
                                        V{latestVersion.versionNumber} Disponível
                                    </span>
                                ) : (
                                    <span className="text-yellow-600 font-medium">Aguardando extração</span>
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Última Extração</dt>
                            <dd className="text-sm text-gray-900 mt-1">
                                {latestVersion ? (
                                    <div>
                                        <div>{formatDate(latestVersion.extractedAt)}</div>
                                        <div className="text-xs text-gray-500">por {latestVersion.extractedBy}</div>
                                    </div>
                                ) : (
                                    'Nunca extraído'
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Versões Disponíveis</dt>
                            <dd className="text-sm text-gray-900 mt-1">
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

            {/* ✅ NOVA: BOM Table com part numbers clicáveis */}
            <ClickableBOMTable
                projectId={parseInt(projectId!, 10)}
                machineId={parseInt(machineId!, 10)}
                bomVersions={bomVersions}
                loading={loading}
                onOpenFile={(filePath) => {
                    // Implementar lógica para abrir arquivo se necessário
                    console.log('Abrir arquivo:', filePath);
                }}
            />

            {/* Estatísticas resumidas */}
            {latestVersion && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Total de Itens</p>
                                <p className="text-2xl font-bold text-gray-900">{latestVersion.items.length}</p>
                            </div>
                            <Package className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Peças Únicas</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Set(latestVersion.items.map(i => i.partNumber)).size}
                                </p>
                            </div>
                            <FileText className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Versão Atual</p>
                                <p className="text-2xl font-bold text-gray-900">V{latestVersion.versionNumber}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Níveis de Assembly</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {Math.max(...latestVersion.items.map(i => i.level || 0)) + 1}
                                </p>
                            </div>
                            <Download className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
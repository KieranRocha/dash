import React from 'react';
import { useProjects } from '../hooks/useAPI';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorMessage } from './ui/ErrorMessage';

export const ProjectList: React.FC = () => {
    const { projects, loading, error } = useProjects();

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error.message} />;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Planning': return 'bg-blue-100 text-blue-800';
            case 'OnHold': return 'bg-yellow-100 text-yellow-800';
            case 'Review': return 'bg-orange-100 text-orange-800';
            case 'Completed': return 'bg-gray-100 text-gray-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (value?: number) => {
        if (!value) return 'N/A';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Projetos ({projects.length})</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Novo Projeto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                    >
                        {/* Header do Projeto */}
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                                {project.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                {project.status}
                            </span>
                        </div>

                        {/* Informações do Projeto */}
                        <div className="space-y-2 mb-4">
                            {project.contractNumber && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Contrato:</span> {project.contractNumber}
                                </p>
                            )}

                            {project.client && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Cliente:</span> {project.client}
                                </p>
                            )}

                            {project.responsibleEngineer && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Responsável:</span> {project.responsibleEngineer}
                                </p>
                            )}
                        </div>

                        {/* Progresso */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Progresso</span>
                                <span>{project.progressPercentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${Math.min(project.progressPercentage, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Métricas */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                                <p className="text-gray-500">Máquinas</p>
                                <p className="font-semibold">{project.machineCount}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Orçamento</p>
                                <p className="font-semibold">{formatCurrency(project.budgetValue)}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-3 border-t border-gray-100">
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>
                                    Criado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                                </span>
                                {project.lastActivity && (
                                    <span>
                                        Ativo {new Date(project.lastActivity).toLocaleDateString('pt-BR')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📁</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto encontrado</h3>
                    <p className="text-gray-500 mb-6">Comece criando seu primeiro projeto</p>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Criar Primeiro Projeto
                    </button>
                </div>
            )}
        </div>
    );
};
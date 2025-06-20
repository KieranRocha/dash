import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects, useProjectOperations } from '../hooks/useAPI';

import {
    Search, Plus, Calendar, AlertTriangle, PlayCircle, Clock, Pause, Eye, CheckCircle2, XCircle, Edit, Trash2
} from 'lucide-react';

// --- Componentes Internos para a Tabela ---

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Active': return { icon: PlayCircle, bgColor: 'bg-green-100', textColor: 'text-green-800', label: 'Ativo' };
            case 'Planning': return { icon: Clock, bgColor: 'bg-blue-100', textColor: 'text-blue-800', label: 'Planejamento' };
            case 'OnHold': return { icon: Pause, bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', label: 'Pausado' };
            case 'Review': return { icon: Eye, bgColor: 'bg-orange-100', textColor: 'text-orange-800', label: 'Em Revisão' };
            case 'Completed': return { icon: CheckCircle2, bgColor: 'bg-gray-200', textColor: 'text-gray-800', label: 'Concluído' };
            case 'Cancelled': return { icon: XCircle, bgColor: 'bg-red-100', textColor: 'text-red-800', label: 'Cancelado' };
            default: return { icon: Clock, bgColor: 'bg-gray-100', textColor: 'text-gray-700', label: status };
        }
    };
    const { icon: Icon, bgColor, textColor, label } = getStatusConfig(status);
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
};

const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
    const colorClass = value >= 90 ? 'bg-green-500' : value >= 70 ? 'bg-blue-500' : value >= 40 ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className={`${colorClass} h-1.5 rounded-full`} style={{ width: `${value}%` }} />
        </div>
    );
};

// --- Componente Principal da Página ---

export const ProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const { projects = [], loading, error, refetch } = useProjects();
    const { deleteProject, loading: deleteLoading } = useProjectOperations();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredProjects = useMemo(() => projects.filter(project =>
        (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.client?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'all' || project.status === statusFilter)
    ), [projects, searchTerm, statusFilter]);

    const uniqueStatuses = useMemo(() => [...new Set(projects.map(p => p.status))], [projects]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    if (error && !projects.length) {
        return <div className="p-6 text-center">Erro ao carregar os projetos: {error.message}</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Cabeçalho e Filtros */}
            <div className="mb-4">

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-600" />
                        </div>

                        <input
                            type="text"
                            placeholder="Pesquisar por nome, contrato ou cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 text-gray-800 bg-white border border-gray-200 rounded-lg placeholder:text-gray-500 transition-all duration-300 ease-in-out shadow-sm hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />

                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    >
                        <option value="all">Todos os status</option>
                        {uniqueStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <button onClick={() => navigate('/projects/new')} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        Novo Projeto
                    </button>
                </div>

            </div>

            {/* Tabela de Projetos */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto / Contrato</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prazo Final</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading && (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
                                    </tr>
                                ))
                            )}
                            {!loading && filteredProjects.map(project => {
                                const isOverdue = project.endDate && new Date(project.endDate) < new Date() && project.status !== 'Completed';
                                return (
                                    <tr key={project.id} onClick={() => navigate(`/projects/${project.id}`)} className="hover:bg-gray-50 cursor-pointer group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</div>
                                            <div className="text-xs text-gray-500">{project.contractNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={project.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <ProgressBar value={project.progressPercentage} />
                                                <span className="text-sm font-semibold text-gray-600 w-10 text-right">{project.progressPercentage.toFixed(0)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{project.client || '–'}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                                            <div className="flex items-center gap-1.5">
                                                {isOverdue && <AlertTriangle className="w-4 h-4" />}
                                                {formatDate(project.endDate)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                                <button onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}/edit`); }} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"><Edit className="w-4 h-4" /></button>
                                                <button onClick={(e) => { e.stopPropagation(); /* onDelete(project) */ }} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {!loading && filteredProjects.length === 0 && (
                    <div className="text-center py-16">
                        <h3 className="text-lg font-medium text-gray-900">Nenhum projeto encontrado</h3>
                        <p className="text-gray-500 mt-1">Tente ajustar seus filtros de busca ou crie um novo projeto.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects, useProjectOperations } from '../hooks/useAPI';

import {
    Search, Plus, Calendar, AlertTriangle, PlayCircle, Clock, Pause, Eye, CheckCircle2, XCircle, Edit, Trash2, ChevronUp, ChevronDown, Filter, MoreHorizontal, DollarSign
} from 'lucide-react';

// --- Componentes Internos para a Tabela ---

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Active': return { icon: PlayCircle, bgColor: 'bg-green-100', textColor: 'text-green-800', label: 'Ativo' };
            case 'Planning': return { icon: Clock, bgColor: 'bg-blue-100', textColor: 'text-blue-800', label: 'Planejamento' };
            case 'OnHold': return { icon: Pause, bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', label: 'Pausado' };
            case 'Review': return { icon: Eye, bgColor: 'bg-purple-100', textColor: 'text-purple-800', label: 'Revisão' };
            case 'Completed': return { icon: CheckCircle2, bgColor: 'bg-gray-200', textColor: 'text-gray-800', label: 'Concluído' };
            case 'Cancelled': return { icon: XCircle, bgColor: 'bg-red-100', textColor: 'text-red-800', label: 'Cancelado' };
            default: return { icon: Clock, bgColor: 'bg-gray-100', textColor: 'text-gray-700', label: status };
        }
    };
    const { icon: Icon, bgColor, textColor, label } = getStatusConfig(status);
    return (
        <span className={`inline-flex px-2 py-0.5 text-sm font-medium rounded-full ${bgColor} ${textColor}`}>
            {label}
        </span>
    );
};

const ProgressBar: React.FC<{ value: number; isOverdue?: boolean }> = ({ value, isOverdue }) => {
    const colorClass = isOverdue ? 'bg-red-500' :
        value >= 75 ? 'bg-green-500' :
            value >= 50 ? 'bg-yellow-500' : 'bg-blue-500';
    return (
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`${colorClass} h-2 rounded-full transition-all`} style={{ width: `${Math.min(value, 100)}%` }} />
        </div>
    );
};

const BudgetIndicator: React.FC<{ budgetValue?: number; actualCost?: number; budgetVariance?: number }> = ({
    budgetValue, actualCost, budgetVariance
}) => {
    if (!budgetValue || !actualCost) return <span className="text-gray-400 text-sm">-</span>;

    const percentage = (actualCost / budgetValue) * 100;
    const isOverBudget = budgetVariance && budgetVariance > 0;

    return (
        <div className="flex items-center gap-1 text-sm">
            <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                {percentage.toFixed(0)}%
            </span>
            {isOverBudget && <span className="text-red-500">⚠</span>}
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
    const [sortField, setSortField] = useState('lastActivity');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [showFilters, setShowFilters] = useState(false);
    console.log(projects);
    const formatCurrency = (value?: number) => {
        if (!value) return '-';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0
        }).format(value);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    };

    const formatRelativeTime = (dateString?: string) => {
        if (!dateString) return '-';
        const now = new Date();
        const date = new Date(dateString);
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoje';
        if (diffDays === 1) return 'Ontem';
        if (diffDays < 7) return `${diffDays}d atrás`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem atrás`;
        return formatDate(dateString);
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredAndSortedProjects = useMemo(() => {
        let filtered = projects.filter(project => {
            const matchesSearch = searchTerm === '' ||
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.responsibleEngineer?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        return filtered.sort((a: any, b: any) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue?.toLowerCase() || '';
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [projects, searchTerm, statusFilter, sortField, sortDirection]);

    const uniqueStatuses = useMemo(() => [...new Set(projects.map(p => p.status))], [projects]);

    const SortButton: React.FC<{ field: string; children: React.ReactNode }> = ({ field, children }) => (
        <button
            onClick={() => handleSort(field)}
            className="flex items-center gap-1 hover:bg-gray-50 px-2 py-1 rounded text-left w-full"
        >
            {children}
            {sortField === field && (
                sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
            )}
        </button>
    );

    if (error && !projects.length) {
        return <div className="p-6 text-center">Erro ao carregar os projetos: {error.message}</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Projetos ({filteredAndSortedProjects.length})
                </h1>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar projetos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            Filtros
                        </button>
                    </div>

                    {/* New Project Button */}
                    <button
                        onClick={() => navigate('/projects/new')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Projeto
                    </button>
                </div>

                {/* Filters Row */}
                {showFilters && (
                    <div className="mt-3 flex items-center gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">Todos os Status</option>
                            {uniqueStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left p-3 font-semibold text-gray-700 w-60">
                                    <SortButton field="name">Projeto</SortButton>
                                </th>
                                <th className="text-left p-3 font-semibold text-gray-700 w-24">
                                    <SortButton field="status">Status</SortButton>
                                </th>
                                <th className="text-left p-3 font-semibold text-gray-700 w-32">
                                    <SortButton field="client">Cliente</SortButton>
                                </th>
                                <th className="text-left p-3 font-semibold text-gray-700 w-28">
                                    <SortButton field="responsibleEngineer">Responsável</SortButton>
                                </th>
                                <th className="text-left p-3 font-semibold text-gray-700 w-24">
                                    <SortButton field="progressPercentage">Progresso</SortButton>
                                </th>
                                <th className="text-right p-3 font-semibold text-gray-700 w-24">
                                    <SortButton field="budgetValue">Orçamento</SortButton>
                                </th>
                                <th className="text-right p-3 font-semibold text-gray-700 w-20">
                                    <SortButton field="actualHours">Horas</SortButton>
                                </th>
                                <th className="text-center p-3 font-semibold text-gray-700 w-16">
                                    <SortButton field="machineCount">Máq.</SortButton>
                                </th>
                                <th className="text-center p-3 font-semibold text-gray-700 w-16">
                                    <SortButton field="totalBomVersions">BOMs</SortButton>
                                </th>
                                <th className="text-left p-3 font-semibold text-gray-700 w-20">
                                    <SortButton field="endDate">Prazo</SortButton>
                                </th>
                                <th className="text-left p-3 font-semibold text-gray-700 w-20">
                                    <SortButton field="lastActivity">Última Ativ.</SortButton>
                                </th>
                                <th className="text-center p-3 font-semibold text-gray-700 w-16">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {[...Array(12)].map((_, j) => (
                                            <td key={j} className="p-3">
                                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}

                            {!loading && filteredAndSortedProjects.map(project => {
                                const isOverdue = project.endDate && new Date(project.endDate) < new Date() && project.status !== 'Completed';

                                return (
                                    <tr
                                        key={project.id}
                                        onClick={() => navigate(`/projects/${project.id}`)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors group"
                                    >
                                        {/* Projeto */}
                                        <td className="p-3">
                                            <div>
                                                <div className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                    {project.name}
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    {project.contractNumber || '-'}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="p-3">
                                            <StatusBadge status={project.status} />
                                        </td>

                                        {/* Cliente */}
                                        <td className="p-3">
                                            <div className="text-gray-900 truncate">{project.client || '-'}</div>
                                        </td>

                                        {/* Responsável */}
                                        <td className="p-3">
                                            <div className="text-gray-700 truncate">{project.responsibleEngineer || '-'}</div>
                                        </td>

                                        {/* Progresso */}
                                        <td className="p-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">{project.progressPercentage?.toFixed(0) || 0}%</span>
                                                    {isOverdue && <span className="text-red-500">⚠</span>}
                                                </div>
                                                <ProgressBar value={project.progressPercentage || 0} isOverdue={isOverdue} />
                                            </div>
                                        </td>

                                        {/* Orçamento */}
                                        <td className="p-3 text-right">
                                            <div className="space-y-1">
                                                <div className="font-medium text-gray-900">
                                                    {formatCurrency(project.budgetValue)}
                                                </div>
                                                <BudgetIndicator
                                                    budgetValue={project.budgetValue}
                                                    actualCost={project.actualCost}
                                                    budgetVariance={project.budgetVariance}
                                                />
                                            </div>
                                        </td>

                                        {/* Horas */}
                                        <td className="p-3 text-right">
                                            <div className="space-y-1">
                                                <div className="font-medium">{project.actualHours || 0}</div>
                                                <div className="text-sm text-gray-500">/{project.estimatedHours || 0}h</div>
                                            </div>
                                        </td>

                                        {/* Máquinas */}
                                        <td className="p-3 text-center">
                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">
                                                {project.machineCount || 0}
                                            </span>
                                        </td>

                                        {/* BOMs */}
                                        <td className="p-3 text-center">
                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 text-sm font-bold rounded-full">
                                                {project.totalBomVersions || 0}
                                            </span>
                                        </td>

                                        {/* Prazo */}
                                        <td className="p-3">
                                            <div className={`text-sm flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                                                {isOverdue && <AlertTriangle className="w-3 h-3" />}
                                                {formatDate(project.endDate)}
                                            </div>
                                        </td>

                                        {/* Última Atividade */}
                                        <td className="p-3">
                                            <div className="text-sm text-gray-600">
                                                {formatRelativeTime(project.lastActivity)}
                                            </div>
                                        </td>

                                        {/* Ações */}
                                        <td className="p-3">
                                            <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="flex">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/projects/${project.id}/edit`);
                                                        }}
                                                        className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm('Deseja excluir este projeto?')) {
                                                                deleteProject(project.id);
                                                            }
                                                        }}
                                                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                                                        title="Excluir"
                                                        disabled={deleteLoading}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {!loading && filteredAndSortedProjects.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <div className="text-sm">Nenhum projeto encontrado</div>
                        <div className="text-sm mt-1">Tente ajustar os filtros de busca ou crie um novo projeto</div>
                    </div>
                )}
            </div>
        </div>
    );
};
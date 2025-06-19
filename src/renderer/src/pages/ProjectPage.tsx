import React, { useState, useMemo } from 'react';
import { useProjects, useProjectOperations } from '../hooks/useAPI';
import { ProjectSummary } from '../types/index';
import { Search, Plus, Calendar, DollarSign, Users, Clock, AlertTriangle, CheckCircle2, Pause, PlayCircle, XCircle, Eye } from 'lucide-react';

// Simulação do componente Link para demonstração
const Link = ({ to, children, className }: { to: string, children: React.ReactNode, className?: string }) => (
    <a href={to} className={className}>{children}</a>
);

// Componente de Loading Skeleton
const ProjectCardSkeleton = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 animate-pulse">
        <div className="flex justify-between items-start mb-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="h-2 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
        </div>
    </div>
);

// Componente de Status Badge
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Active':
                return { icon: PlayCircle, bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Ativo' };
            case 'Planning':
                return { icon: Clock, bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200', label: 'Planejamento' };
            case 'OnHold':
                return { icon: Pause, bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200', label: 'Pausado' };
            case 'Review':
                return { icon: Eye, bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200', label: 'Em Revisão' };
            case 'Completed':
                return { icon: CheckCircle2, bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200', label: 'Concluído' };
            case 'Cancelled':
                return { icon: XCircle, bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', label: 'Cancelado' };
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

// Componente de Card de Projeto
const ProjectCard: React.FC<{
    project: ProjectSummary;
    onDelete: (project: ProjectSummary) => void;
}> = ({ project, onDelete }) => {
    const formatCurrency = (value?: number) => {
        if (!value) return 'N/A';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const isOverdue = project.endDate && new Date(project.endDate) < new Date() && project.status !== 'Completed';

    return (
        <div className={`bg-white p-6 rounded-lg border transition-all hover:shadow-md group ${isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-blue-300'
            }`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="min-w-0 flex-1">
                    <Link
                        to={`/projects/${project.id}`}
                        className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors leading-tight block"
                    >
                        {project.name}
                    </Link>
                    {project.contractNumber && (
                        <p className="text-sm text-gray-500 mt-1">
                            Contrato: {project.contractNumber}
                        </p>
                    )}
                </div>
                <StatusBadge status={project.status} />
            </div>

            {/* Info Section */}
            <div className="space-y-2 mb-4">
                {project.client && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{project.client}</span>
                    </div>
                )}

                {project.endDate && (
                    <div className={`flex items-center gap-2 text-sm ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                        <Calendar className="w-4 h-4" />
                        <span>Prazo: {formatDate(project.endDate)}</span>
                        {isOverdue && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progresso</span>
                    <span>{project.progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all ${project.progressPercentage >= 90 ? 'bg-green-600' :
                                project.progressPercentage >= 70 ? 'bg-blue-600' :
                                    project.progressPercentage >= 50 ? 'bg-yellow-600' : 'bg-gray-400'
                            }`}
                        style={{ width: `${Math.min(project.progressPercentage, 100)}%` }}
                    />
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-gray-500">Máquinas</p>
                        <p className="font-semibold">{project.machineCount}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                        <p className="text-gray-500">Última atividade</p>
                        <p className="font-semibold text-xs">
                            {project.lastActivity ? formatDate(project.lastActivity) : 'Nunca'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                    Criado em {formatDate(project.createdAt)}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                        to={`/projects/${project.id}/edit`}
                        className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                        Editar
                    </Link>
                    <button
                        onClick={() => onDelete(project)}
                        className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

// Modal de Confirmação de Exclusão
const DeleteConfirmationModal: React.FC<{
    project: ProjectSummary | null;
    isLoading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ project, isLoading, onConfirm, onCancel }) => {
    if (!project) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Confirmar Exclusão</h3>
                        <p className="text-sm text-gray-500">Esta ação não pode ser desfeita</p>
                    </div>
                </div>

                <p className="text-gray-700 mb-6">
                    Tem certeza que deseja excluir o projeto <strong>"{project.name}"</strong>?
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                        {isLoading ? 'Excluindo...' : 'Excluir'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente Principal
export const ProjectsPage: React.FC = () => {
    const { projects, loading, error, refetch } = useProjects();
    const { deleteProject, loading: deleteLoading } = useProjectOperations();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [projectToDelete, setProjectToDelete] = useState<ProjectSummary | null>(null);

    const filteredProjects = useMemo(() => {
        if (!projects) return [];

        return projects.filter(project => {
            const matchesSearch = (
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (project.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (project.client?.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [projects, searchTerm, statusFilter]);

    const handleDeleteClick = (project: ProjectSummary) => {
        setProjectToDelete(project);
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;

        try {
            await deleteProject(projectToDelete.id);
            setProjectToDelete(null);
            refetch();
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
            // Toast notification seria ideal aqui
        }
    };

    const uniqueStatuses = useMemo(() => {
        if (!projects) return [];
        return [...new Set(projects.map(p => p.status))];
    }, [projects]);

    if (error && !projects.length) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar projetos</h3>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <button
                        onClick={refetch}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
                    <p className="text-gray-600 mt-1">
                        {loading ? 'Carregando...' : `${filteredProjects.length} de ${projects.length} projetos`}
                    </p>
                </div>
                <Link
                    to="/projects/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Novo Projeto
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Pesquisar por nome, contrato ou cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">Todos os status</option>
                    {uniqueStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {/* Projects Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <ProjectCardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm || statusFilter !== 'all' ? 'Nenhum projeto encontrado' : 'Nenhum projeto ainda'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm || statusFilter !== 'all'
                            ? 'Tente ajustar os filtros para encontrar o que procura'
                            : 'Comece criando seu primeiro projeto'
                        }
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                        <Link
                            to="/projects/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Criar Primeiro Projeto
                        </Link>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                project={projectToDelete}
                isLoading={deleteLoading}
                onConfirm={confirmDelete}
                onCancel={() => setProjectToDelete(null)}
            />
        </div>
    );
};
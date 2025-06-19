import React, { useState } from 'react';
import { useProject, useProjectOperations } from '../hooks/useAPI';
import { Project, UpdateProject } from '../types/index';
import {
    ArrowLeft,
    Edit,
    Save,
    X,
    Calendar,
    DollarSign,
    User,
    Building,
    FolderOpen,
    Clock,
    Target,
    AlertTriangle,
    CheckCircle2,
    Pause,
    PlayCircle,
    XCircle,
    Eye,
    TrendingUp,
    TrendingDown
} from 'lucide-react';

// Simulação de useParams e navegação
const useParams = () => ({ projectId: '1' });
const useNavigate = () => ({ push: (path: string) => console.log('Navigate to:', path) });

// Status Badge Component
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
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border ${bgColor} ${textColor} ${borderColor}`}>
            <Icon className="w-4 h-4" />
            {label}
        </span>
    );
};

// Metric Card Component
const MetricCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
    trend?: { value: number; isPositive: boolean };
    subtitle?: string;
}> = ({ title, value, icon: Icon, color, trend, subtitle }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        red: 'bg-red-50 text-red-600',
        gray: 'bg-gray-50 text-gray-600',
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                    </div>
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// Edit Modal Component
const EditProjectModal: React.FC<{
    project: Project;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: UpdateProject) => Promise<void>;
    loading: boolean;
}> = ({ project, isOpen, onClose, onSave, loading }) => {
    const [formData, setFormData] = useState<UpdateProject>({
        name: project.name,
        contractNumber: project.contractNumber,
        description: project.description,
        client: project.client,
        responsibleEngineer: project.responsibleEngineer,
        startDate: project.startDate,
        endDate: project.endDate,
        budgetValue: project.budgetValue,
        estimatedHours: project.estimatedHours,
        status: project.status,
        progressPercentage: project.progressPercentage,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const parsedValue = ['budgetValue', 'estimatedHours', 'progressPercentage'].includes(name) ?
            (value ? Number(value) : undefined) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = async () => {
        await onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-90vh overflow-y-auto">
                <div>
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Editar Projeto</h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contrato</label>
                                <input
                                    type="text"
                                    name="contractNumber"
                                    value={formData.contractNumber || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                                <input
                                    type="text"
                                    name="client"
                                    value={formData.client || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Planning">Planejamento</option>
                                    <option value="Active">Ativo</option>
                                    <option value="OnHold">Pausado</option>
                                    <option value="Review">Em Revisão</option>
                                    <option value="Completed">Concluído</option>
                                    <option value="Cancelled">Cancelado</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Progresso (%)</label>
                                <input
                                    type="number"
                                    name="progressPercentage"
                                    value={formData.progressPercentage || ''}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                                <input
                                    type="text"
                                    name="responsibleEngineer"
                                    value={formData.responsibleEngineer || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate?.split('T')[0] || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate?.split('T')[0] || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Orçamento (R$)</label>
                                <input
                                    type="number"
                                    name="budgetValue"
                                    value={formData.budgetValue || ''}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Horas Estimadas</label>
                                <input
                                    type="number"
                                    name="estimatedHours"
                                    value={formData.estimatedHours || ''}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Component
export const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { project, loading, error, refetch } = useProject(projectId);
    const { updateProject, loading: updateLoading } = useProjectOperations();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const formatCurrency = (value?: number) => {
        if (!value) return 'N/A';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const handleEdit = async (data: UpdateProject) => {
        if (!project) return;

        try {
            await updateProject(project.id, data);
            setIsEditModalOpen(false);
            refetch();
        } catch (error) {
            console.error('Erro ao atualizar projeto:', error);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar projeto</h3>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center py-16">
                <h3 className="text-lg font-medium text-gray-900">Projeto não encontrado</h3>
            </div>
        );
    }

    const isOverdue = project.endDate && new Date(project.endDate) < new Date() && project.status !== 'Completed';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Projetos
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                        <StatusBadge status={project.status} />
                    </div>

                    {project.contractNumber && (
                        <p className="text-lg text-gray-600 mb-2">Contrato: {project.contractNumber}</p>
                    )}

                    {project.description && (
                        <p className="text-gray-600 max-w-3xl">{project.description}</p>
                    )}
                </div>

                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                >
                    <Edit className="w-4 h-4" />
                    Editar
                </button>
            </div>

            {/* Progress Bar */}
            <div className={`p-4 rounded-lg border ${isOverdue ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progresso do Projeto</span>
                    <span className="text-sm font-semibold text-gray-900">{project.progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all ${project.progressPercentage >= 90 ? 'bg-green-600' :
                            project.progressPercentage >= 70 ? 'bg-blue-600' :
                                project.progressPercentage >= 50 ? 'bg-yellow-600' : 'bg-gray-400'
                            }`}
                        style={{ width: `${Math.min(project.progressPercentage, 100)}%` }}
                    />
                </div>
                {isOverdue && (
                    <div className="flex items-center gap-2 mt-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Projeto em atraso</span>
                    </div>
                )}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                    title="Orçamento"
                    value={formatCurrency(project.budgetValue)}
                    icon={DollarSign}
                    color="green"
                    subtitle={project.actualCost ? `Gasto: ${formatCurrency(project.actualCost)}` : undefined}
                    trend={project.budgetVariance ? {
                        value: Math.abs(project.budgetVariance),
                        isPositive: project.budgetVariance <= 0
                    } : undefined}
                />

                <MetricCard
                    title="Horas"
                    value={`${project.actualHours} / ${project.estimatedHours}`}
                    icon={Clock}
                    color="blue"
                    subtitle="Trabalhadas / Estimadas"
                    trend={project.hourVariance ? {
                        value: Math.abs(project.hourVariance),
                        isPositive: project.hourVariance <= 0
                    } : undefined}
                />

                <MetricCard
                    title="Máquinas"
                    value={project.machineCount}
                    icon={Target}
                    color="gray"
                />

                <MetricCard
                    title="Versões BOM"
                    value={project.totalBomVersions}
                    icon={FolderOpen}
                    color="yellow"
                />

                <MetricCard
                    title="Prazo"
                    value={formatDate(project.endDate)}
                    icon={Calendar}
                    color={isOverdue ? "red" : "blue"}
                />

                <MetricCard
                    title="Última Atividade"
                    value={formatDate(project.lastActivity)}
                    icon={Clock}
                    color="gray"
                />
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Informações Gerais
                    </h3>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                            <dd className="text-sm text-gray-900">{project.client || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Engenheiro Responsável</dt>
                            <dd className="text-sm text-gray-900">{project.responsibleEngineer || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Pasta do Projeto</dt>
                            <dd className="text-sm text-gray-900 font-mono">{project.folderPath || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                            <dd className="text-sm text-gray-900">{formatDate(project.createdAt)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Última atualização</dt>
                            <dd className="text-sm text-gray-900">{formatDate(project.updatedAt)}</dd>
                        </div>
                    </dl>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Cronograma
                    </h3>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Data de Início</dt>
                            <dd className="text-sm text-gray-900">{formatDate(project.startDate)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Data de Término</dt>
                            <dd className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                {formatDate(project.endDate)}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Duração do Projeto</dt>
                            <dd className="text-sm text-gray-900">
                                {project.startDate && project.endDate ?
                                    `${Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))} dias`
                                    : 'N/A'}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Edit Modal */}
            <EditProjectModal
                project={project}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleEdit}
                loading={updateLoading}
            />
        </div>
    );
};
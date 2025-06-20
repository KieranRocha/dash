// src/renderer/src/pages/ProjectDetailPage.tsx - CORRIGIDO
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject, useProjectOperations } from '../hooks/useAPI';
import { useMachines } from '../hooks/useMachines'; // ✅ ADICIONADO
import { MachineList } from '../components/machines/MachineList'; // ✅ ADICIONADO
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
    TrendingDown,
    Settings, // ✅ ADICIONADO
    Wrench   // ✅ ADICIONADO
} from 'lucide-react';

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

// Edit Modal Component (mantém a implementação existente)
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
            (value ? parseFloat(value) : undefined) : value;

        setFormData(prev => ({
            ...prev,
            [name]: parsedValue
        }));
    };

    const handleSubmit = async () => {
        await onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">Editar Projeto</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Número do Contrato</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Engenheiro Responsável</label>
                            <input
                                type="text"
                                name="responsibleEngineer"
                                value={formData.responsibleEngineer || ''}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate || ''}
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
    );
};

// ✅ COMPONENTE PRINCIPAL COM CORREÇÕES
export const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { project, loading, error, refetch } = useProject(projectId);
    const { updateProject, loading: updateLoading } = useProjectOperations();

    // ✅ ADICIONADO: Hook para buscar máquinas
    const { machines, loading: machinesLoading, error: machinesError, refetch: refetchMachines } = useMachines(Number(projectId));

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'machines' | 'timeline' | 'files'>('overview'); // ✅ ADICIONADO

    const formatCurrency = (value?: number) => {
        if (!value && value !== 0) return 'N/A';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const handleEditProject = async (data: UpdateProject) => {
        try {
            await updateProject(Number(projectId), data);
            await refetch();
        } catch (error) {
            console.error('Erro ao atualizar projeto:', error);
        }
    };

    const handleBack = () => {
        navigate('/projects');
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar projeto</h3>
                    <p className="text-gray-600 mb-4">{error?.message || 'Projeto não encontrado'}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => refetch()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Tentar Novamente
                        </button>
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <button
                        onClick={handleBack}
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

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Progresso"
                    value={`${project.progressPercentage}%`}
                    icon={Target}
                    color="blue"
                />
                <MetricCard
                    title="Máquinas"
                    value={project.machineCount}
                    icon={Settings}
                    color="green"
                    subtitle={`${machines.length} carregadas`}
                />
                <MetricCard
                    title="Orçamento"
                    value={formatCurrency(project.budgetValue)}
                    icon={DollarSign}
                    color="yellow"
                />
                <MetricCard
                    title="Horas Estimadas"
                    value={project.estimatedHours}
                    icon={Clock}
                    color="gray"
                />
            </div>

            {/* ✅ ADICIONADO: Sistema de Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Visão Geral
                    </button>
                    <button
                        onClick={() => setActiveTab('machines')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'machines'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Wrench className="w-4 h-4 inline mr-2" />
                        Máquinas ({machines.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('timeline')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'timeline'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Timeline
                    </button>
                    <button
                        onClick={() => setActiveTab('files')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'files'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Arquivos
                    </button>
                </nav>
            </div>

            {/* ✅ ADICIONADO: Conteúdo das Tabs */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            Informações do Projeto
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
                        </dl>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Cronograma e Financeiro
                        </h3>
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Data de Início</dt>
                                <dd className="text-sm text-gray-900">{formatDate(project.startDate)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Data de Término</dt>
                                <dd className="text-sm text-gray-900">{formatDate(project.endDate)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                                <dd className="text-sm text-gray-900">{formatDate(project.createdAt)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Última Atualização</dt>
                                <dd className="text-sm text-gray-900">{formatDate(project.updatedAt)}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            )}

            {/* ✅ ABA DE MÁQUINAS - AQUI ESTÁ A SOLUÇÃO! */}
            {activeTab === 'machines' && (
                <div className="space-y-6">
                    {machinesError ? (
                        <div className="text-center py-8">
                            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar máquinas</h3>
                            <p className="text-gray-600 mb-4">{machinesError.message}</p>
                            <button
                                onClick={() => refetchMachines()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    ) : (
                        <MachineList
                            machines={machines}
                            projectId={Number(projectId)}
                            loading={machinesLoading}
                        />
                    )}
                </div>
            )}

            {activeTab === 'timeline' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline do Projeto</h3>
                    <p className="text-gray-500">Timeline em desenvolvimento...</p>
                </div>
            )}

            {activeTab === 'files' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FolderOpen className="w-5 h-5" />
                        Arquivos do Projeto
                    </h3>
                    <p className="text-gray-500">Gerenciamento de arquivos em desenvolvimento...</p>
                </div>
            )}

            {/* Edit Modal */}
            <EditProjectModal
                project={project}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleEditProject}
                loading={updateLoading}
            />
        </div>
    );
};
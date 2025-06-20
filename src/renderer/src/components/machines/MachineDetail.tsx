// src/renderer/src/components/machines/MachineDetail.tsx
import React, { useState } from 'react';
import { ArrowLeft, Edit, Settings, Database, Calendar, User, FolderOpen, Clock, FileText, Download } from 'lucide-react';
import { Machine } from '../../types/machines';

// Interface para BOM genérico (será substituído depois)
interface GenericBOMItem {
    id: string;
    level: number;
    partNumber: string;
    description: string;
    quantity: number;
    unit: string;
    material?: string;
    mass?: number;
    category: 'fabricado' | 'comprado' | 'normalizado';
}

interface MachineDetailProps {
    machine: Machine;
    loading?: boolean;
    onBack: () => void;
    onEdit?: () => void;
}

// BOM genérico para demonstração
const generateGenericBOM = (machineName: string): GenericBOMItem[] => {
    return [
        {
            id: '1',
            level: 0,
            partNumber: `${machineName.replace(/\s+/g, '_').toUpperCase()}_ASSY`,
            description: `Conjunto Principal - ${machineName}`,
            quantity: 1,
            unit: 'UN',
            material: 'MONTAGEM',
            category: 'fabricado'
        },
        {
            id: '2',
            level: 1,
            partNumber: 'BASE_001',
            description: 'Base Principal Soldada',
            quantity: 1,
            unit: 'UN',
            material: 'AISI 1020',
            mass: 25.5,
            category: 'fabricado'
        },
        {
            id: '3',
            level: 1,
            partNumber: 'CARCACA_002',
            description: 'Carcaça Superior',
            quantity: 1,
            unit: 'UN',
            material: 'AISI 1045',
            mass: 12.3,
            category: 'fabricado'
        },
        {
            id: '4',
            level: 2,
            partNumber: 'CHAPA_LATERAL_003',
            description: 'Chapa Lateral Esquerda',
            quantity: 1,
            unit: 'UN',
            material: 'AISI 1020 #3mm',
            mass: 2.8,
            category: 'fabricado'
        },
        {
            id: '5',
            level: 2,
            partNumber: 'CHAPA_LATERAL_004',
            description: 'Chapa Lateral Direita',
            quantity: 1,
            unit: 'UN',
            material: 'AISI 1020 #3mm',
            mass: 2.8,
            category: 'fabricado'
        },
        {
            id: '6',
            level: 1,
            partNumber: 'MOTOR_WEG_1CV',
            description: 'Motor Elétrico WEG 1CV 220V',
            quantity: 1,
            unit: 'UN',
            material: 'COMERCIAL',
            mass: 8.5,
            category: 'comprado'
        },
        {
            id: '7',
            level: 1,
            partNumber: 'ROLAMENTO_6204',
            description: 'Rolamento 6204 2RS',
            quantity: 4,
            unit: 'UN',
            material: 'AÇO',
            mass: 0.3,
            category: 'comprado'
        },
        {
            id: '8',
            level: 1,
            partNumber: 'PARAFUSO_M8X25',
            description: 'Parafuso Allen M8x25 DIN 912',
            quantity: 12,
            unit: 'UN',
            material: 'AÇO 8.8',
            mass: 0.025,
            category: 'normalizado'
        },
        {
            id: '9',
            level: 1,
            partNumber: 'PORCA_M8',
            description: 'Porca Sextavada M8 DIN 934',
            quantity: 12,
            unit: 'UN',
            material: 'AÇO',
            mass: 0.015,
            category: 'normalizado'
        },
        {
            id: '10',
            level: 1,
            partNumber: 'ARRUELA_M8',
            description: 'Arruela Lisa M8 DIN 125',
            quantity: 24,
            unit: 'UN',
            material: 'AÇO',
            mass: 0.008,
            category: 'normalizado'
        }
    ];
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Planning':
                return { bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200', label: 'Planejamento' };
            case 'Design':
                return { bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200', label: 'Em Projeto' };
            case 'Review':
                return { bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200', label: 'Em Revisão' };
            case 'Manufacturing':
                return { bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', label: 'Fabricação' };
            case 'Testing':
                return { bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200', label: 'Teste' };
            case 'Completed':
                return { bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200', label: 'Finalizada' };
            default:
                return { bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200', label: status };
        }
    };

    const { bgColor, textColor, borderColor, label } = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border ${bgColor} ${textColor} ${borderColor}`}>
            {label}
        </span>
    );
};

// BOM Table Component
const GenericBOMTable: React.FC<{ bomItems: GenericBOMItem[] }> = ({ bomItems }) => {
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'fabricado':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'comprado':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'normalizado':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getTotalMass = () => {
        return bomItems.reduce((total, item) => {
            const mass = item.mass || 0;
            return total + (mass * item.quantity);
        }, 0);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Lista de Materiais (BOM)</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {bomItems.length} itens • Massa total: {getTotalMass().toFixed(2)} kg
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                        <Download className="w-4 h-4" />
                        Exportar Excel
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nível</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qtd</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidade</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Massa (kg)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bomItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span style={{ paddingLeft: `${item.level * 20}px` }}>
                                        {item.level}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.partNumber}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {item.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.unit}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {item.material}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.mass ? (item.mass * item.quantity).toFixed(3) : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                                        {item.category}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Main Component
export const MachineDetail: React.FC<MachineDetailProps> = ({ machine, loading = false, onBack, onEdit }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'bom' | 'history'>('info');

    const genericBOM = generateGenericBOM(machine.name);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para o Projeto
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">{machine.name}</h1>
                        <StatusBadge status={machine.status} />
                    </div>

                    {machine.operationNumber && (
                        <p className="text-lg text-gray-600 mb-2">OP: {machine.operationNumber}</p>
                    )}

                    {machine.description && (
                        <p className="text-gray-600 max-w-3xl">{machine.description}</p>
                    )}
                </div>

                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        Editar
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'info'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Informações
                    </button>
                    <button
                        onClick={() => setActiveTab('bom')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'bom'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        BOM
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'history'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Histórico
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'info' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Detalhes da Máquina
                        </h3>
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">ID</dt>
                                <dd className="text-sm text-gray-900">{machine.id}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Número da Operação</dt>
                                <dd className="text-sm text-gray-900">{machine.operationNumber || 'N/A'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Pasta do Projeto</dt>
                                <dd className="text-sm text-gray-900 font-mono">{machine.folderPath || 'N/A'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Assembly Principal</dt>
                                <dd className="text-sm text-gray-900 font-mono">{machine.mainAssemblyPath || 'N/A'}</dd>
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

                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            Estatísticas BOM
                        </h3>
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Total de Versões</dt>
                                <dd className="text-sm text-gray-900">{machine.totalBomVersions}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Última Extração</dt>
                                <dd className="text-sm text-gray-900">{formatDate(machine.lastBomExtraction)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Status da BOM</dt>
                                <dd className="text-sm text-gray-900">
                                    {machine.totalBomVersions > 0 ? 'Disponível' : 'Pendente'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            )}

            {activeTab === 'bom' && (
                <div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Database className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    BOM Genérico de Demonstração
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>
                                        Esta é uma estrutura de BOM exemplo. Quando integrado com o Inventor,
                                        os dados reais serão extraídos automaticamente dos arquivos CAD.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <GenericBOMTable bomItems={genericBOM} />
                </div>
            )}

            {activeTab === 'history' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Histórico de Atividades
                    </h3>
                    <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Nenhuma atividade registrada ainda</p>
                    </div>
                </div>
            )}
        </div>
    );
};
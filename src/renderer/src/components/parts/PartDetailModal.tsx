// src/renderer/src/components/parts/PartDetailModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Package, Calendar, DollarSign, User, Building2, FileText, ExternalLink, Edit } from 'lucide-react';

interface PartUsage {
    bomVersionId: number;
    quantity: number;
    level: number;
    parentPart?: string;
}

interface PartDetail {
    id: number;
    partNumber: string;
    description: string;
    category?: string;
    material?: string;
    weight?: number;
    cost?: number;
    supplier?: string;
    manufacturer?: string;
    status: 'AutoCreated' | 'InReview' | 'Approved' | 'Obsolete';
    isStandardPart: boolean;
    createdAt: string;
    updatedAt?: string;
    usedIn?: PartUsage[];
}

interface PartDetailModalProps {
    partNumber: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const PART_STATUS_LABELS = {
    AutoCreated: 'Auto Criada',
    InReview: 'Em Revisão',
    Approved: 'Aprovada',
    Obsolete: 'Obsoleta'
} as const;

const PART_STATUS_COLORS = {
    AutoCreated: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    InReview: 'bg-blue-100 text-blue-800 border-blue-200',
    Approved: 'bg-green-100 text-green-800 border-green-200',
    Obsolete: 'bg-gray-100 text-gray-800 border-gray-200'
} as const;

export const PartDetailModal: React.FC<PartDetailModalProps> = ({
    partNumber,
    isOpen,
    onClose
}) => {
    const [part, setPart] = useState<PartDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && partNumber) {
            loadPartDetails();
        }
    }, [isOpen, partNumber]);

    const loadPartDetails = async () => {
        if (!partNumber) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/parts/${partNumber}`);

            if (!response.ok) {
                throw new Error('Peça não encontrada');
            }

            const data = await response.json();
            setPart(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar peça');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatWeight = (weight: number) => {
        if (weight < 1) {
            return `${(weight * 1000).toFixed(0)}g`;
        }
        return `${weight.toFixed(2)}kg`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Cabeçalho */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Detalhes da Peça {partNumber}
                        </h2>
                        {part && (
                            <p className="text-gray-600 text-sm mt-1">{part.description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="px-6 py-4">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Carregando detalhes...</span>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h3 className="text-red-800 font-medium">Erro</h3>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        </div>
                    )}

                    {part && (
                        <div className="space-y-6">
                            {/* Informações principais */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Package className="w-5 h-5" />
                                        Informações Gerais
                                    </h3>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Part Number</label>
                                            <p className="font-mono text-base text-gray-900 mt-1">{part.partNumber}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Descrição</label>
                                            <p className="text-gray-900 text-sm mt-1">{part.description}</p>
                                        </div>

                                        <div className="flex gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Status</label>
                                                <div className="mt-1">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${PART_STATUS_COLORS[part.status]}`}>
                                                        {PART_STATUS_LABELS[part.status]}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Tipo</label>
                                                <div className="mt-1">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${part.isStandardPart
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                        {part.isStandardPart ? 'Peça Padrão' : 'Peça Customizada'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {part.category && (
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Categoria</label>
                                                <p className="text-gray-900 text-sm mt-1">{part.category}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Especificações Técnicas
                                    </h3>

                                    <div className="space-y-3">
                                        {part.material && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Material</label>
                                                <p className="text-gray-900">{part.material}</p>
                                            </div>
                                        )}

                                        {part.weight && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Peso</label>
                                                <p className="text-gray-900">{formatWeight(part.weight)}</p>
                                            </div>
                                        )}

                                        {part.cost && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Custo</label>
                                                <p className="text-gray-900 font-semibold">{formatCurrency(part.cost)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Fornecedor e fabricante */}
                            {(part.supplier || part.manufacturer) && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                        <Building2 className="w-5 h-5" />
                                        Fornecedor e Fabricante
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {part.supplier && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Fornecedor</label>
                                                <p className="text-gray-900">{part.supplier}</p>
                                            </div>
                                        )}

                                        {part.manufacturer && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Fabricante</label>
                                                <p className="text-gray-900">{part.manufacturer}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Where-used (onde é usado) */}
                            {part.usedIn && part.usedIn.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                        <ExternalLink className="w-5 h-5" />
                                        Onde é Usado ({part.usedIn.length} BOM{part.usedIn.length > 1 ? 's' : ''})
                                    </h3>

                                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-100 border-b">
                                                <tr>
                                                    <th className="text-left p-3 font-medium text-gray-700">BOM</th>
                                                    <th className="text-left p-3 font-medium text-gray-700">Quantidade</th>
                                                    <th className="text-left p-3 font-medium text-gray-700">Nível</th>
                                                    <th className="text-left p-3 font-medium text-gray-700">Componente Pai</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {part.usedIn.map((usage, index) => (
                                                    <tr key={index} className="border-b border-gray-200">
                                                        <td className="p-3">
                                                            <button className="text-blue-600 hover:text-blue-800 hover:underline">
                                                                BOM #{usage.bomVersionId}
                                                            </button>
                                                        </td>
                                                        <td className="p-3">{usage.quantity}</td>
                                                        <td className="p-3">{usage.level}</td>
                                                        <td className="p-3">{usage.parentPart || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Informações de auditoria */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                    <Calendar className="w-5 h-5" />
                                    Histórico
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Criado em</label>
                                        <p className="text-gray-900">{formatDate(part.createdAt)}</p>
                                    </div>

                                    {part.updatedAt && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Atualizado em</label>
                                            <p className="text-gray-900">{formatDate(part.updatedAt)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Rodapé com ações */}
                {part && (
                    <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-between">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Fechar
                        </button>

                        <div className="flex gap-3">
                            <button className="px-4 py-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center gap-2">
                                <Edit className="w-4 h-4" />
                                Editar
                            </button>

                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Ver BOMs
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
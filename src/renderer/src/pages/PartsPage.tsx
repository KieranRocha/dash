// src/renderer/src/pages/PartsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
    Search, Filter, Package, ArrowUpDown, FileText, Calendar, Eye, Plus,
    ChevronUp, ChevronDown, Edit, Trash2, MoreHorizontal, Building2, User
} from 'lucide-react';
import { PartDetailModal } from '../components/parts/PartDetailModal';

interface Part {
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
    usageCount?: number;
}

interface PartsStats {
    totalParts: number;
    autoCreated: number;
    inReview: number;
    approved: number;
    nextPartNumber: string;
    byCategory: Array<{ category: string; count: number }>;
    standardParts: number;
    customParts: number;
}

const PART_STATUS_LABELS = {
    AutoCreated: 'Auto Criada',
    InReview: 'Em Revisão',
    Approved: 'Aprovada',
    Obsolete: 'Obsoleta'
} as const;

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'AutoCreated': return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', label: 'Auto' };
            case 'InReview': return { bgColor: 'bg-blue-100', textColor: 'text-blue-800', label: 'Revisão' };
            case 'Approved': return { bgColor: 'bg-green-100', textColor: 'text-green-800', label: 'Aprovada' };
            case 'Obsolete': return { bgColor: 'bg-red-100', textColor: 'text-red-800', label: 'Obsoleta' };
            default: return { bgColor: 'bg-gray-100', textColor: 'text-gray-700', label: status };
        }
    };
    const { bgColor, textColor, label } = getStatusConfig(status);
    return (
        <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${bgColor} ${textColor}`}>
            {label}
        </span>
    );
};

export const PartsPage: React.FC = () => {
    const [parts, setParts] = useState<Part[]>([]);
    const [stats, setStats] = useState<PartsStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPartNumber, setSelectedPartNumber] = useState<string | null>(null);

    // Filtros e busca
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [sortField, setSortField] = useState('partNumber');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [showFilters, setShowFilters] = useState(false);

    // Caregar dados iniciais
    useEffect(() => {
        loadPartsAndStats();
    }, []);

    const loadPartsAndStats = async () => {
        try {
            setLoading(true);

            const [partsResponse, statsResponse] = await Promise.all([
                fetch('/api/parts?pageSize=1000'), // Carregar mais peças para a página
                fetch('/api/parts/stats')
            ]);

            if (!partsResponse.ok || !statsResponse.ok) {
                throw new Error('Erro ao carregar dados');
            }

            const partsData = await partsResponse.json();
            const statsData = await statsResponse.json();

            setParts(partsData.parts || partsData); // Lidar com resposta paginada ou direta
            setStats(statsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

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

    // Filtrar e ordenar peças
    const filteredAndSortedParts = useMemo(() => {
        let filtered = parts.filter(part => {
            const matchesSearch =
                part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                part.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (part.manufacturer && part.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus = statusFilter === 'all' || part.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || part.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
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
    }, [parts, searchTerm, statusFilter, categoryFilter, sortField, sortDirection]);

    const uniqueCategories = useMemo(() => [...new Set(parts.map(p => p.category).filter(Boolean))], [parts]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    };

    const formatCurrency = (value?: number) => {
        if (!value) return '-';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0
        }).format(value);
    };

    const handlePartClick = (partNumber: string) => {
        setSelectedPartNumber(partNumber);
    };

    if (error && !parts.length) {
        return <div className="p-6 text-center">Erro ao carregar catálogo: {error}</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Catálogo de Peças ({filteredAndSortedParts.length})
                </h1>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar peças..."
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

                    {/* New Part Button */}
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        Nova Peça
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
                            <option value="AutoCreated">Auto Criadas</option>
                            <option value="InReview">Em Revisão</option>
                            <option value="Approved">Aprovadas</option>
                            <option value="Obsolete">Obsoletas</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">Todas as Categorias</option>
                            {uniqueCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-medium text-gray-600 uppercase">Total</p>
                                <p className="text-lg font-bold text-gray-900">{stats.totalParts}</p>
                            </div>
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-medium text-gray-600 uppercase">Pendentes</p>
                                <p className="text-lg font-bold text-yellow-600">{stats.autoCreated}</p>
                            </div>
                            <Calendar className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-medium text-gray-600 uppercase">Aprovadas</p>
                                <p className="text-lg font-bold text-green-600">{stats.approved}</p>
                            </div>
                            <FileText className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-medium text-gray-600 uppercase">Padrão</p>
                                <p className="text-lg font-bold text-blue-600">{stats.standardParts}</p>
                            </div>
                            <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-medium text-gray-600 uppercase">Customizadas</p>
                                <p className="text-lg font-bold text-purple-600">{stats.customParts}</p>
                            </div>
                            <User className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-medium text-gray-600 uppercase">Próximo PN</p>
                                <p className="text-lg font-bold text-gray-900 font-mono">{stats.nextPartNumber}</p>
                            </div>
                            <Plus className="w-6 h-6 text-gray-600" />
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left p-3 font-semibold text-gray-700 w-24">
                                    <SortButton field="partNumber">Part Number</SortButton>
                                </th>
                                <th className="text-left p-3 font-semibold text-gray-700 w-60">
                                    <SortButton field="description">Descrição</SortButton>
                                </th>
                                <th className="text-left p-3 font-semibold text-gray-700 w-20">
                                    <SortButton field="category">Categoria</SortButton>
                                </th>
                                <th className="text-left p-3 font-semibold text-gray-700 w-16">
                                    <SortButton field="status">Status</SortButton>
                                </th>
                                <th className="text-left p-3 font-semibold text-gray-700 w-16">Tipo</th>
                                <th className="text-left p-3 font-semibold text-gray-700 w-24">
                                    <SortButton field="material">Material</SortButton>
                                </th>
                                <th className="text-right p-3 font-semibold text-gray-700 w-16">
                                    <SortButton field="weight">Peso</SortButton>
                                </th>
                                <th className="text-right p-3 font-semibold text-gray-700 w-20">
                                    <SortButton field="cost">Custo</SortButton>
                                </th>
                                <th className="text-left p-3 font-semibold text-gray-700 w-28">
                                    <SortButton field="supplier">Fornecedor</SortButton>
                                </th>
                                <th className="text-center p-3 font-semibold text-gray-700 w-12">
                                    <SortButton field="usageCount">Uso</SortButton>
                                </th>
                                <th className="text-left p-3 font-semibold text-gray-700 w-20">
                                    <SortButton field="createdAt">Criado</SortButton>
                                </th>
                                <th className="text-center p-3 font-semibold text-gray-700 w-16">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && (
                                [...Array(10)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {[...Array(12)].map((_, j) => (
                                            <td key={j} className="p-3">
                                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}

                            {!loading && filteredAndSortedParts.map(part => (
                                <tr key={part.id} className="hover:bg-gray-50 cursor-pointer transition-colors group">
                                    {/* Part Number */}
                                    <td className="p-3">
                                        <button
                                            onClick={() => handlePartClick(part.partNumber)}
                                            className="font-mono text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
                                        >
                                            {part.partNumber}
                                        </button>
                                    </td>

                                    {/* Descrição */}
                                    <td className="p-3">
                                        <div>
                                            <div className="font-medium text-gray-900 truncate">
                                                {part.description}
                                            </div>
                                            {part.manufacturer && (
                                                <div className="text-[10px] text-gray-500 truncate">
                                                    {part.manufacturer}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Categoria */}
                                    <td className="p-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-800">
                                            {part.category || 'N/A'}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="p-3">
                                        <StatusBadge status={part.status} />
                                    </td>

                                    {/* Tipo */}
                                    <td className="p-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${part.isStandardPart
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-purple-100 text-purple-800'
                                            }`}>
                                            {part.isStandardPart ? 'Padrão' : 'Custom'}
                                        </span>
                                    </td>

                                    {/* Material */}
                                    <td className="p-3 text-gray-600 truncate">
                                        {part.material || '-'}
                                    </td>

                                    {/* Peso */}
                                    <td className="p-3 text-right text-gray-600">
                                        {part.weight ? `${part.weight.toFixed(2)}kg` : '-'}
                                    </td>

                                    {/* Custo */}
                                    <td className="p-3 text-right">
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(part.cost)}
                                        </span>
                                    </td>

                                    {/* Fornecedor */}
                                    <td className="p-3 text-gray-600 truncate">
                                        {part.supplier || '-'}
                                    </td>

                                    {/* Uso */}
                                    <td className="p-3 text-center">
                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 text-[10px] font-bold rounded-full">
                                            {part.usageCount || 0}
                                        </span>
                                    </td>

                                    {/* Criado */}
                                    <td className="p-3 text-gray-600">
                                        {formatDate(part.createdAt)}
                                    </td>

                                    {/* Ações */}
                                    <td className="p-3">
                                        <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePartClick(part.partNumber);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                                                    title="Ver Detalhes"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // TODO: Implementar edição
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {!loading && filteredAndSortedParts.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <div className="text-sm">Nenhuma peça encontrada</div>
                        <div className="text-xs mt-1">Tente ajustar os filtros de busca</div>
                    </div>
                )}
            </div>

            {/* Modal de detalhes */}
            <PartDetailModal
                partNumber={selectedPartNumber}
                isOpen={selectedPartNumber !== null}
                onClose={() => setSelectedPartNumber(null)}
            />
        </div>
    );
};
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    MoreHorizontal,
    Check,
    X,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    Minus,
    BarChart3,
    PieChart,
    Activity,
    Target,
    Zap,
    AlertTriangle,
    CheckCircle,
    Clock,
    Users,
    Calendar,
    FileText,
    ExternalLink,
    Copy,
    Share2
} from 'lucide-react';

// Import base components (assuming they're available)
import { Button, Badge, Card, Input, Tooltip, Avatar } from './ui-components';

// ============ ENHANCED STATS CARD ============
export const StatsCard = ({
    title,
    value,
    change,
    trend,
    icon: Icon,
    loading = false,
    subtitle,
    clickable = false,
    onClick,
    sparklineData = [],
    target,
    unit = '',
    period = '',
    actions = [],
    variant = 'default'
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const trendColors = {
        up: { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
        down: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
        neutral: { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' }
    };

    const variants = {
        default: 'bg-white border-gray-200',
        success: 'bg-green-50 border-green-200',
        warning: 'bg-yellow-50 border-yellow-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200'
    };

    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp className="w-3 h-3" />;
        if (trend === 'down') return <TrendingDown className="w-3 h-3" />;
        return <Minus className="w-3 h-3" />;
    };

    if (loading) {
        return (
            <Card
                variant="outlined"
                size="md"
                className="animate-pulse border"
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                </div>
            </Card>
        );
    }

    return (
        <Card
            variant="outlined"
            size="md"
            className={`
        border transition-all duration-300 relative overflow-hidden group
        ${variants[variant]}
        ${clickable ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]' : ''}
        ${isHovered ? 'shadow-lg' : 'shadow-sm'}
      `}
            onClick={clickable ? onClick : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
            </div>

            <div className="relative">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm font-medium text-gray-600">{title}</p>
                            {period && (
                                <Badge variant="default" size="xs" className="text-xs">
                                    {period}
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-baseline space-x-2 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {value}{unit}
                            </h3>

                            {change && (
                                <div className={`
                  flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                  ${trendColors[trend]?.bg} ${trendColors[trend]?.text} ${trendColors[trend]?.border} border
                `}>
                                    {getTrendIcon()}
                                    <span>{change}</span>
                                </div>
                            )}
                        </div>

                        {subtitle && (
                            <p className="text-xs text-gray-500">{subtitle}</p>
                        )}

                        {target && (
                            <div className="mt-2">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Meta: {target}{unit}</span>
                                    <span>{Math.round((parseInt(value) / parseInt(target)) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                    <div
                                        className="bg-blue-600 h-1 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min((parseInt(value) / parseInt(target)) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {Icon && (
                        <div className={`
              p-3 rounded-lg transition-all duration-300
              ${isHovered ? 'bg-blue-100 scale-110' : 'bg-blue-50'}
            `}>
                            <Icon className={`
                w-6 h-6 transition-colors duration-300
                ${isHovered ? 'text-blue-700' : 'text-blue-600'}
              `} />
                        </div>
                    )}
                </div>

                {/* Sparkline */}
                {sparklineData.length > 0 && (
                    <div className="mb-3">
                        <div className="h-8 flex items-end space-x-1">
                            {sparklineData.map((point, index) => (
                                <div
                                    key={index}
                                    className="bg-blue-200 rounded-sm flex-1 transition-all duration-300 hover:bg-blue-400"
                                    style={{
                                        height: `${(point / Math.max(...sparklineData)) * 100}%`,
                                        minHeight: '2px'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                {actions.length > 0 && (
                    <div className={`
            flex space-x-2 transition-all duration-300
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          `}>
                        {actions.map((action, index) => (
                            <Tooltip key={index} content={action.label}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={action.icon}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick?.();
                                    }}
                                    className="h-8 w-8 p-0"
                                />
                            </Tooltip>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};

// ============ ADVANCED DATA TABLE ============
export const DataTable = ({
    columns = [],
    data = [],
    actions = [],
    sortable = true,
    filterable = true,
    searchable = true,
    selectable = false,
    exportable = false,
    pagination = true,
    pageSize = 10,
    loading = false,
    emptyMessage = "Nenhum dado encontrado",
    onRowClick,
    stickyHeader = true,
    className = ''
}) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({});
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter and sort data
    const processedData = useMemo(() => {
        let filtered = [...data];

        // Apply search
        if (searchQuery) {
            filtered = filtered.filter(row =>
                columns.some(col => {
                    const value = row[col.key];
                    return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
                })
            );
        }

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== 'all') {
                filtered = filtered.filter(row => row[key] === value);
            }
        });

        // Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [data, searchQuery, filters, sortConfig, columns]);

    // Pagination
    const paginatedData = useMemo(() => {
        if (!pagination) return processedData;

        const startIndex = (currentPage - 1) * pageSize;
        return processedData.slice(startIndex, startIndex + pageSize);
    }, [processedData, currentPage, pageSize, pagination]);

    const totalPages = Math.ceil(processedData.length / pageSize);

    const handleSort = (key) => {
        if (!sortable) return;

        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleSelectAll = () => {
        if (selectedRows.size === paginatedData.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(paginatedData.map((_, index) => index)));
        }
    };

    const handleRowSelect = (index) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedRows(newSelected);
    };

    const exportData = () => {
        const csvContent = [
            columns.map(col => col.header).join(','),
            ...processedData.map(row =>
                columns.map(col => `"${row[col.key] || ''}"`).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'export.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-50" />;
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="w-4 h-4 text-blue-600" />
            : <ArrowDown className="w-4 h-4 text-blue-600" />;
    };

    if (loading) {
        return (
            <Card size="sm" className={className}>
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-100 rounded"></div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card size="sm" className={className}>
            {/* Table Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                    {searchable && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                    )}

                    {filterable && (
                        <div className="relative">
                            <Button
                                variant="outline"
                                size="sm"
                                icon={Filter}
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={isFilterOpen ? 'bg-blue-50 border-blue-300' : ''}
                            >
                                Filtros
                            </Button>

                            {/* Filter Panel */}
                            {isFilterOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Filtros</h4>
                                    <div className="space-y-3">
                                        {columns.filter(col => col.filterable).map(col => (
                                            <div key={col.key}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {col.header}
                                                </label>
                                                <select
                                                    value={filters[col.key] || 'all'}
                                                    onChange={(e) => setFilters(prev => ({
                                                        ...prev,
                                                        [col.key]: e.target.value
                                                    }))}
                                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                                >
                                                    <option value="all">Todos</option>
                                                    {[...new Set(data.map(row => row[col.key]))]
                                                        .filter(Boolean)
                                                        .map(value => (
                                                            <option key={value} value={value}>{value}</option>
                                                        ))}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex space-x-2 mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFilters({})}
                                            fullWidth
                                        >
                                            Limpar
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => setIsFilterOpen(false)}
                                            fullWidth
                                        >
                                            Aplicar
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    {selectedRows.size > 0 && (
                        <Badge variant="primary" size="sm">
                            {selectedRows.size} selecionados
                        </Badge>
                    )}

                    {exportable && (
                        <Button
                            variant="outline"
                            size="sm"
                            icon={Download}
                            onClick={exportData}
                        >
                            Exportar
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        icon={RefreshCw}
                        onClick={() => window.location.reload()}
                    >
                        Atualizar
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                    <thead className={`bg-gray-50 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
                        <tr>
                            {selectable && (
                                <th className="w-12 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                            )}

                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider group ${sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                                        }`}
                                    onClick={() => column.sortable !== false && handleSort(column.key)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>{column.header}</span>
                                        {sortable && column.sortable !== false && getSortIcon(column.key)}
                                    </div>
                                </th>
                            ))}

                            {actions.length > 0 && (
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-24">
                                    Ações
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        <FileText className="w-8 h-8 text-gray-400" />
                                        <span>{emptyMessage}</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={`
                    hover:bg-gray-50 transition-colors
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${selectedRows.has(rowIndex) ? 'bg-blue-50' : ''}
                  `}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {selectable && (
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.has(rowIndex)}
                                                onChange={() => handleRowSelect(rowIndex)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                    )}

                                    {columns.map((column) => (
                                        <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                                            {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                                        </td>
                                    ))}

                                    {actions.length > 0 && (
                                        <td className="px-4 py-3">
                                            <div className="flex space-x-2">
                                                {actions.map((action, actionIndex) => (
                                                    <Tooltip key={actionIndex} content={action.label}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={action.icon}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                action.onClick(row, rowIndex);
                                                            }}
                                                            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                                                        />
                                                    </Tooltip>
                                                ))}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-700">
                        Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, processedData.length)} de {processedData.length} resultados
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>

                        <div className="flex space-x-1">
                            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                const page = i + 1;
                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? 'primary' : 'ghost'}
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        className="w-8 h-8 p-0"
                                    >
                                        {page}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Próximo
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};

// ============ METRICS GRID ============
export const MetricsGrid = ({ metrics = [], loading = false, className = '' }) => {
    if (loading) {
        return (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
                {[...Array(4)].map((_, i) => (
                    <StatsCard key={i} loading />
                ))}
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
            {metrics.map((metric, index) => (
                <StatsCard key={index} {...metric} />
            ))}
        </div>
    );
};

// Demo Component
export default function DataComponentsDemo() {
    const [loading, setLoading] = useState(false);

    const sampleMetrics = [
        {
            title: 'Usuários Online',
            value: '12',
            change: '+3',
            trend: 'up',
            icon: Users,
            subtitle: 'Ativos agora',
            period: 'Tempo real',
            target: '15',
            sparklineData: [8, 10, 9, 12, 11, 12, 13, 12],
            actions: [
                { icon: Eye, label: 'Ver detalhes', onClick: () => console.log('View details') },
                { icon: Share2, label: 'Compartilhar', onClick: () => console.log('Share') }
            ]
        },
        {
            title: 'Projetos Ativos',
            value: '8',
            change: '+2',
            trend: 'up',
            icon: FileText,
            subtitle: 'Em desenvolvimento',
            target: '10',
            sparklineData: [6, 7, 6, 8, 7, 8, 8, 8]
        },
        {
            title: 'BOMs Extraídas',
            value: '23',
            change: '+15%',
            trend: 'up',
            icon: BarChart3,
            subtitle: 'Hoje',
            sparklineData: [18, 20, 19, 23, 21, 23, 24, 23]
        },
        {
            title: 'Produtividade',
            value: '94',
            unit: '%',
            change: '+2%',
            trend: 'up',
            icon: Target,
            subtitle: 'Meta: 95%',
            variant: 'success',
            target: '100',
            clickable: true,
            onClick: () => console.log('Productivity clicked')
        }
    ];

    const sampleData = [
        { id: 1, component: 'Parafuso M8x20', quantity: 24, material: 'Aço Inox', supplier: 'Fornecedor A', project: 'Projeto Alpha', status: 'active' },
        { id: 2, component: 'Porca M8', quantity: 24, material: 'Aço Inox', supplier: 'Fornecedor A', project: 'Projeto Alpha', status: 'active' },
        { id: 3, component: 'Chapa 200x300x5', quantity: 2, material: 'Alumínio', supplier: 'Fornecedor B', project: 'Projeto Beta', status: 'pending' },
        { id: 4, component: 'Perfil L 50x50x5', quantity: 4, material: 'Aço Carbono', supplier: 'Fornecedor C', project: 'Projeto Gamma', status: 'completed' },
        { id: 5, component: 'Rolamento 608', quantity: 8, material: 'Aço', supplier: 'Fornecedor D', project: 'Projeto Delta', status: 'active' }
    ];

    const tableColumns = [
        {
            key: 'component',
            header: 'Componente',
            render: (value) => <span className="font-medium text-gray-900">{value}</span>
        },
        { key: 'quantity', header: 'Quantidade' },
        { key: 'material', header: 'Material', filterable: true },
        { key: 'supplier', header: 'Fornecedor', filterable: true },
        {
            key: 'project',
            header: 'Projeto',
            filterable: true,
            render: (value) => <Badge variant="primary" size="sm">{value}</Badge>
        },
        {
            key: 'status',
            header: 'Status',
            filterable: true,
            render: (value) => {
                const variants = {
                    active: 'success',
                    pending: 'warning',
                    completed: 'default'
                };
                return <Badge variant={variants[value]} size="sm">{value}</Badge>;
            }
        }
    ];

    const tableActions = [
        { icon: Eye, label: 'Visualizar', onClick: (row) => console.log('View', row) },
        { icon: Edit, label: 'Editar', onClick: (row) => console.log('Edit', row) },
        { icon: Copy, label: 'Copiar', onClick: (row) => console.log('Copy', row) },
        { icon: Trash2, label: 'Excluir', onClick: (row) => console.log('Delete', row) }
    ];

    const toggleLoading = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Data Components Demo</h1>
                    <Button variant="outline" onClick={toggleLoading} icon={RefreshCw}>
                        Test Loading States
                    </Button>
                </div>

                {/* Metrics Grid */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Advanced Stats Cards</h2>
                    <MetricsGrid metrics={sampleMetrics} loading={loading} />
                </section>

                {/* Advanced Data Table */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Enhanced Data Table</h2>
                    <DataTable
                        columns={tableColumns}
                        data={sampleData}
                        actions={tableActions}
                        sortable
                        filterable
                        searchable
                        selectable
                        exportable
                        pagination
                        pageSize={5}
                        loading={loading}
                        onRowClick={(row) => console.log('Row clicked:', row)}
                    />
                </section>

                {/* Features Overview */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Features Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <h3 className="font-semibold mb-3">Stats Card Features:</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Sparkline visualization</li>
                                <li>• Progress tracking with targets</li>
                                <li>• Interactive hover states</li>
                                <li>• Action buttons with tooltips</li>
                                <li>• Loading states and animations</li>
                                <li>• Trend indicators and changes</li>
                            </ul>
                        </Card>

                        <Card>
                            <h3 className="font-semibold mb-3">Data Table Features:</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Advanced sorting and filtering</li>
                                <li>• Smart search with highlighting</li>
                                <li>• Row selection and bulk actions</li>
                                <li>• CSV export functionality</li>
                                <li>• Responsive pagination</li>
                                <li>• Custom cell rendering</li>
                            </ul>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
}
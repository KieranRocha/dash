// src/renderer/src/components/machines/ClickableBOMTable.tsx
import React, { useState, useMemo, useCallback } from 'react';
import {
    Search, Download, FileText, FolderOpen, ExternalLink,
    ChevronRight, ChevronDown, Box, Circle, Layers, ComponentIcon
} from 'lucide-react';
import { PartDetailModal } from '../parts/PartDetailModal';

interface BOMItem {
    partNumber: string;
    description: string;
    quantity: number;
    level: number;
    stockNumber?: string;
    material?: string;
    weight?: number;
    unit?: string;
    category?: string;
    isAssembly?: boolean;
    parentPartNumber?: string;
}

interface BOMVersion {
    id: number;
    versionNumber: number;
    extractedAt: string;
    extractedBy: string;
    items: BOMItem[];
    itemCount: number;
}

interface ExpandedState {
    [partNumber: string]: boolean;
}

interface ClickableBOMTableProps {
    projectId: number;
    machineId: number;
    bomVersions: BOMVersion[];
    loading?: boolean;
    onOpenFile?: (filePath: string) => void;
}

export const ClickableBOMTable: React.FC<ClickableBOMTableProps> = ({
    projectId,
    machineId,
    bomVersions,
    loading = false,
    onOpenFile
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPartNumber, setSelectedPartNumber] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<ExpandedState>({});

    // Usar a versão mais recente (última do array, como no SimpleBOMTable)
    const latestVersion = bomVersions.length > 0 ? bomVersions[bomVersions.length - 1] : null;

    // Organizar items com informação de filhos baseado nos níveis existentes
    const organizedItems = useMemo(() => {
        if (!latestVersion) return [];

        return latestVersion.items.map((item, index) => {
            // Verificar se tem filhos olhando o próximo item na sequência
            let hasChildren = false;

            if (index + 1 < latestVersion.items.length) {
                const nextItem = latestVersion.items[index + 1];
                // Tem filhos se o próximo item tem nível maior que o atual
                hasChildren = nextItem.level > item.level;
            }

            return {
                ...item,
                hasChildren
            };
        });
    }, [latestVersion]);

    // Filtrar items baseado na busca e estado de expansão
    const visibleItems = useMemo(() => {
        if (!organizedItems.length) return [];

        let items = organizedItems;

        // Aplicar filtro de busca se houver
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            items = items.filter(item =>
                item.partNumber.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term)
            );
        }

        // Se não há busca, aplicar lógica de expand/collapse
        if (!searchTerm.trim()) {
            const result: typeof items = [];

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                result.push(item);

                // Se item tem filhos mas está colapsado, pular os filhos
                if (item.hasChildren && !expandedItems[item.partNumber]) {
                    // Pular todos os items de nível maior até encontrar próximo do mesmo nível ou menor
                    while (i + 1 < items.length && items[i + 1].level > item.level) {
                        i++;
                    }
                }
            }

            return result;
        }

        return items;
    }, [organizedItems, expandedItems, searchTerm]);

    const toggleExpanded = useCallback((item: typeof organizedItems[0]) => {
        if (!item.hasChildren) return;

        setExpandedItems(prev => ({
            ...prev,
            [item.partNumber]: !prev[item.partNumber]
        }));
    }, []);

    const handlePartClick = (partNumber: string) => {
        setSelectedPartNumber(partNumber);
    };

    const handleExport = () => {
        if (!latestVersion) return;

        const csv = [
            'Nível,Part Number,Descrição,Quantidade,Material,Peso,Stock Number',
            ...visibleItems.map(item =>
                `${item.level || 0},"${item.partNumber}","${item.description}",${item.quantity},"${item.material || ''}","${item.weight || ''}","${item.stockNumber || ''}"`
            )
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BOM_M${machineId}_V${latestVersion.versionNumber}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getItemIcon = (item: typeof organizedItems[0]) => {
        if (!item.hasChildren) {
            return <Circle className="w-3 h-3 text-gray-500 fill-current" />;
        }

        // Ícones para assemblies baseados no nível
        switch (item.level) {
            case 0:
                return <Box className="w-4 h-4 text-blue-600" />; // Assembly principal
            case 1:
                return <Layers className="w-4 h-4 text-blue-500" />; // Sub-assembly nível 1
            default:
                return <ComponentIcon className="w-3 h-3 text-blue-400" />; // Sub-assemblies profundos
        }
    };

    const getExpandButton = (item: typeof organizedItems[0]) => {
        if (!item.hasChildren) return <div className="w-4" />; // Spacer

        const isExpanded = expandedItems[item.partNumber];

        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded(item);
                }}
                className="flex items-center justify-center w-4 h-4 hover:bg-blue-50 rounded transition-colors"
            >
                {isExpanded ? (
                    <ChevronDown className="w-3 h-3 text-gray-600" />
                ) : (
                    <ChevronRight className="w-3 h-3 text-gray-600" />
                )}
            </button>
        );
    };

    // Controles rápidos
    const handleExpandAll = () => {
        const newExpandedState: ExpandedState = {};
        organizedItems
            .filter(item => item.hasChildren)
            .forEach(item => {
                newExpandedState[item.partNumber] = true;
            });
        setExpandedItems(newExpandedState);
    };

    const handleCollapseAll = () => {
        setExpandedItems({});
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Carregando BOM...</span>
            </div>
        );
    }

    if (!latestVersion) {
        return (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma BOM encontrada</h3>
                <p className="text-gray-600">Esta máquina ainda não possui extrações de BOM.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            Lista de Materiais (BOM)
                        </h3>
                        <div className="mt-2 flex items-center gap-6 text-sm text-gray-600">
                            <span>{latestVersion.itemCount || latestVersion.items.length} itens</span>
                            <span>Versão {latestVersion.versionNumber}</span>
                            <span>Por {latestVersion.extractedBy}</span>
                            <span>{new Date(latestVersion.extractedAt).toLocaleString('pt-BR')}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {onOpenFile && (
                            <button
                                onClick={() => onOpenFile('')}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                            >
                                <FolderOpen className="w-4 h-4" />
                                Abrir Arquivo
                            </button>
                        )}

                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Exportar CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Controles da Tree */}
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExpandAll}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        title="Expandir Todos"
                    >
                        Expandir Todos
                    </button>

                    <button
                        onClick={handleCollapseAll}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        title="Colapsar Todos"
                    >
                        Colapsar Todos
                    </button>
                </div>

                <div className="text-xs text-gray-600">
                    {searchTerm ? `${visibleItems.length} itens encontrados` : `${visibleItems.length} itens visíveis`}
                </div>
            </div>

            {/* Busca */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar por Part Number ou descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                {searchTerm && (
                    <p className="text-sm text-gray-600 mt-2">
                        {visibleItems.length} itens encontrados
                    </p>
                )}
            </div>

            {/* Tree View */}
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estrutura
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descrição
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Qtd
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Material
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Peso
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {visibleItems.map((item, index) => {
                            const indentationPx = 16 + (item.level * 20); // Base 16px + 20px por nível

                            return (
                                <tr key={`${item.partNumber}-${item.level}-${index}`} className="hover:bg-gray-50 group">
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <div
                                            className="flex items-center gap-2"
                                            style={{ paddingLeft: `${indentationPx}px` }}
                                        >
                                            {/* Expand/Collapse Button */}
                                            {getExpandButton(item)}

                                            {/* Icon */}
                                            {getItemIcon(item)}

                                            {/* Part Number */}
                                            <button
                                                onClick={() => handlePartClick(item.partNumber)}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-1 group/part"
                                            >
                                                {item.partNumber}
                                                <ExternalLink className="w-3 h-3 opacity-0 group-hover/part:opacity-100 transition-opacity" />
                                            </button>

                                            {/* Stock Number */}
                                            {item.stockNumber && (
                                                <span className="text-xs text-gray-500 ml-2">
                                                    ({item.stockNumber})
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-3">
                                        <span className="text-sm text-gray-600">
                                            {item.description || (
                                                <span className="text-gray-400 italic">Sem descrição</span>
                                            )}
                                        </span>
                                    </td>

                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {item.quantity} {item.unit || 'UN'}
                                        </span>
                                    </td>

                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                                        {item.material || '-'}
                                    </td>

                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                                        {item.weight ? `${item.weight.toFixed(2)} kg` : '-'}
                                    </td>

                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handlePartClick(item.partNumber)}
                                                className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                                                title="Ver Detalhes da Peça"
                                            >
                                                Detalhes
                                            </button>
                                            <button
                                                className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                                title="Abrir DWG"
                                            >
                                                DWG
                                            </button>
                                            <button
                                                className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                                title="Abrir PDF"
                                            >
                                                PDF
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                        {searchTerm ? `${visibleItems.length} itens filtrados` : `${visibleItems.length} itens visíveis`}
                    </span>
                    <span>
                        Quantidade total: {visibleItems.reduce((sum, item) => sum + item.quantity, 0)} peças
                    </span>
                </div>
            </div>

            {/* Modal de detalhes da peça */}
            <PartDetailModal
                partNumber={selectedPartNumber}
                isOpen={selectedPartNumber !== null}
                onClose={() => setSelectedPartNumber(null)}
            />
        </div>
    );
};
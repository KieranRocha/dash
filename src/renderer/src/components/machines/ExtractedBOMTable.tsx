// src/renderer/src/components/machines/ExtractedBOMTable.tsx
import React, { useState, useMemo } from 'react';
import { BOMItem } from '../../types/index';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import {
    FileText,
    Download,
    FolderOpen,
    Search,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';

interface ExtractedBOMTableProps {
    projectId: string;
    machineId: string;
    itemsJson: string; // A string JSON do banco de dados
    loading?: boolean;
    assemblyFilePath?: string;
    extractedAt?: string;
    onOpenFile?: (filePath: string) => void;
    onOpenDWG?: (partNumber: string) => void; // Para implementar depois
    onOpenPDF?: (partNumber: string) => void; // Para implementar depois
}

export const ExtractedBOMTable: React.FC<ExtractedBOMTableProps> = ({
    projectId,
    machineId,
    itemsJson,
    loading = false,
    assemblyFilePath,
    extractedAt,
    onOpenFile,
    onOpenDWG,
    onOpenPDF
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Parse do JSON e tratamento de erros
    const bomItems = useMemo<BOMItem[]>(() => {
        try {
            if (!itemsJson || itemsJson.trim() === '') {
                return [];
            }

            const parsed = JSON.parse(itemsJson);

            // Converte para o formato da interface BOMItem
            return parsed.map((item: any, index: number) => ({
                partNumber: item.PartNumber || item.partNumber || `ITEM_${index + 1}`,
                description: item.Description || item.description || '',
                quantity: item.Quantity || item.quantity || 1,
                stockNumber: item.StockNumber || item.stockNumber || null,
                level: 0, // Por padrão, todos no nível 0
                mass: null,
                material: null,
                unit: 'UN',
                category: 'Manufactured'
            }));
        } catch (error) {
            console.error('Erro ao fazer parse da BOM JSON:', error);
            return [];
        }
    }, [itemsJson]);

    // Filtro de busca
    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) return bomItems;

        const term = searchTerm.toLowerCase();
        return bomItems.filter(item =>
            item.partNumber.toLowerCase().includes(term) ||
            (item.description && item.description.toLowerCase().includes(term))
        );
    }, [bomItems, searchTerm]);

    // Estatísticas
    const totalItems = bomItems.length;
    const totalQuantity = bomItems.reduce((sum, item) => sum + item.quantity, 0);
    const itemsWithDescription = bomItems.filter(item => item.description && item.description.trim() !== '').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
                <span className="ml-2 text-gray-600">Carregando BOM...</span>
            </div>
        );
    }

    if (bomItems.length === 0) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                    <div>
                        <h3 className="text-sm font-medium text-yellow-800">
                            Nenhum item encontrado na BOM
                        </h3>
                        <p className="text-sm text-yellow-700 mt-1">
                            Verifique se o arquivo foi processado corretamente pelo Agent.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const handleOpenFile = () => {
        if (assemblyFilePath && onOpenFile) {
            onOpenFile(assemblyFilePath);
        }
    };

    const handleExportExcel = () => {
        // Criar CSV para download
        const headers = ['Part Number', 'Descrição', 'Quantidade', 'Stock Number'];
        const csvContent = [
            headers.join(','),
            ...filteredItems.map(item => [
                `"${item.partNumber}"`,
                `"${item.description || ''}"`,
                item.quantity,
                `"${item.stockNumber || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BOM_${machineId}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            {/* Header com informações e ações */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Lista de Materiais (BOM)
                        </h3>
                        <div className="text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-4">
                                <span>{totalItems} itens únicos</span>
                                <span>{totalQuantity} peças total</span>
                                <span>{itemsWithDescription} com descrição</span>
                                {extractedAt && (
                                    <span>
                                        Extraído em {new Date(extractedAt).toLocaleString('pt-BR')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {assemblyFilePath && (
                            <Button
                                variant="primary"

                                onClick={handleOpenFile}
                                className="inline-flex items-center gap-2"
                            >
                                <FolderOpen className="w-4 h-4" />
                                Abrir Arquivo
                            </Button>
                        )}

                        <Button
                            variant="primary"

                            onClick={handleExportExcel}
                            className="inline-flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Exportar CSV
                        </Button>
                    </div>
                </div>

                {/* Status da BOM */}
                <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-700">BOM extraída com sucesso</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">Projeto: {projectId}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">Máquina: {machineId}</span>
                </div>
            </div>

            {/* Busca */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar por Part Number ou descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                {searchTerm && (
                    <p className="text-sm text-gray-600 mt-2">
                        Mostrando {filteredItems.length} de {totalItems} itens
                    </p>
                )}
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Part Number
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descrição
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Qtd
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock Number
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredItems.map((item, index) => (
                            <tr
                                key={`${item.partNumber}-${index}`}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {item.partNumber}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600 max-w-md">
                                        {item.description || (
                                            <span className="text-gray-400 italic">
                                                Sem descrição
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {item.quantity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.stockNumber || (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex gap-1">
                                        {/* Botão DWG - implementar depois */}
                                        <button
                                            onClick={() => onOpenDWG && onOpenDWG(item.partNumber)}
                                            disabled={!onOpenDWG}
                                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Abrir DWG (Em desenvolvimento)"
                                        >
                                            <FileText className="w-3 h-3 mr-1" />
                                            DWG
                                        </button>

                                        {/* Botão PDF - implementar depois */}
                                        <button
                                            onClick={() => onOpenPDF && onOpenPDF(item.partNumber)}
                                            disabled={!onOpenPDF}
                                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-50 rounded hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Abrir PDF (Em desenvolvimento)"
                                        >
                                            <FileText className="w-3 h-3 mr-1" />
                                            PDF
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer com estatísticas */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                        Total: {filteredItems.length} itens
                    </span>
                    <span>
                        Quantidade total: {filteredItems.reduce((sum, item) => sum + item.quantity, 0)} peças
                    </span>
                </div>
            </div>
        </div>
    );
};
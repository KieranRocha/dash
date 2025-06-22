// src/renderer/src/components/machines/SimpleBOMTable.tsx
import React, { useState, useMemo } from 'react';
import { Search, Download, FileText, FolderOpen, Package, Wrench } from 'lucide-react';

interface BOMItem {
    partNumber: string;
    description: string;
    quantity: number;
    stockNumber: string | null;
    level?: number;
    isAssembly?: boolean;
    material?: string;
    weight?: number;
}

interface BOMVersion {
    id: number;
    versionNumber: number;
    createdAt: string;
    extractedBy: string;
    itemCount: number;
    extractedAt: string;
    items: BOMItem[];
}

interface SimpleBOMTableProps {
    projectId: number;
    machineId: number;
    onOpenFile?: () => void;
}

export const SimpleBOMTable: React.FC<SimpleBOMTableProps> = ({
    projectId,
    machineId,
    onOpenFile
}) => {
    const [bomVersions, setBomVersions] = useState<BOMVersion[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Buscar dados da API
    const fetchBOMData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:5047/api/projects/${projectId}/machines/${machineId}/bom-versions`
            );
            const data = await response.json();
            setBomVersions(data);
        } catch (error) {
            console.error('Erro ao buscar BOM:', error);
        } finally {
            setLoading(false);
        }
    };

    // Carregar dados na montagem
    React.useEffect(() => {
        fetchBOMData();
    }, [projectId, machineId]);

    // Pegar versão mais recente (última do array)
    const latestVersion = bomVersions.length > 0 ? bomVersions[bomVersions.length - 1] : null;

    // Filtrar itens por busca
    const filteredItems = useMemo(() => {
        if (!latestVersion || !searchTerm.trim()) return latestVersion?.items || [];

        const term = searchTerm.toLowerCase();
        return latestVersion.items.filter(item =>
            item.partNumber.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term)
        );
    }, [latestVersion, searchTerm]);

    // Exportar CSV
    const handleExport = () => {
        if (!latestVersion) return;

        const csv = [
            'Nível,Part Number,Descrição,Quantidade,Material,Peso,Stock Number',
            ...filteredItems.map(item =>
                `${item.level || 0},"${item.partNumber}","${item.description}",${item.quantity},"${item.material || ''}","${item.weight || ''}","${item.stockNumber || ''}"`
            )
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BOM_M${machineId}_V${latestVersion.versionNumber}.csv`;
        a.click();
        URL.revokeObjectURL(url);
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
                            <span>{latestVersion.itemCount} itens</span>
                            <span>Versão {latestVersion.versionNumber}</span>
                            <span>Por {latestVersion.extractedBy}</span>
                            <span>{new Date(latestVersion.extractedAt).toLocaleString('pt-BR')}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {onOpenFile && (
                            <button
                                onClick={onOpenFile}
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
                        {filteredItems.length} de {latestVersion.itemCount} itens
                    </p>
                )}
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
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
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredItems.map((item, index) => (
                            <tr key={`${item.partNumber}-${index}`} className="hover:bg-gray-50">
                                <td
                                    className="px-6 py-4 whitespace-nowrap"
                                    style={{ paddingLeft: `${24 + (item.level || 0) * 20}px` }}
                                >
                                    <div className="flex items-center gap-2">
                                        {item.isAssembly ? (
                                            <Package className="w-4 h-4 text-blue-600" />
                                        ) : (
                                            <Wrench className="w-4 h-4 text-gray-600" />
                                        )}
                                        <span className="text-sm font-medium text-gray-900">
                                            {item.partNumber}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600">
                                        {item.description || (
                                            <span className="text-gray-400 italic">Sem descrição</span>
                                        )}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {item.quantity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.material || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.weight ? `${item.weight.toFixed(2)} kg` : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-1">
                                        <button
                                            className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                            title="Abrir DWG (Em desenvolvimento)"
                                        >
                                            DWG
                                        </button>
                                        <button
                                            className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                            title="Abrir PDF (Em desenvolvimento)"
                                        >
                                            PDF
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Total: {filteredItems.length} itens</span>
                    <span>
                        Quantidade total: {filteredItems.reduce((sum, item) => sum + item.quantity, 0)} peças
                    </span>
                </div>
            </div>
        </div>
    );
};
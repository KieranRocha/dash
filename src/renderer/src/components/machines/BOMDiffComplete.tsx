// src/renderer/src/components/machines/BOMDiffComplete.tsx
import React, { useState, useEffect } from 'react';
import { GitCompare, Plus, Minus, Edit2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

// ===== TIPOS =====
interface BomVersionSummary {
    id: number;
    versionNumber: number;
    extractedAt: string;
    extractedBy: string;
    itemCount: number;
}

interface BomComparisonResult {
    hasChanges: boolean;
    changes: BomDiff[];
    totalAdded: number;
    totalRemoved: number;
    totalModified: number;
    summary: string;
}

interface BomDiff {
    partNumber: string;
    description: string;
    type: 'Added' | 'Removed' | 'Modified';
    oldValue?: BomDiffDetail;
    newValue?: BomDiffDetail;
}

interface BomDiffDetail {
    quantity: number;
    description?: string;
    stockNumber?: string;
}

// ===== API SERVICE =====
class BOMDiffAPIService {
    private baseUrl = "http://localhost:5047";

    async getMachineVersionsList(machineId: number): Promise<BomVersionSummary[]> {
        const response = await fetch(`${this.baseUrl}/api/boms/machine/${machineId}/versions`);
        if (!response.ok) throw new Error(`Erro ao buscar versões: ${response.statusText}`);
        return response.json();
    }

    async compareBomVersions(machineId: number, version1: number, version2: number): Promise<BomComparisonResult> {
        const response = await fetch(`${this.baseUrl}/api/boms/machine/${machineId}/compare/${version1}/${version2}`);
        if (!response.ok) throw new Error(`Erro ao comparar versões: ${response.statusText}`);
        return response.json();
    }
}

const bomDiffApi = new BOMDiffAPIService();

// ===== COMPONENTES =====
interface BOMDiffTabProps {
    machineId: number;
    projectId: number;
    onBack?: () => void;
}

export const BOMDiffComplete: React.FC<BOMDiffTabProps> = ({ machineId, projectId, onBack }) => {
    const [versions, setVersions] = useState<BomVersionSummary[]>([]);
    const [selectedVersion1, setSelectedVersion1] = useState<number | null>(null);
    const [selectedVersion2, setSelectedVersion2] = useState<number | null>(null);
    const [comparison, setComparison] = useState<BomComparisonResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadVersions();
    }, [machineId]);

    const loadVersions = async () => {
        try {
            setError(null);
            const data = await bomDiffApi.getMachineVersionsList(machineId);
            setVersions(data);

            // Auto-selecionar últimas duas versões
            if (data.length >= 2) {
                setSelectedVersion1(data[data.length - 2].versionNumber);
                setSelectedVersion2(data[data.length - 1].versionNumber);
            }
        } catch (err: any) {
            setError(`Erro ao carregar versões: ${err.message}`);
        }
    };

    const compareVersions = async () => {
        if (!selectedVersion1 || !selectedVersion2) return;

        setLoading(true);
        setError(null);

        try {
            const result = await bomDiffApi.compareBomVersions(machineId, selectedVersion1, selectedVersion2);
            setComparison(result);
        } catch (err: any) {
            setError(`Erro ao comparar versões: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedVersion1 && selectedVersion2 && selectedVersion1 !== selectedVersion2) {
            compareVersions();
        }
    }, [selectedVersion1, selectedVersion2]);

    const getDiffIcon = (type: string) => {
        switch (type) {
            case 'Added': return <Plus className="w-4 h-4 text-green-600" />;
            case 'Removed': return <Minus className="w-4 h-4 text-red-600" />;
            case 'Modified': return <Edit2 className="w-4 h-4 text-blue-600" />;
            default: return null;
        }
    };

    const getDiffRowClass = (type: string) => {
        switch (type) {
            case 'Added': return 'bg-green-50 border-l-4 border-green-400';
            case 'Removed': return 'bg-red-50 border-l-4 border-red-400';
            case 'Modified': return 'bg-blue-50 border-l-4 border-blue-400';
            default: return '';
        }
    };

    const getDiffBadgeClass = (type: string) => {
        switch (type) {
            case 'Added': return 'bg-green-100 text-green-800';
            case 'Removed': return 'bg-red-100 text-red-800';
            case 'Modified': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDiffLabel = (type: string) => {
        switch (type) {
            case 'Added': return 'Adicionado';
            case 'Removed': return 'Removido';
            case 'Modified': return 'Modificado';
            default: return type;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            {onBack && (
                <div className="mb-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </button>
                </div>
            )}

            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <GitCompare className="w-6 h-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Comparação de BOMs</h1>
                </div>
            </div>

            {/* Seletores de Versão */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecionar Versões</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Versão Base (Antiga)
                        </label>
                        <select
                            value={selectedVersion1 || ''}
                            onChange={(e) => setSelectedVersion1(Number(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Selecione a versão base</option>
                            {versions.map((version) => (
                                <option key={version.id} value={version.versionNumber}>
                                    V{version.versionNumber} - {new Date(version.extractedAt).toLocaleDateString('pt-BR')}
                                    ({version.itemCount} itens)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Versão Comparada (Nova)
                        </label>
                        <select
                            value={selectedVersion2 || ''}
                            onChange={(e) => setSelectedVersion2(Number(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Selecione a versão a comparar</option>
                            {versions.map((version) => (
                                <option key={version.id} value={version.versionNumber}>
                                    V{version.versionNumber} - {new Date(version.extractedAt).toLocaleDateString('pt-BR')}
                                    ({version.itemCount} itens)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Informações das versões selecionadas */}
                {selectedVersion1 && selectedVersion2 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">
                            Comparando <strong>V{selectedVersion1}</strong> com <strong>V{selectedVersion2}</strong>
                        </div>
                    </div>
                )}
            </div>

            {/* Estados */}
            {versions.length === 0 && !error && (
                <div className="text-center py-12">
                    <GitCompare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma versão encontrada</h3>
                    <p className="text-gray-500">Esta máquina ainda não possui versões BOM salvas.</p>
                </div>
            )}

            {versions.length === 1 && (
                <div className="text-center py-12">
                    <GitCompare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Comparação não disponível</h3>
                    <p className="text-gray-500">São necessárias pelo menos 2 versões BOM para comparação.</p>
                    <p className="text-gray-500 mt-2">Versão atual: V{versions[0]?.versionNumber}</p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Comparando versões...</p>
                </div>
            )}

            {/* Erro */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="text-red-800 font-medium">Erro</span>
                    </div>
                    <p className="text-red-700 mt-1">{error}</p>
                    <button
                        onClick={loadVersions}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {/* Resultados da Comparação */}
            {comparison && !loading && versions.length >= 2 && (
                <div className="space-y-6">
                    {/* Resumo */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {comparison.hasChanges ? (
                                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                                ) : (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                )}
                                <span className="text-xl font-semibold text-gray-900">
                                    {comparison.hasChanges ? 'Mudanças detectadas' : 'Nenhuma mudança'}
                                </span>
                                {comparison.hasChanges && (
                                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                                        {comparison.summary}
                                    </span>
                                )}
                            </div>

                            {comparison.hasChanges && (
                                <div className="flex gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Plus className="w-4 h-4 text-green-600" />
                                        <span className="text-gray-600">{comparison.totalAdded} adicionados</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Minus className="w-4 h-4 text-red-600" />
                                        <span className="text-gray-600">{comparison.totalRemoved} removidos</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Edit2 className="w-4 h-4 text-blue-600" />
                                        <span className="text-gray-600">{comparison.totalModified} modificados</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabela de Mudanças */}
                    {comparison.hasChanges && (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Detalhes das Mudanças ({comparison.changes.length} itens)
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Item
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Mudança
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantidade
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Descrição
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock Number
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {comparison.changes.map((change, index) => (
                                            <tr key={index} className={getDiffRowClass(change.type)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {getDiffIcon(change.type)}
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {change.partNumber}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {change.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDiffBadgeClass(change.type)}`}>
                                                        {getDiffLabel(change.type)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {change.type === 'Modified' ? (
                                                        <div className="space-y-1">
                                                            <div className="line-through text-red-600">
                                                                {change.oldValue?.quantity}
                                                            </div>
                                                            <div className="text-green-600 font-medium">
                                                                {change.newValue?.quantity}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className={change.type === 'Added' ? 'text-green-600 font-medium' :
                                                            change.type === 'Removed' ? 'text-red-600' : ''}>
                                                            {change.oldValue?.quantity || change.newValue?.quantity || '-'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {change.type === 'Modified' &&
                                                        change.oldValue?.description !== change.newValue?.description ? (
                                                        <div className="space-y-1">
                                                            <div className="line-through text-red-600 text-xs">
                                                                {change.oldValue?.description || '-'}
                                                            </div>
                                                            <div className="text-green-600 text-xs font-medium">
                                                                {change.newValue?.description || '-'}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs">
                                                            {change.oldValue?.description || change.newValue?.description || '-'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {change.type === 'Modified' &&
                                                        change.oldValue?.stockNumber !== change.newValue?.stockNumber ? (
                                                        <div className="space-y-1">
                                                            <div className="line-through text-red-600 text-xs">
                                                                {change.oldValue?.stockNumber || '-'}
                                                            </div>
                                                            <div className="text-green-600 text-xs font-medium">
                                                                {change.newValue?.stockNumber || '-'}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs">
                                                            {change.oldValue?.stockNumber || change.newValue?.stockNumber || '-'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {!comparison.hasChanges && (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Versões idênticas
                            </h3>
                            <p className="text-gray-500">
                                Nenhuma diferença foi encontrada entre as versões V{selectedVersion1} e V{selectedVersion2}.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BOMDiffComplete;


// ==========================================================================
// EXEMPLO DE INTEGRAÇÃO NO MachineDetail.tsx
//
// 1. Importar o componente:
// import BOMDiffComplete from './BOMDiffComplete';
//
// 2. Adicionar aba nas tabs:
// const tabs = [
//   { id: 'info', label: 'Informações', icon: FileText },
//   { id: 'bom', label: 'BOM', icon: Database },
//   { id: 'diff', label: 'Comparar', icon: GitCompare }, // NOVA ABA
//   { id: 'history', label: 'Histórico', icon: Clock }
// ];
//
// 3. Adicionar no switch de conteúdo:
// {activeTab === 'diff' && (
//   <BOMDiffComplete
//     machineId={machine.id}
//     projectId={machine.projectId}
//   />
// )}
// ==========================================================================
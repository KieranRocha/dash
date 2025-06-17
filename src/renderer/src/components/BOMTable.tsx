import React from 'react';
import { BOMItem } from '../types/index';
import { Button } from './ui/Button';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface BOMTableProps {
    bomData: BOMItem[];
    loading?: boolean;
    onRefresh?: () => void;
}

export const BOMTable: React.FC<BOMTableProps> = ({
    bomData,
    loading = false,
    onRefresh
}) => {
    if (loading) {
        return <LoadingSpinner />;
    }

    if (!bomData || bomData.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Nenhum item encontrado na BOM</p>
                {onRefresh && (
                    <Button onClick={onRefresh}>Atualizar</Button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                    Lista de Materiais ({bomData.length} itens)
                </h3>
                {onRefresh && (
                    <Button variant="secondary" onClick={onRefresh}>
                        Atualizar
                    </Button>
                )}
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Nível
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Part Number
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Descrição
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Quantidade
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Massa (kg)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Material
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bomData.map((item, index) => (
                            <tr key={`${item.partNumber}-${index}`} className="hover:bg-gray-50">
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
                                    {item.mass.toFixed(3)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.material}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
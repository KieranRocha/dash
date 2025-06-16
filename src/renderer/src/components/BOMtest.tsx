// src/components/BomView.jsx

import React, { useState, useEffect } from 'react';
import { FiFileText, FiCpu, FiAlertTriangle, FiChevronsRight, FiDownload, FiEye, FiPaperclip } from 'react-icons/fi';

const Spinner = () => (
    <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
);

export default function BomView() {
    const [bomData, setBomData] = useState(null);
    const [activeDocument, setActiveDocument] = useState(null);
    const [inventorStatus, setInventorStatus] = useState({ isRunning: false, version: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const apiRequest = async (endpoint, options = {}) => {
        try {
            const response = await fetch(`/api/BOM${endpoint}`, {
                headers: { 'Content-Type': 'application/json' },
                ...options,
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || errData.error || `Erro ${response.status}`);
            }
            return response.json();
        } catch (err) {
            console.error(`API Error on ${endpoint}:`, err);
            setError(err.message);
            return null;
        }
    };

    useEffect(() => {
        const getInitialData = async () => {
            setIsLoading(true);
            setError('');
            const status = await apiRequest('/status');
            if (status) setInventorStatus({ isRunning: status.inventorRunning, version: status.inventorVersion });

            const doc = await apiRequest('/active-document');
            if (doc) setActiveDocument(doc);

            setIsLoading(false);
        };
        getInitialData();
    }, []);

    const handleExtractBom = async () => {
        if (!activeDocument?.hasActiveDocument) {
            setError("Nenhum documento de montagem ativo no Inventor para extrair a BOM.");
            return;
        }

        setIsLoading(true);
        setError('');
        setBomData(null);

        const result = await apiRequest('/extract-from-open', {
            method: 'POST',
            body: JSON.stringify({ fileName: activeDocument.activeDocument.fileName }),
        });

        console.log("Resposta recebida da API:", result);

        if (result && Array.isArray(result.bomData)) {
            const sortedBom = result.bomData.sort((a, b) => {
                const partA = a.partNumber || '';
                const partB = b.partNumber || '';
                return partA.localeCompare(partB);
            });
            setBomData(sortedBom);
        } else {
            setError("A resposta da API não continha os dados da BOM no formato esperado.");
            console.error("Estrutura inesperada recebida:", result);
        }

        setIsLoading(false);
    };

    const handleOpenFile = async (filePath) => {
        if (!filePath) {
            setError("Caminho do arquivo não encontrado para este componente.");
            return;
        }
        const result = await apiRequest('/open-file', {
            method: 'POST',
            body: JSON.stringify({ filePath }),
        });
        if (!result) setError("Falha ao tentar abrir o arquivo no Inventor.");
    };

    const handleOpenDwg = async (partNumber) => {
        if (!partNumber) {
            setError("Part Number não disponível para buscar o DWG.");
            return;
        }
        alert(`Tentando abrir o DWG para: ${partNumber}\n(Função de exemplo)`);
    };

    const handleExportPdf = (partNumber) => {
        alert(`Função "Exportar PDF" para ${partNumber} ainda não implementada.`);
    };


    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">

                <header className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Consulta de Lista de Materiais (BOM)</h1>
                            <p className="text-sm text-gray-500">Interface para extrair e visualizar dados de montagens do Inventor.</p>
                        </div>
                        <div className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full ${inventorStatus.isRunning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {inventorStatus.isRunning ? <FiCpu /> : <FiAlertTriangle />}
                            <span>{inventorStatus.isRunning ? `Inventor ${inventorStatus.version} Conectado` : 'Inventor Desconectado'}</span>
                        </div>
                    </div>
                    <div className="mt-4 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                <strong>Documento Ativo: </strong>
                                {activeDocument?.hasActiveDocument ?
                                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">{activeDocument.activeDocument.fileName}</span> :
                                    <span className="font-mono bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Nenhum</span>
                                }
                            </div>
                            <button
                                onClick={handleExtractBom}
                                disabled={!inventorStatus.isRunning || !activeDocument?.hasActiveDocument || isLoading}
                                className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <FiChevronsRight size={20} />
                                Extrair BOM do Documento Ativo
                            </button>
                        </div>
                    </div>
                </header>

                <main className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    {isLoading && <Spinner />}

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                            <div className="flex items-center">
                                <FiAlertTriangle className="text-red-600 mr-3" size={24} />
                                <div>
                                    <p className="font-bold text-red-800">Ocorreu um Erro</p>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {bomData && bomData.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nível</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd.</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Massa (kg)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* ✅✅✅ INÍCIO DA CORREÇÃO ✅✅✅ */}
                                    {bomData.map((item, index) => (
                                        <tr key={`${item.partNumber}-${index}`} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span style={{ paddingLeft: `${item.level * 20}px` }}>{item.level}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.partNumber}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.mass.toFixed(3)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.material}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleOpenFile(item.documentPath)} title="Abrir no Inventor" className="text-blue-600 hover:text-blue-900"><FiEye /></button>
                                                    <button onClick={() => handleOpenDwg(item.partNumber)} title="Abrir DWG" className="text-gray-600 hover:text-gray-900"><FiPaperclip /></button>
                                                    <button onClick={() => handleExportPdf(item.partNumber)} title="Exportar PDF" className="text-red-600 hover:text-red-900"><FiDownload /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* ✅✅✅ FIM DA CORREÇÃO ✅✅✅ */}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {bomData && bomData.length === 0 && !isLoading && (
                        <div className="text-center py-10">
                            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum item na BOM</h3>
                            <p className="mt-1 text-sm text-gray-500">A extração foi concluída, mas a lista de materiais está vazia.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
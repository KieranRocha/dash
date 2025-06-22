import React, { useState, useEffect } from 'react';

interface MachineStatus {
    machineId: string;
    projectId?: string;
    status: string;
    fileName: string;
    userName: string;
    machineName: string;
    lastUpdate: string;
    currentBOM?: any;
}

export const MachineActiveDashboard: React.FC = () => {
    const [activeMachines, setActiveMachines] = useState<MachineStatus[]>([]);
    const [selectedMachine, setSelectedMachine] = useState<MachineStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActiveMachines();

        // Atualizar a cada 30 segundos
        const interval = setInterval(loadActiveMachines, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadActiveMachines = async () => {
        try {
            const response = await fetch('/api/machine-status/active');
            const machines = await response.json();
            setActiveMachines(machines);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar máquinas:', error);
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'TRABALHANDO': return 'bg-green-100 text-green-800';
            case 'ABERTA': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('pt-BR');
    };

    if (loading) {
        return <div className="p-4">Carregando máquinas ativas...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Máquinas CAD Ativas</h1>
                <p className="text-gray-600">
                    {activeMachines.length} máquina(s) sendo trabalhada(s) no momento
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lista de Máquinas */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Máquinas Ativas</h2>

                    {activeMachines.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                            Nenhuma máquina sendo trabalhada no momento
                        </div>
                    ) : (
                        activeMachines.map((machine) => (
                            <div
                                key={machine.machineId}
                                className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                  ${selectedMachine?.machineId === machine.machineId ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                                onClick={() => setSelectedMachine(machine)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-lg">{machine.machineId}</h3>
                                        <p className="text-sm text-gray-600">Projeto: {machine.projectId || 'N/A'}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(machine.status)}`}>
                                        {machine.status}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-500 space-y-1">
                                    <div>📁 {machine.fileName}</div>
                                    <div>👤 {machine.userName} em {machine.machineName}</div>
                                    <div>🕒 {formatTime(machine.lastUpdate)}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* BOM da Máquina Selecionada */}
                <div className="bg-white border rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">
                        {selectedMachine ? `BOM - ${selectedMachine.machineId}` : 'Selecione uma máquina'}
                    </h2>

                    {selectedMachine ? (
                        <div>
                            {selectedMachine.currentBOM && selectedMachine.currentBOM.items ? (
                                <div>
                                    <div className="mb-4 text-sm text-gray-600">
                                        Total de itens: {selectedMachine.currentBOM.items.length}
                                    </div>

                                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th className="text-left p-2">Nível</th>
                                                    <th className="text-left p-2">Part Number</th>
                                                    <th className="text-left p-2">Descrição</th>
                                                    <th className="text-right p-2">Qtd</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedMachine.currentBOM.items.map((item: any, index: number) => (
                                                    <tr key={index} className="border-t hover:bg-gray-50">
                                                        <td className="p-2">{item.level}</td>
                                                        <td className="p-2 font-mono text-xs">{item.partNumber}</td>
                                                        <td className="p-2">{item.description || 'N/A'}</td>
                                                        <td className="p-2 text-right">{item.quantity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    BOM não disponível para esta máquina
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            Clique em uma máquina para ver seu BOM
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 text-xs text-gray-400 text-center">
                Última atualização: {new Date().toLocaleString('pt-BR')} | Atualiza automaticamente a cada 30s
            </div>
        </div>
    );
};
import React, { useState } from 'react';
import { Machine } from '../../../types/machines';

interface StepProps {
    data: { machines?: Machine[] };
    updateData: (data: { machines: Machine[] }) => void;
}

export const Step4_Machines: React.FC<StepProps> = ({ data, updateData }) => {
    const [machines, setMachines] = useState<Machine[]>(data.machines || []);
    const [newMachineName, setNewMachineName] = useState('');
    const [newMachineCode, setNewMachineCode] = useState('');

    const handleAddMachine = () => {
        if (!newMachineName.trim()) return;
        const newMachine: Machine = {
            id: `temp-${Date.now()}`,
            name: newMachineName,
            code: newMachineCode,
        };
        const updatedMachines = [...machines, newMachine];
        setMachines(updatedMachines);
        updateData({ machines: updatedMachines });
        setNewMachineName('');
        setNewMachineCode('');
    };

    const handleRemoveMachine = (id: number | string) => {
        const updatedMachines = machines.filter(m => m.id !== id);
        setMachines(updatedMachines);
        updateData({ machines: updatedMachines });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddMachine();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-2xl font-bold text-gray-900">Configuração de Máquinas</h3>
                <p className="text-gray-600 mt-1">
                    Adicione as máquinas ou equipamentos principais que fazem parte deste projeto.
                </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Add Machine Form */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                        <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <h4 className="text-sm font-semibold text-gray-900">Nova Máquina</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Nome da Máquina *
                            </label>
                            <input
                                type="text"
                                value={newMachineName}
                                onChange={(e) => setNewMachineName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ex: Prensa Hidráulica P-100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Código
                            </label>
                            <input
                                type="text"
                                value={newMachineCode}
                                onChange={(e) => setNewMachineCode(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ex: PH-P100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleAddMachine}
                            disabled={!newMachineName.trim()}
                            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Adicionar</span>
                        </button>
                    </div>
                </div>

                {/* Machines List */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h4 className="text-sm font-semibold text-gray-900">Máquinas no Projeto</h4>
                        </div>

                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {machines.length}
                        </div>
                    </div>

                    {machines.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500">Nenhuma máquina adicionada ainda</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {machines.map((machine, index) => (
                                <div
                                    key={machine.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-900 text-sm">{machine.name}</h5>
                                            {machine.code && (
                                                <p className="text-xs text-gray-500">{machine.code}</p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveMachine(machine.id)}
                                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                        title="Remover máquina"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
import React, { useState } from 'react';
import { Machine } from '../../../types/index';

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

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Configuração de Máquinas</h3>
            <p className="text-gray-500">Adicione as máquinas ou equipamentos principais que fazem parte deste projeto.</p>

            {/* Formulário para adicionar nova máquina */}
            <div className="flex items-end gap-4 p-4 border border-dashed rounded-lg">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Nome da Máquina</label>
                    <input type="text" value={newMachineName} onChange={(e) => setNewMachineName(e.target.value)} placeholder="Ex: Prensa Hidráulica P-100" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Código</label>
                    <input type="text" value={newMachineCode} onChange={(e) => setNewMachineCode(e.target.value)} placeholder="Ex: PH-P100" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <button type="button" onClick={handleAddMachine} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Adicionar</button>
            </div>

            {/* Lista de máquinas adicionadas */}
            <div className="space-y-3">
                <h4 className="text-md font-medium text-gray-600">Máquinas no Projeto ({machines.length})</h4>
                {machines.length === 0 ? (
                    <p className="text-sm text-gray-400">Nenhuma máquina adicionada ainda.</p>
                ) : (
                    <ul className="border rounded-md divide-y">
                        {machines.map((machine) => (
                            <li key={machine.id} className="p-3 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{machine.name}</p>
                                    <p className="text-sm text-gray-500">{machine.code}</p>
                                </div>
                                <button type="button" onClick={() => handleRemoveMachine(machine.id)} className="text-red-500 hover:text-red-700">Remover</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
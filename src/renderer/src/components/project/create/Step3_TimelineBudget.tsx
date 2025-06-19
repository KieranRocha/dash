import React from 'react';

interface StepProps {
    data: any;
    updateData: (data: any) => void;
}

export const Step3_TimelineBudget: React.FC<StepProps> = ({ data, updateData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateData({ [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Prazos e Orçamento</h3>
            <p className="text-gray-500">Defina as datas e os valores planejados para o projeto.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data de Início</label>
                    <input type="date" name="startDate" id="startDate" value={data.startDate || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data de Término Prevista</label>
                    <input type="date" name="endDate" id="endDate" value={data.endDate || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="budgetValue" className="block text-sm font-medium text-gray-700">Valor do Orçamento (R$)</label>
                    <input
                        type="number"
                        name="budgetValue"
                        id="budgetValue"
                        value={data.budgetValue || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        placeholder="Ex: 50000"
                    />
                </div>
                <div>
                    <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">Total de Horas Estimadas</label>
                    <input
                        type="number"
                        name="estimatedHours"
                        id="estimatedHours"
                        value={data.estimatedHours || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        placeholder="Ex: 400"
                    />
                </div>
            </div>
        </div>
    );
};
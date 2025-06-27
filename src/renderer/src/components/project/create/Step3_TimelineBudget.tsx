import React from 'react';
import { Calendar, DollarSign, Clock } from 'lucide-react';

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
            {/* Header */}
            <div>
                <h3 className="text-2xl font-bold text-gray-900">Prazos e Orçamento</h3>
                <p className="text-gray-600 mt-1">Defina as datas e os valores planejados para o projeto.</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Timeline */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                        <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                        <h4 className="text-sm font-semibold text-gray-900">Cronograma</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-xs font-medium text-gray-700 mb-1">
                                Data de Início
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                id="startDate"
                                value={data.startDate || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-xs font-medium text-gray-700 mb-1">
                                Data de Término Prevista
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                id="endDate"
                                value={data.endDate || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Budget */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                        <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                        <h4 className="text-sm font-semibold text-gray-900">Orçamento</h4>
                    </div>

                    <div>
                        <label htmlFor="budgetValue" className="block text-xs font-medium text-gray-700 mb-1">
                            Valor do Orçamento (R$)
                        </label>
                        <input
                            type="number"
                            name="budgetValue"
                            id="budgetValue"
                            value={data.budgetValue || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                            placeholder="Ex: 50000"
                        />
                    </div>
                </div>

                {/* Hours */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                        <Clock className="w-4 h-4 text-purple-600 mr-2" />
                        <h4 className="text-sm font-semibold text-gray-900">Estimativa de Tempo</h4>
                    </div>

                    <div>
                        <label htmlFor="estimatedHours" className="block text-xs font-medium text-gray-700 mb-1">
                            Total de Horas Estimadas
                        </label>
                        <input
                            type="number"
                            name="estimatedHours"
                            id="estimatedHours"
                            value={data.estimatedHours || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            placeholder="Ex: 400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
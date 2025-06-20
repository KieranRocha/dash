// src/components/project/create/Step1_BasicInfo.tsx
import React from 'react';

interface StepProps {
    data: any;
    updateData: (data: any) => void;
}

export const Step1_BasicInfo: React.FC<StepProps> = ({ data, updateData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateData({ [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Informações Fundamentais</h3>
            <p className="text-gray-500">Comece com os detalhes principais que identificam o projeto.</p>

            {/* Campo Nome do Projeto */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome do Projeto <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={data.name || ''}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Sistema de Transporte Automatizado"
                />
            </div>

            {/* Campo Nº do Contrato */}
            <div>
                <label htmlFor="contractNumber" className="block text-sm font-medium text-gray-700">
                    Número do Contrato/Proposta
                </label>
                <input
                    type="text"
                    name="contractNumber"
                    id="contractNumber"
                    value={data.contractNumber || ''}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
                    placeholder="Ex: C-2025-042"
                />
            </div>

            {/* Campo Cliente */}
            <div>
                <label htmlFor="client" className="block text-sm font-medium text-gray-700 ">
                    Cliente
                </label>
                <input
                    type="text"
                    name="client"
                    id="client"
                    value={data.client || ''}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm "
                    placeholder="Ex: ACME Corporation"
                />
            </div>
        </div>
    );
};
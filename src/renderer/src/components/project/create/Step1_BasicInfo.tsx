import React, { useState, useEffect } from 'react';
import { ClipboardList, FileText, Building, AlertCircle, CheckCircle } from 'lucide-react';

interface StepProps {
    data: any;
    updateData: (data: any) => void;
}

// Na prática, esta lista viria de uma API ou de um arquivo de configuração central
const clients = ["ACME Corporation", "Stark Industries", "Wayne Enterprises", "Cyberdyne Systems"];

export const Step1_BasicInfo: React.FC<StepProps> = ({ data, updateData }) => {
    const [errors, setErrors] = useState<{ name?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateData({ ...data, [name]: value });
    };

    useEffect(() => {
        if (!data.name || data.name.trim() === '') {
            setErrors(prev => ({ ...prev, name: 'O nome do projeto é obrigatório.' }));
        } else {
            setErrors(prev => ({ ...prev, name: undefined }));
        }
    }, [data.name]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-2xl font-bold text-gray-900">Informações Fundamentais</h3>
                <p className="text-gray-600 mt-1">Comece com os detalhes principais que identificam o projeto.</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Project Name */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                        <ClipboardList className="w-4 h-4 text-blue-600 mr-2" />
                        Nome do Projeto <span className="text-red-500 ml-1">*</span>
                    </label>

                    <div className="relative">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={data.name || ''}
                            onChange={handleChange}
                            required
                            className={`
                                w-full px-3 py-2 border rounded-lg transition-all pr-10
                                ${errors.name ?
                                    'border-red-300 focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-red-50' :
                                    data.name ?
                                        'border-green-300 focus:ring-1 focus:ring-green-500 focus:border-green-500' :
                                        'border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                                }
                            `}
                            placeholder="Ex: Sistema de Transporte Automatizado"
                        />

                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            {errors.name && data.name !== undefined ? (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                            ) : data.name ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : null}
                        </div>
                    </div>

                    {errors.name && data.name !== undefined && (
                        <p className="text-red-600 text-xs mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" /> {errors.name}
                        </p>
                    )}
                </div>

                {/* Contract Number */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <label htmlFor="contractNumber" className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                        <FileText className="w-4 h-4 text-purple-600 mr-2" />
                        Número do Contrato/Proposta
                    </label>

                    <input
                        type="text"
                        name="contractNumber"
                        id="contractNumber"
                        value={data.contractNumber || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="Ex: C-2025-042"
                    />
                </div>

                {/* Client Selection */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <label htmlFor="client" className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                        <Building className="w-4 h-4 text-green-600 mr-2" />
                        Cliente
                    </label>

                    <div className="relative">
                        <select
                            id="client"
                            name="client"
                            value={data.client || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all bg-white appearance-none"
                        >
                            <option value="" disabled>Selecione um cliente...</option>
                            {clients.map(clientName => (
                                <option key={clientName} value={clientName}>{clientName}</option>
                            ))}
                            <option value="outro">Outro (adicionar novo)</option>
                        </select>

                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
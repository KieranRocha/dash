import React from 'react';
import { FileText, User, Folder } from 'lucide-react';
import config from "../../../../../../synapseConfig.json"

interface StepProps {
    data: any;
    updateData: (data: any) => void;
}

export const Step2_Scope: React.FC<StepProps> = ({ data, updateData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateData({ [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-2xl font-bold text-gray-900">Escopo e Detalhes</h3>
                <p className="text-gray-600 mt-1">Forneça uma descrição clara e defina o responsável técnico.</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Project Description */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <label htmlFor="description" className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                        <FileText className="w-4 h-4 text-blue-600 mr-2" />
                        Descrição Detalhada do Projeto
                    </label>

                    <textarea
                        name="description"
                        id="description"
                        rows={4}
                        value={data.description || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        placeholder="Descreva os objetivos, entregáveis e requisitos principais do projeto."
                    />
                </div>

                {/* Responsible Engineer */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <label htmlFor="responsibleEngineer" className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                        <User className="w-4 h-4 text-green-600 mr-2" />
                        Engenheiro Responsável
                    </label>

                    <input
                        type="text"
                        name="responsibleEngineer"
                        id="responsibleEngineer"
                        value={data.responsibleEngineer || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="Ex: João da Silva"
                    />
                </div>

                {/* Folder Path */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <label htmlFor="folderPath" className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                        <Folder className="w-4 h-4 text-purple-600 mr-2" />
                        Caminho da Pasta no Servidor
                    </label>

                    <div className="flex rounded-lg shadow-sm">
                        <span className="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-600 text-sm font-mono">
                            {config.PATH}
                        </span>
                        <input
                            type="text"
                            name="folderPath"
                            id="folderPath"
                            value={data.folderPath || ''}
                            onChange={handleChange}
                            className="flex-1 px-3 py-2 rounded-r-lg border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            placeholder="NOME_DO_PROJETO"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
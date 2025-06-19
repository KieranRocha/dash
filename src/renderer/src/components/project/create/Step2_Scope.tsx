import React from 'react';

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
            <h3 className="text-xl font-semibold text-gray-800">Escopo e Detalhes</h3>
            <p className="text-gray-500">Forneça uma descrição clara e defina o responsável técnico.</p>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição Detalhada do Projeto
                </label>
                <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={data.description || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    placeholder="Descreva os objetivos, entregáveis e requisitos principais do projeto."
                />
            </div>

            <div>
                <label htmlFor="responsibleEngineer" className="block text-sm font-medium text-gray-700">
                    Engenheiro Responsável
                </label>
                <input
                    type="text"
                    name="responsibleEngineer"
                    id="responsibleEngineer"
                    value={data.responsibleEngineer || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    placeholder="Ex: João da Silva"
                />
            </div>

            <div>
                <label htmlFor="folderPath" className="block text-sm font-medium text-gray-700">
                    Caminho da Pasta no Servidor
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        \\servidor\projetos\
                    </span>
                    <input
                        type="text"
                        name="folderPath"
                        id="folderPath"
                        value={data.folderPath || ''}
                        onChange={handleChange}
                        className="flex-1 block w-full rounded-none rounded-r-md border-gray-300"
                        placeholder="NOME_DO_PROJETO"
                    />
                </div>
            </div>
        </div>
    );
};
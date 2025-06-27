import React from 'react';
import { Project } from '../../../types/index';
import { ClipboardList, Calendar, DollarSign, Cog, Users } from 'lucide-react';

interface StepProps {
    data: Partial<Project>;
}

const ReviewItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
    <div>
        <dt className="text-xs font-medium text-gray-600">{label}</dt>
        <dd className="text-sm text-gray-900 font-medium">{value || 'Não informado'}</dd>
    </div>
);

export const Step6_Review: React.FC<StepProps> = ({ data }) => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-2xl font-bold text-gray-900">Revisão e Confirmação</h3>
                <p className="text-gray-600 mt-1">Revise todos os dados antes de criar o projeto.</p>
            </div>

            {/* Form Cards */}
            <div className="space-y-4">
                {/* Basic Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                        <ClipboardList className="w-4 h-4 text-blue-600 mr-2" />
                        <h4 className="text-sm font-semibold text-gray-900">Informações Gerais</h4>
                    </div>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                        <ReviewItem label="Nome do Projeto" value={data.name} />
                        <ReviewItem label="Cliente" value={data.client} />
                        <ReviewItem label="Nº do Contrato" value={data.contractNumber} />
                        <ReviewItem label="Engenheiro Responsável" value={data.responsibleEngineer} />
                        <ReviewItem label="Descrição" value={data.description} />
                        <ReviewItem label="Pasta do Projeto" value={data.folderPath} />
                    </dl>
                </div>

                {/* Timeline & Budget */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                        <Calendar className="w-4 h-4 text-green-600 mr-2" />
                        <h4 className="text-sm font-semibold text-gray-900">Prazos e Orçamento</h4>
                    </div>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                        <ReviewItem label="Data de Início" value={data.startDate} />
                        <ReviewItem label="Data de Término" value={data.endDate} />
                        <ReviewItem label="Orçamento" value={data.budgetValue ? `R$ ${data.budgetValue.toLocaleString()}` : undefined} />
                        <ReviewItem label="Horas Estimadas" value={data.estimatedHours} />
                    </dl>
                </div>

                {/* Machines & Team */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Machines */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <Cog className="w-4 h-4 text-purple-600 mr-2" />
                                <h4 className="text-sm font-semibold text-gray-900">Máquinas</h4>
                            </div>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                {data.machines?.length || 0}
                            </span>
                        </div>
                        {data.machines && data.machines.length > 0 ? (
                            <ul className="space-y-1">
                                {data.machines.map(machine => (
                                    <li key={machine.id} className="text-sm text-gray-700 flex items-center">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                                        {machine.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">Nenhuma máquina adicionada</p>
                        )}
                    </div>

                    {/* Team */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <Users className="w-4 h-4 text-orange-600 mr-2" />
                                <h4 className="text-sm font-semibold text-gray-900">Equipe</h4>
                            </div>
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                {data.team?.length || 0}
                            </span>
                        </div>
                        {data.team && data.team.length > 0 ? (
                            <ul className="space-y-1">
                                {data.team.map(user => (
                                    <li key={user.id} className="text-sm text-gray-700 flex items-center">
                                        <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                                        {user.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">Nenhum membro adicionado</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
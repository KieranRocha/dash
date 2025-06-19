import React from 'react';
import { Project } from '../../../types/index';

interface StepProps {
    data: Partial<Project>;
}

const ReviewItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value || 'Não informado'}</dd>
    </div>
);

export const Step6_Review: React.FC<StepProps> = ({ data }) => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-gray-800">Revisão e Confirmação</h3>
                <p className="text-gray-500 mt-1">Por favor, revise todos os dados antes de criar o projeto.</p>
            </div>

            {/* Seção de Informações Básicas */}
            <div className="border-t border-gray-200 pt-5">
                <h4 className="text-lg font-medium text-gray-700 mb-3">Informações Gerais</h4>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                    <ReviewItem label="Nome do Projeto" value={data.name} />
                    <ReviewItem label="Nº do Contrato" value={data.contractNumber} />
                    <ReviewItem label="Cliente" value={data.client} />
                    <ReviewItem label="Engenheiro Responsável" value={data.responsibleEngineer} />
                    <ReviewItem label="Descrição" value={data.description} />
                    <ReviewItem label="Pasta do Projeto" value={data.folderPath} />
                </dl>
            </div>

            {/* Seção de Prazos e Orçamento */}
            <div className="border-t border-gray-200 pt-5">
                <h4 className="text-lg font-medium text-gray-700 mb-3">Prazos e Orçamento</h4>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                    <ReviewItem label="Data de Início" value={data.startDate} />
                    <ReviewItem label="Data de Término" value={data.endDate} />
                    <ReviewItem label="Orçamento" value={data.budgetValue ? `R$ ${data.budgetValue}` : undefined} />
                    <ReviewItem label="Horas Estimadas" value={data.estimatedHours} />
                </dl>
            </div>

            {/* Seção de Máquinas e Equipe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-5">
                <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-3">Máquinas ({data.machines?.length || 0})</h4>
                    <ul className="list-disc list-inside text-sm text-gray-900">
                        {data.machines?.map(m => <li key={m.id}>{m.name}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-3">Equipe ({data.team?.length || 0})</h4>
                    <ul className="list-disc list-inside text-sm text-gray-900">
                        {data.team?.map(u => <li key={u.id}>{u.name}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};
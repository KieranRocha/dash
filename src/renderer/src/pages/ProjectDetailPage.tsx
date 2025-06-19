import React from 'react';
// import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { ArrowUpRightIcon } from 'lucide-react';

const Link = ({ to, children, className }: { to: string, children: React.ReactNode, className?: string }) => <a href={to} className={className}>{children}</a>

// Simulação do hook useParams para demonstração
const useParams = () => ({ projectId: '1' });

const DetailCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-base font-semibold leading-6 text-gray-900">{title}</h3>
        <div className="mt-4">{children}</div>
    </div>
);

const InfoItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm font-semibold text-gray-700">{value || 'N/A'}</dd>
    </div>
);


export const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams();
    const { project, loading, error } = useProjects(projectId);

    if (loading) {
        return <div className="text-center p-12">Carregando detalhes do projeto...</div>;
    }

    if (error) {
        return <div className="text-center p-12 text-red-600">Erro ao carregar projeto: {error.message}</div>;
    }

    if (!project) {
        return <div className="text-center p-12">Projeto não encontrado.</div>;
    }

    return (
        <div className="space-y-8">
            {/* Cabeçalho da Página */}
            <div>
                <p className="text-sm font-medium text-blue-600">{project.contractNumber}</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{project.name}</h1>
                <p className="mt-4 max-w-2xl text-lg text-gray-600">{project.description}</p>
            </div>

            {/* Grid de Detalhes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DetailCard title="Informações Gerais">
                    <dl className="space-y-4">
                        <InfoItem label="Cliente" value={project.client} />
                        <InfoItem label="Engenheiro Responsável" value={project.responsibleEngineer} />
                        <InfoItem label="Status Atual" value={project.status} />
                    </dl>
                </DetailCard>

                <DetailCard title="Prazos e Orçamento">
                    <dl className="space-y-4">
                        <InfoItem label="Data de Início" value={project.startDate ? new Date(project.startDate).toLocaleDateString('pt-BR') : undefined} />
                        <InfoItem label="Data de Término" value={project.endDate ? new Date(project.endDate).toLocaleDateString('pt-BR') : undefined} />
                        <InfoItem label="Orçamento" value={project.budgetValue ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(project.budgetValue) : undefined} />
                        <InfoItem label="Horas Estimadas" value={project.estimatedHours} />
                    </dl>
                </DetailCard>

                <DetailCard title="Equipe do Projeto">
                    <ul className="space-y-2">
                        {project.team?.map(member => (
                            <li key={member.id} className="text-sm font-medium text-gray-800">{member.name} - <span className="text-gray-500">{member.role}</span></li>
                        ))}
                    </ul>
                </DetailCard>
            </div>

            {/* Seção de Máquinas */}
            <div>
                <DetailCard title="Máquinas e Montagens">
                    {project.machines?.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {project.machines.map(machine => (
                                <li key={machine.id} className="py-4">
                                    <Link to={`/projects/${project.id}/machines/${machine.id}/bom`} className="group flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-blue-700 group-hover:underline">{machine.name}</p>
                                            <p className="text-sm text-gray-500">{machine.code}</p>
                                        </div>
                                        <ArrowUpRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">Nenhuma máquina foi configurada para este projeto.</p>
                    )}
                </DetailCard>
            </div>
        </div>
    )
}
import React, { useState, useMemo } from 'react';
// import { Link } from 'react-router-dom'; // Descomente ao usar react-router
import { useProjects } from '../hooks/useProjects';
import { Project } from '../types';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { api } from '../services/api';

// Simulação do componente Link para demonstração
const Link = ({ to, children, className }: { to: string, children: React.ReactNode, className?: string }) => <a href={to} className={className}>{children}</a>

export const ProjectsPage: React.FC = () => {
    // Conectado diretamente à sua API através do hook
    const { projects, loading, error, refetch } = useProjects();

    const [searchTerm, setSearchTerm] = useState('');
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

    const filteredProjects = useMemo(() => {
        if (!projects) return [];
        return projects.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.contractNumber && p.contractNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.client && p.client.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [projects, searchTerm]);

    const handleDeleteClick = (project: Project) => {
        setProjectToDelete(project);
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;

        setIsSubmittingDelete(true);
        try {
            await api.deleteProject(projectToDelete.id);
            setProjectToDelete(null);
            refetch(); // Dispara a recarga dos dados para atualizar a lista
        } catch (err) {
            console.error("Falha ao excluir o projeto", err);
            // Aqui você pode mostrar uma notificação de erro para o usuário
            alert("Erro ao excluir o projeto.");
        } finally {
            setIsSubmittingDelete(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return <tr><td colSpan={4} className="text-center p-8 text-gray-500">Carregando projetos...</td></tr>;
        }

        if (error) {
            return <tr><td colSpan={4} className="text-center p-8 text-red-600">Falha ao carregar os dados do servidor.</td></tr>;
        }

        if (filteredProjects.length === 0) {
            return <tr><td colSpan={4} className="text-center p-8 text-gray-500">Nenhum projeto encontrado.</td></tr>;
        }

        return filteredProjects.map((project) => (
            <tr key={project.id}>
                <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div className="flex items-center">
                        <div className="font-medium text-gray-900">
                            <Link to={`/projects/${project.id}`} className="hover:text-blue-600">{project.name}</Link>
                        </div>
                    </div>
                    <div className="mt-1 text-gray-500">{project.contractNumber}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{project.client}</td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${project.status === 'Active' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' :
                        project.status === 'Planning' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20' :
                            'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10'
                        }`}>
                        {project.status}
                    </span>
                </td>
                <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 space-x-4">
                    <button onClick={() => alert("Função de editar não implementada.")} className="text-blue-600 hover:text-blue-900">Editar</button>
                    <button onClick={() => handleDeleteClick(project)} className="text-red-600 hover:text-red-900">Excluir</button>
                </td>
            </tr>
        ));
    }

    return (
        <>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold leading-6 text-gray-900">Projetos</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Uma lista de todos os projetos no seu sistema.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        to="/projects/new"
                        className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                    >
                        Novo Projeto
                    </Link>
                </div>
            </div>

            <div className="mt-6">
                <input
                    type="text"
                    placeholder="Pesquisar por nome, contrato ou cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                />
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Nome / Contrato</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cliente</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Ações</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {renderContent()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {projectToDelete && (
                <DeleteConfirmationModal
                    isLoading={isSubmittingDelete}
                    onConfirm={confirmDelete}
                    onCancel={() => setProjectToDelete(null)}
                />
            )}
        </>
    );
};
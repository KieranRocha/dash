import React from 'react';
import { useProjects } from '../hooks/useAPI';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorMessage } from './ui/ErrorMessage';

export const ProjectList: React.FC = () => {
    const { projects, loading, error } = useProjects();

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error.message} />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
                <div
                    key={project.id}
                    className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer"
                >
                    <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                        Status: <span className="capitalize">{project.status}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        {project.machineCount} máquinas
                    </p>
                    {project.lastActivity && (
                        <p className="text-xs text-gray-500 mt-2">
                            Última atividade: {new Date(project.lastActivity).toLocaleDateString()}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};
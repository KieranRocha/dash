import React from 'react';
import { Clock, User, Target } from 'lucide-react';
import { ProjectActivity } from '../../hooks/useDashboard';

interface ProjectActivityCardProps {
    project: ProjectActivity;
    onClick?: () => void;
}

export const ProjectActivityCard: React.FC<ProjectActivityCardProps> = ({
    project,
    onClick
}) => {
    const getStatusColor = (status: ProjectActivity['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'planning':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'review':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'onhold':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'completed':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: ProjectActivity['status']) => {
        const statusMap = {
            'active': 'Ativo',
            'planning': 'Planejamento',
            'review': 'Revisão',
            'onhold': 'Pausado',
            'completed': 'Concluído'
        };
        return statusMap[status] || status;
    };

    return (
        <div
            className={`border border-gray-100 rounded-lg p-4 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-200' : ''
                }`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h4 className="font-medium text-gray-900 mb-1">{project.name}</h4>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                    </span>
                </div>
                <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {project.deadline}
                    </div>
                </div>
            </div>

            {project.responsibleEngineer && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <User className="w-3 h-3" />
                    {project.responsibleEngineer}
                </div>
            )}

            {/* Progress bars */}
            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Progresso
                        </span>
                        <span>{project.activity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(project.activity, 100)}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Orçamento</span>
                        <span>{project.budget}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${project.budget > 90 ? 'bg-red-500' :
                                    project.budget > 70 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                            style={{ width: `${Math.min(project.budget, 100)}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
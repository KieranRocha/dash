import React from 'react';
import { Clock, FileText, Save } from 'lucide-react';
import { EngineerActivity } from '../../hooks/useDashboard';

interface EngineerActivityListProps {
    engineers: EngineerActivity[];
    onEngineerClick?: (engineer: EngineerActivity) => void;
}

export const EngineerActivityList: React.FC<EngineerActivityListProps> = ({
    engineers,
    onEngineerClick
}) => {
    const getStatusColor = (status: EngineerActivity['status']) => {
        switch (status) {
            case 'online':
                return 'bg-green-500';
            case 'away':
                return 'bg-yellow-500';
            case 'offline':
                return 'bg-gray-400';
            default:
                return 'bg-gray-400';
        }
    };

    const getStatusText = (status: EngineerActivity['status']) => {
        const statusMap = {
            'online': 'Online',
            'away': 'Ausente',
            'offline': 'Offline'
        };
        return statusMap[status] || status;
    };

    if (engineers.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">👥</div>
                <p className="text-gray-600">Nenhum engenheiro ativo</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {engineers.map((engineer) => (
                <div
                    key={engineer.id}
                    className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-200 ${onEngineerClick ? 'cursor-pointer hover:bg-gray-100' : ''
                        }`}
                    onClick={() => onEngineerClick?.(engineer)}
                >
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-sm">
                                    {engineer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </span>
                            </div>
                            <div
                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(engineer.status)}`}
                                title={getStatusText(engineer.status)}
                            />
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 text-sm">{engineer.name}</div>
                            <div className="text-xs text-gray-500">
                                {engineer.currentProject ? `Trabalhando em: ${engineer.currentProject}` : `${engineer.projects} projetos`}
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span>{engineer.projects}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Save className="w-3 h-3" />
                                <span>{engineer.saves}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{engineer.hours}h</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {engineer.lastActivity}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
import React from 'react';
import { FileText, Download, Settings, Plus, BarChart3, RefreshCw } from 'lucide-react';

interface QuickAction {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    color: string;
    onClick: () => void;
}

interface QuickActionsProps {
    onNewProject?: () => void;
    onExportReport?: () => void;
    onSettings?: () => void;
    onViewAnalytics?: () => void;
    onRefresh?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
    onNewProject,
    onExportReport,
    onSettings,
    onViewAnalytics,
    onRefresh
}) => {
    const actions: QuickAction[] = [
        {
            id: 'new-project',
            label: 'Novo Projeto',
            icon: Plus,
            color: 'text-blue-600',
            onClick: onNewProject || (() => { })
        },
        {
            id: 'export-report',
            label: 'Exportar Relatório',
            icon: Download,
            color: 'text-green-600',
            onClick: onExportReport || (() => { })
        },
        {
            id: 'view-analytics',
            label: 'Ver Analytics',
            icon: BarChart3,
            color: 'text-purple-600',
            onClick: onViewAnalytics || (() => { })
        },
        {
            id: 'refresh',
            label: 'Atualizar Dados',
            icon: RefreshCw,
            color: 'text-orange-600',
            onClick: onRefresh || (() => { })
        },
        {
            id: 'settings',
            label: 'Configurações',
            icon: Settings,
            color: 'text-gray-600',
            onClick: onSettings || (() => { })
        }
    ];

    return (
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>

            <div className="space-y-2">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={action.onClick}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                        <action.icon className={`w-5 h-5 ${action.color}`} />
                        <span className="text-sm font-medium text-gray-900">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
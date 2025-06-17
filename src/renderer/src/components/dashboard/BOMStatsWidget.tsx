import React from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { BOMStats } from '../../hooks/useDashboard';

interface BOMStatsWidgetProps {
    stats: BOMStats;
    loading?: boolean;
}

export const BOMStatsWidget: React.FC<BOMStatsWidgetProps> = ({
    stats,
    loading = false
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                <div className="animate-pulse space-y-4">
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const statItems = [
        {
            label: 'Extrações Hoje',
            value: stats.totalExtractions.toLocaleString('pt-BR'),
            icon: Activity
        },
        {
            label: 'Taxa de Sucesso',
            value: `${stats.successRate}%`,
            icon: CheckCircle,
            color: stats.successRate >= 95 ? 'text-green-600' : stats.successRate >= 90 ? 'text-yellow-600' : 'text-red-600'
        },
        {
            label: 'Tempo Médio',
            value: `${stats.avgProcessingTime}s`,
            icon: Clock
        },
        {
            label: 'Última Hora',
            value: stats.lastHour.toString(),
            icon: AlertTriangle
        }
    ];

    return (
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas BOM</h3>

            <div className="space-y-4">
                {statItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <item.icon className={`w-4 h-4 ${item.color || 'text-gray-500'}`} />
                            <span className="text-gray-600 text-sm">{item.label}</span>
                        </div>
                        <span className={`font-semibold ${item.color || 'text-gray-900'}`}>
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="text-center">
                    <div className={`text-2xl font-bold mb-1 ${stats.systemAvailability >= 98 ? 'text-green-600' :
                            stats.systemAvailability >= 95 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {stats.systemAvailability}%
                    </div>
                    <div className="text-sm text-gray-600">Disponibilidade Sistema</div>
                </div>
            </div>
        </div>
    );
};
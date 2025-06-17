// src/components/dashboard/KPICard.tsx
import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: number | string;
    change?: number;
    trend?: 'up' | 'down';
    icon: LucideIcon;
    iconColor: string;
    suffix?: string;
    loading?: boolean;
    onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    change,
    trend,
    icon: Icon,
    iconColor,
    suffix = '',
    loading = false,
    onClick
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-20 h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-200' : ''
                }`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {trend === 'up' ?
                            <TrendingUp className="w-4 h-4" /> :
                            <TrendingDown className="w-4 h-4" />
                        }
                        {change > 0 ? '+' : ''}{change}{suffix}
                    </div>
                )}
            </div>
            <div className="mb-1">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">
                    {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}{suffix}
                </span>
            </div>
            <p className="text-gray-600 text-sm">{title}</p>
        </div>
    );
};

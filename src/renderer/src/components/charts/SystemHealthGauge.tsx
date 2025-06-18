// ================================
// SYSTEM HEALTH GAUGE
// ================================

import { Zap } from "lucide-react";

interface SystemHealthGaugeProps {
    value: number;
    title: string;
    subtitle?: string;
    size?: number;
}

export const SystemHealthGauge: React.FC<SystemHealthGaugeProps> = ({
    value,
    title,
    subtitle,
    size = 200
}) => {
    const getHealthColor = (value: number) => {
        if (value >= 95) return '#10B981';
        if (value >= 85) return '#F59E0B';
        return '#EF4444';
    };

    const getHealthStatus = (value: number) => {
        if (value >= 95) return { text: 'Excelente', icon: '✅' };
        if (value >= 85) return { text: 'Boa', icon: '⚠️' };
        return { text: 'Crítica', icon: '🚨' };
    };

    const radius = (size - 40) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;
    const healthStatus = getHealthStatus(value);

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
                )}

                <div className="relative inline-block">
                    <svg width={size} height={size} className="transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="#F3F4F6"
                            strokeWidth="8"
                        />

                        {/* Progress circle */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={getHealthColor(value)}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            style={{
                                transition: 'stroke-dashoffset 0.5s ease-in-out'
                            }}
                        />
                    </svg>

                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold" style={{ color: getHealthColor(value) }}>
                            {value}%
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                            <span>{healthStatus.icon}</span>
                            <span>{healthStatus.text}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
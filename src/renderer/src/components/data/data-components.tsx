import React, { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart,
    Activity,
    Target,
    Zap,
    Users,
    Clock,
    Calendar,
    RefreshCw,
    Download,
    Settings,
    Maximize2,
    Filter,
    Eye,
    MoreHorizontal,
    ChevronUp,
    ChevronDown,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
    Info,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';

// Import base components
import { Button, Badge, Card, Tooltip } from '../ui/ui-components';

// ============ PROGRESS RING COMPONENT ============
export const ProgressRing = ({
    progress = 0,
    size = 120,
    strokeWidth = 8,
    color = '#3b82f6',
    backgroundColor = '#e5e7eb',
    showPercentage = true,
    animated = true,
    children
}) => {
    const normalizedRadius = (size - strokeWidth) / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={size}
                height={size}
                className={animated ? 'transform rotate-[-90deg] transition-all duration-1000' : 'transform rotate-[-90deg]'}
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={normalizedRadius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={normalizedRadius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={animated ? 'transition-all duration-1000 ease-out' : ''}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children || (showPercentage && (
                    <span className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</span>
                ))}
            </div>
        </div>
    );
};

// ============ MINI CHART COMPONENT ============
export const MiniChart = ({
    data = [],
    type = 'line',
    color = '#3b82f6',
    height = 40,
    showDots = false,
    animated = true
}) => {
    if (data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => ({
        x: (index / (data.length - 1)) * 100,
        y: 100 - ((value - min) / range) * 100
    }));

    if (type === 'bar') {
        return (
            <div className="flex items-end space-x-1" style={{ height }}>
                {data.map((value, index) => (
                    <div
                        key={index}
                        className={`flex-1 rounded-sm transition-all duration-500 ${animated ? 'animate-in' : ''}`}
                        style={{
                            height: `${((value - min) / range) * 100}%`,
                            backgroundColor: color,
                            animationDelay: animated ? `${index * 50}ms` : '0ms'
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <svg width="100%" height={height} className="overflow-visible">
            {/* Line path */}
            <path
                d={`M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                stroke={color}
                strokeWidth="2"
                fill="none"
                className={animated ? 'animate-in' : ''}
                style={{
                    strokeDasharray: animated ? '1000' : 'none',
                    strokeDashoffset: animated ? '1000' : '0',
                    animation: animated ? 'dash 2s ease-out forwards' : 'none'
                }}
            />

            {/* Area fill */}
            <path
                d={`M ${points.map(p => `${p.x} ${p.y}`).join(' L ')} L 100 100 L 0 100 Z`}
                fill={color}
                fillOpacity="0.1"
            />

            {/* Dots */}
            {showDots && points.map((point, index) => (
                <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill={color}
                    className={animated ? 'animate-in' : ''}
                    style={{ animationDelay: animated ? `${index * 100}ms` : '0ms' }}
                />
            ))}
        </svg>
    );
};

// ============ METRIC CARD WITH CHART ============
export const MetricCard = ({
    title,
    value,
    unit = '',
    change,
    trend,
    chartData = [],
    chartType = 'line',
    target,
    status = 'default',
    icon: Icon,
    onClick,
    actions = []
}) => {
    const getStatusColor = () => {
        switch (status) {
            case 'success': return 'border-green-200 bg-green-50';
            case 'warning': return 'border-yellow-200 bg-yellow-50';
            case 'danger': return 'border-red-200 bg-red-50';
            default: return 'border-gray-200 bg-white';
        }
    };

    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp className="w-3 h-3" />;
        if (trend === 'down') return <TrendingDown className="w-3 h-3" />;
        return <Minus className="w-3 h-3" />;
    };

    const getTrendColor = () => {
        if (trend === 'up') return 'text-green-600 bg-green-100';
        if (trend === 'down') return 'text-red-600 bg-red-100';
        return 'text-gray-600 bg-gray-100';
    };

    return (
        <Card
            variant="outlined"
            size="md"
            className={`
        transition-all duration-200 hover:shadow-lg group
        ${getStatusColor()}
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
      `}
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                        {target && (
                            <Tooltip content={`Meta: ${target}${unit}`}>
                                <Target className="w-3 h-3 text-gray-400" />
                            </Tooltip>
                        )}
                    </div>

                    <div className="flex items-baseline space-x-2 mb-2">
                        <span className="text-2xl font-bold text-gray-900">
                            {value}{unit}
                        </span>

                        {change && (
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}>
                                {getTrendIcon()}
                                <span>{change}</span>
                            </div>
                        )}
                    </div>

                    {target && (
                        <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progresso</span>
                                <span>{Math.round((value / target) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {Icon && (
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                )}
            </div>

            {/* Mini Chart */}
            {chartData.length > 0 && (
                <div className="mb-4">
                    <MiniChart
                        data={chartData}
                        type={chartType}
                        color="#3b82f6"
                        height={40}
                        animated
                    />
                </div>
            )}

            {/* Actions */}
            {actions.length > 0 && (
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    {actions.map((action, index) => (
                        <Tooltip key={index} content={action.label}>
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={action.icon}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick?.();
                                }}
                                className="h-8 w-8 p-0"
                            />
                        </Tooltip>
                    ))}
                </div>
            )}
        </Card>
    );
};

// ============ ADVANCED DONUT CHART ============
export const DonutChart = ({
    data = [],
    size = 200,
    strokeWidth = 20,
    showLabels = true,
    showLegend = true,
    centerContent,
    colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
}) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    let accumulatedPercentage = 0;

    const segments = data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
        const strokeDashoffset = -accumulatedPercentage * circumference / 100;

        accumulatedPercentage += percentage;

        return {
            ...item,
            percentage,
            strokeDasharray,
            strokeDashoffset,
            color: colors[index % colors.length]
        };
    });

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                <svg width={size} height={size} className="transform rotate-[-90deg]">
                    {segments.map((segment, index) => (
                        <circle
                            key={index}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke={segment.color}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeDasharray={segment.strokeDasharray}
                            strokeDashoffset={segment.strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out hover:stroke-[24] cursor-pointer"
                            style={{ animationDelay: `${index * 200}ms` }}
                        />
                    ))}
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {centerContent || (
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{total}</div>
                            <div className="text-sm text-gray-500">Total</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Legend */}
            {showLegend && (
                <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                    {segments.map((segment, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: segment.color }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                    {segment.label}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {segment.percentage.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ============ ACTIVITY TIMELINE CHART ============
export const ActivityTimeline = ({
    data = [],
    height = 300,
    showHours = true,
    interactive = true
}) => {
    const [selectedHour, setSelectedHour] = useState(null);

    const mockData = data.length > 0 ? data : Array.from({ length: 24 }, (_, hour) => ({
        hour,
        users: Math.floor(Math.random() * 15) + 1,
        sessions: Math.floor(Math.random() * 25) + 5,
        activities: Math.floor(Math.random() * 50) + 10
    }));

    const maxUsers = Math.max(...mockData.map(d => d.users));
    const maxSessions = Math.max(...mockData.map(d => d.sessions));

    return (
        <Card size="sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Atividade por Hora</h3>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-sm text-gray-600">Usuários</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-sm text-gray-600">Sessões</span>
                    </div>
                </div>
            </div>

            <div className="relative" style={{ height }}>
                <div className="absolute inset-0 flex items-end justify-between">
                    {mockData.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center space-y-1 flex-1 group cursor-pointer"
                            onMouseEnter={() => interactive && setSelectedHour(index)}
                            onMouseLeave={() => interactive && setSelectedHour(null)}
                        >
                            {/* Users bar */}
                            <div
                                className="w-3 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                                style={{
                                    height: `${(item.users / maxUsers) * (height * 0.4)}px`,
                                    minHeight: '2px'
                                }}
                            />

                            {/* Sessions bar */}
                            <div
                                className="w-3 bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                                style={{
                                    height: `${(item.sessions / maxSessions) * (height * 0.4)}px`,
                                    minHeight: '2px'
                                }}
                            />

                            {/* Hour label */}
                            {showHours && (
                                <span className="text-xs text-gray-500 mt-2">
                                    {item.hour.toString().padStart(2, '0')}h
                                </span>
                            )}

                            {/* Tooltip */}
                            {selectedHour === index && (
                                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                    <div>{item.hour}:00</div>
                                    <div>Usuários: {item.users}</div>
                                    <div>Sessões: {item.sessions}</div>
                                    <div>Atividades: {item.activities}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

// ============ PERFORMANCE DASHBOARD ============
export const PerformanceDashboard = ({ metrics = {}, loading = false }) => {
    const defaultMetrics = {
        systemHealth: 95,
        cpuUsage: 45,
        memoryUsage: 67,
        diskUsage: 23,
        networkLatency: 12,
        activeUsers: 24,
        ...metrics
    };

    const getHealthColor = (value) => {
        if (value >= 90) return '#10b981'; // green
        if (value >= 70) return '#f59e0b'; // yellow
        return '#ef4444'; // red
    };

    const getHealthStatus = (value) => {
        if (value >= 90) return 'Excelente';
        if (value >= 70) return 'Bom';
        if (value >= 50) return 'Regular';
        return 'Crítico';
    };

    if (loading) {
        return (
            <Card size="sm" className="animate-pulse">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center space-y-4">
                            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card size="sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Performance do Sistema</h3>
                <div className="flex items-center space-x-2">
                    <Badge
                        variant={defaultMetrics.systemHealth >= 90 ? 'success' : 'warning'}
                        size="sm"
                    >
                        {getHealthStatus(defaultMetrics.systemHealth)}
                    </Badge>
                    <Button variant="ghost" size="sm" icon={RefreshCw}>
                        Atualizar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {/* System Health */}
                <div className="flex flex-col items-center space-y-3">
                    <ProgressRing
                        progress={defaultMetrics.systemHealth}
                        size={80}
                        color={getHealthColor(defaultMetrics.systemHealth)}
                        animated
                    />
                    <div className="text-center">
                        <div className="font-medium text-gray-900">Saúde do Sistema</div>
                        <div className="text-sm text-gray-500">{defaultMetrics.systemHealth}%</div>
                    </div>
                </div>

                {/* CPU Usage */}
                <div className="flex flex-col items-center space-y-3">
                    <ProgressRing
                        progress={defaultMetrics.cpuUsage}
                        size={80}
                        color="#3b82f6"
                        animated
                    />
                    <div className="text-center">
                        <div className="font-medium text-gray-900">CPU</div>
                        <div className="text-sm text-gray-500">{defaultMetrics.cpuUsage}%</div>
                    </div>
                </div>

                {/* Memory Usage */}
                <div className="flex flex-col items-center space-y-3">
                    <ProgressRing
                        progress={defaultMetrics.memoryUsage}
                        size={80}
                        color="#8b5cf6"
                        animated
                    />
                    <div className="text-center">
                        <div className="font-medium text-gray-900">Memória</div>
                        <div className="text-sm text-gray-500">{defaultMetrics.memoryUsage}%</div>
                    </div>
                </div>

                {/* Disk Usage */}
                <div className="flex flex-col items-center space-y-3">
                    <ProgressRing
                        progress={defaultMetrics.diskUsage}
                        size={80}
                        color="#10b981"
                        animated
                    />
                    <div className="text-center">
                        <div className="font-medium text-gray-900">Disco</div>
                        <div className="text-sm text-gray-500">{defaultMetrics.diskUsage}%</div>
                    </div>
                </div>

                {/* Network Latency */}
                <div className="flex flex-col items-center space-y-3">
                    <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{defaultMetrics.networkLatency}</div>
                            <div className="text-xs text-orange-500">ms</div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="font-medium text-gray-900">Latência</div>
                        <div className="text-sm text-gray-500">Rede</div>
                    </div>
                </div>

                {/* Active Users */}
                <div className="flex flex-col items-center space-y-3">
                    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{defaultMetrics.activeUsers}</div>
                            <div className="text-xs text-blue-500">online</div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="font-medium text-gray-900">Usuários</div>
                        <div className="text-sm text-gray-500">Ativos</div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

// Demo Component
export default function ChartComponentsDemo() {
    const [loading, setLoading] = useState(false);

    const sampleChartData = [12, 15, 18, 14, 22, 19, 25, 21, 28, 24];

    const donutData = [
        { label: 'Projetos Ativos', value: 35 },
        { label: 'Em Revisão', value: 25 },
        { label: 'Concluídos', value: 30 },
        { label: 'Pausados', value: 10 }
    ];

    const toggleLoading = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Chart Components Demo</h1>
                    <Button variant="outline" onClick={toggleLoading} icon={BarChart3}>
                        Test Loading States
                    </Button>
                </div>

                {/* Metric Cards */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Advanced Metric Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Usuários Ativos"
                            value={24}
                            change="+12%"
                            trend="up"
                            chartData={sampleChartData}
                            chartType="line"
                            target={30}
                            icon={Users}
                            actions={[
                                { icon: Eye, label: 'Ver detalhes', onClick: () => console.log('View details') },
                                { icon: Download, label: 'Exportar', onClick: () => console.log('Export') }
                            ]}
                        />

                        <MetricCard
                            title="Produtividade"
                            value={94}
                            unit="%"
                            change="+5%"
                            trend="up"
                            chartData={[85, 88, 90, 92, 89, 94, 96, 94]}
                            chartType="bar"
                            target={100}
                            status="success"
                            icon={Target}
                        />

                        <MetricCard
                            title="Tempo Médio"
                            value={2.4}
                            unit="h"
                            change="-8%"
                            trend="down"
                            chartData={[3.2, 2.8, 2.9, 2.6, 2.5, 2.4, 2.3, 2.4]}
                            status="warning"
                            icon={Clock}
                        />

                        <MetricCard
                            title="Erros Sistema"
                            value={3}
                            change="+1"
                            trend="up"
                            chartData={[1, 2, 1, 0, 2, 3, 2, 3]}
                            status="danger"
                            icon={AlertTriangle}
                        />
                    </div>
                </section>

                {/* Charts Grid */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Interactive Charts</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Donut Chart */}
                        <Card size="md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Status dos Projetos</h3>
                                <Button variant="ghost" size="sm" icon={MoreHorizontal} />
                            </div>
                            <div className="flex justify-center">
                                <DonutChart
                                    data={donutData}
                                    size={200}
                                    strokeWidth={20}
                                    showLegend
                                />
                            </div>
                        </Card>

                        {/* Activity Timeline */}
                        <ActivityTimeline />
                    </div>
                </section>

                {/* Performance Dashboard */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">System Performance</h2>
                    <PerformanceDashboard loading={loading} />
                </section>

                {/* Features Overview */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Features Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <h3 className="font-semibold mb-3">Chart Features:</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Animated progress rings</li>
                                <li>• Mini sparkline charts</li>
                                <li>• Interactive donut charts</li>
                                <li>• Real-time activity timeline</li>
                                <li>• Performance monitoring</li>
                                <li>• Responsive design</li>
                            </ul>
                        </Card>

                        <Card>
                            <h3 className="font-semibold mb-3">Interaction Features:</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Hover effects and tooltips</li>
                                <li>• Click actions and navigation</li>
                                <li>• Loading states</li>
                                <li>• Target progress tracking</li>
                                <li>• Status color coding</li>
                                <li>• Export capabilities</li>
                            </ul>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
}

// CSS for animations (would be in a separate CSS file)
const styles = `
@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: animate-in 0.5s ease-out forwards;
}
`;
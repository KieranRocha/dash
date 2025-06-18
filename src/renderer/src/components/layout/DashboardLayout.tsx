import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu,
    X,
    Bell,
    Search,
    Home,
    BarChart3,
    Settings,
    Users,
    FileText,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    Activity,
    Zap,
    Target
} from 'lucide-react';
import {
    DashboardCharts,
    SystemHealthGauge,
    BOMExtractionTrend
} from '../charts';
import { useDashboard } from './../../hooks/useDashboard';
import { KPICard } from '../dashboard/KPICard';
import { AlertsPanel } from '../dashboard/AlertsPanel';
import { ProjectActivityCard } from '../dashboard/ProjectActivityCard';
import { EngineerActivityList } from '../dashboard/EngineerActivityList';
import { BOMStatsWidget } from '../dashboard/BOMStatsWidget';
import { QuickActions } from '../dashboard/QuickActions';

const DashboardLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

    const {
        data,
        loading,
        error,
        filters,
        setFilters,
        refresh,
        lastUpdate,
        isRealTimeEnabled,
        toggleRealTime
    } = useDashboard();
    const [chartData, setChartData] = useState({
        productivityData: [],
        qualityData: [],
        efficiencyData: [],
        systemHealth: 0,
        bomTrendData: [],
        engineerStatusData: []
    });
    const navigate = useNavigate();
    // Auto-close sidebar on mobile when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.getElementById('mobile-sidebar');
            const menuButton = document.getElementById('mobile-menu-button');

            if (sidebar && !sidebar.contains(event.target as Node) &&
                menuButton && !menuButton.contains(event.target as Node)) {
                setSidebarOpen(false);
            }
        };

        if (sidebarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen]);

    // Handle time range change
    const handleTimeRangeChange = (timeRange: '1h' | '24h' | '7d' | '30d') => {
        setSelectedTimeRange(timeRange);
        setFilters({ timeRange });
    };

    const navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, active: true },
        { id: 'projects', label: 'Projetos', icon: FileText, active: false },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, active: false },
        { id: 'engineers', label: 'Engenheiros', icon: Users, active: false },
        { id: 'settings', label: 'Configurações', icon: Settings, active: false }
    ];

    if (error && !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center max-w-md">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro de Conexão</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={refresh}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`} id="mobile-sidebar">
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-900">CAD Companion</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <nav className="mt-6 px-3">
                    <div className="space-y-1">
                        {navigationItems.map((item) => (
                            <button
                                key={item.id}

                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${item.active
                                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSidebarOpen(false);
                                    navigate('/projetos');
                                }}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* System Status in Sidebar */}
                <div className="absolute bottom-4 left-3 right-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${data?.systemStatus === 'healthy' ? 'bg-green-500' :
                                data?.systemStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                            <span className="text-xs font-medium text-gray-700">
                                Sistema {data?.systemStatus === 'healthy' ? 'Saudável' :
                                    data?.systemStatus === 'warning' ? 'Atenção' : 'Crítico'}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">
                            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                        <div className="flex items-center gap-4">
                            <button
                                id="mobile-menu-button"
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                            >
                                <Menu className="w-5 h-5 text-gray-500" />
                            </button>

                            <div className="hidden md:block">
                                <h1 className="text-xl font-semibold text-gray-900">Dashboard Operacional</h1>
                                <p className="text-sm text-gray-500">
                                    Monitoramento em tempo real · {data?.projectsActivity?.length || 0} projetos ativos
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search Bar - Hidden on mobile */}
                            <div className="hidden md:flex relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar projetos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                                />
                            </div>

                            {/* Time Range Selector */}
                            <select
                                value={selectedTimeRange}
                                onChange={(e) => handleTimeRangeChange(e.target.value as any)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="1h">1 Hora</option>
                                <option value="24h">24 Horas</option>
                                <option value="7d">7 Dias</option>
                                <option value="30d">30 Dias</option>
                            </select>

                            {/* Real-time Toggle */}
                            <button
                                onClick={toggleRealTime}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isRealTimeEnabled
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                                    <span className="hidden sm:inline">Tempo Real</span>
                                </div>
                            </button>

                            {/* Notifications */}
                            <button className="relative p-2 rounded-lg hover:bg-gray-100">
                                <Bell className="w-5 h-5 text-gray-500" />
                                {data?.alerts && data.alerts.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {data.alerts.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 p-4 lg:p-6">
                    {loading && !data ? (
                        // Loading State
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
                                        <div className="animate-pulse space-y-3">
                                            <div className="flex justify-between">
                                                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                                <div className="w-16 h-4 bg-gray-200 rounded"></div>
                                            </div>
                                            <div className="w-20 h-8 bg-gray-200 rounded"></div>
                                            <div className="w-24 h-4 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Main Dashboard Content
                        <>
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
                                <KPICard
                                    title="Projetos Ativos"
                                    value={data?.kpis.activeProjects.value || 0}
                                    change={data?.kpis.activeProjects.change}
                                    trend={data?.kpis.activeProjects.trend}
                                    icon={FileText}
                                    iconColor="bg-blue-100 text-blue-600"
                                    onClick={() => console.log('Navigate to projects')}
                                />
                                <KPICard
                                    title="Engenheiros Online"
                                    value={data?.kpis.totalEngineers.value || 0}
                                    change={data?.kpis.totalEngineers.change}
                                    trend={data?.kpis.totalEngineers.trend}
                                    icon={Users}
                                    iconColor="bg-green-100 text-green-600"
                                    onClick={() => console.log('Navigate to engineers')}
                                />
                                <KPICard
                                    title="BOMs Processadas"
                                    value={data?.kpis.bomVersions.value || 0}
                                    change={data?.kpis.bomVersions.change}
                                    trend={data?.kpis.bomVersions.trend}
                                    icon={BarChart3}
                                    iconColor="bg-purple-100 text-purple-600"
                                    onClick={() => console.log('Navigate to BOMs')}
                                />
                                <KPICard
                                    title="Saúde do Sistema"
                                    value={data?.kpis.systemHealth.value || 0}
                                    change={data?.kpis.systemHealth.change}
                                    trend={data?.kpis.systemHealth.trend}
                                    icon={Zap}
                                    iconColor="bg-yellow-100 text-yellow-600"
                                    suffix="%"
                                    onClick={() => console.log('Navigate to system health')}
                                />
                            </div>
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold mb-6">Analytics Avançados</h2>
                                <DashboardCharts
                                    productivityData={chartData.productivityData}
                                    qualityData={chartData.qualityData}
                                    efficiencyData={chartData.efficiencyData}
                                    systemHealth={chartData.systemHealth}
                                    bomTrendData={chartData.bomTrendData}
                                    engineerStatusData={chartData.engineerStatusData}
                                    timeRange={selectedTimeRange}
                                />
                            </div>
                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                                {/* Left Column - Primary Content */}
                                <div className="xl:col-span-2 space-y-6">

                                    {/* Alerts Panel */}
                                    <AlertsPanel
                                        alerts={data?.alerts || []}
                                        onAlertClick={(alert) => console.log('Alert clicked:', alert)}
                                        showDismiss={true}
                                        onDismiss={(alertId) => console.log('Dismiss alert:', alertId)}
                                    />

                                    {/* Projects Activity */}
                                    <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Projetos em Andamento ({data?.projectsActivity?.length || 0})
                                            </h3>
                                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                Ver todos
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {data?.projectsActivity?.slice(0, 4).map((project) => (
                                                <ProjectActivityCard
                                                    key={project.id}
                                                    project={project}
                                                    onClick={() => console.log('Project clicked:', project)}
                                                />
                                            )) || (
                                                    <div className="col-span-2 text-center py-8">
                                                        <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                        <p className="text-gray-500">Nenhum projeto ativo</p>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Secondary Content */}
                                <div className="space-y-6">

                                    {/* BOM Statistics */}
                                    <BOMStatsWidget
                                        stats={data?.bomStats || {
                                            totalExtractions: 0,
                                            successRate: 0,
                                            avgProcessingTime: 0,
                                            lastHour: 0,
                                            failedExtractions: 0,
                                            systemAvailability: 0
                                        }}
                                        loading={loading}
                                    />

                                    {/* Engineers Activity */}
                                    <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Engenheiros Ativos ({data?.engineerActivity?.length || 0})
                                        </h3>
                                        <EngineerActivityList
                                            engineers={data?.engineerActivity || []}
                                            onEngineerClick={(engineer) => console.log('Engineer clicked:', engineer)}
                                        />
                                    </div>

                                    {/* Quick Actions */}
                                    <QuickActions
                                        onNewProject={() => console.log('New project')}
                                        onExportReport={() => console.log('Export report')}
                                        onSettings={() => console.log('Settings')}
                                        onViewAnalytics={() => console.log('View analytics')}
                                        onRefresh={refresh}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
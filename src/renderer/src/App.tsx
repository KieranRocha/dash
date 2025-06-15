import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Home,
  Folder,
  Wrench,
  Users,
  BarChart3,
  Settings,
  Plus,
  Search,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Target,
  Activity,
  Monitor,
  Archive,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  Star,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  FileText,
  Package,
  Layers,
  TrendingUp,
  Command,
  X,
  Copy,
  Share2,
  ExternalLink,
  GitBranch,
  Zap,
  AlertCircle,
  Info,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

// ============ APPLICATION CONTEXT ============
const AppContext = createContext();

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de AppProvider');
  }
  return context;
};

// ============ DESIGN SYSTEM COMPONENTS ============
const Card = ({ children, variant = 'elevated', size = 'md', className = '', onClick }) => {
  const variants = {
    elevated: 'bg-white shadow-lg border border-gray-100 hover:shadow-xl',
    outlined: 'bg-white border-2 border-gray-200 hover:border-gray-300',
    filled: 'bg-gray-50 border border-gray-200 hover:bg-gray-100',
    ghost: 'bg-transparent hover:bg-gray-50'
  };

  const sizes = {
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  return (
    <div
      className={`rounded-xl transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className} ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const Button = ({ children, variant = 'primary', size = 'md', icon: Icon, className = '', loading = false, ...props }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50',
    ghost: 'hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-105 active:scale-95 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

const Badge = ({ children, variant = 'default', size = 'md', dot = false, pulse = false }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800'
  };

  const sizes = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1'
  };

  if (dot) {
    return <span className={`inline-flex w-2 h-2 rounded-full ${variants[variant].split(' ')[0]} ${pulse ? 'animate-pulse' : ''}`} />;
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${pulse ? 'animate-pulse' : ''}`}>
      {children}
    </span>
  );
};

const Avatar = ({ initials, size = 'md', status, className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-400'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`bg-blue-500 text-white rounded-full flex items-center justify-center font-medium ${sizes[size]}`}>
        {initials || '?'}
      </div>
      {status && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${statusColors[status]}`} />
      )}
    </div>
  );
};

// ============ ENHANCED STATS CARD ============
const StatsCard = ({ title, value, unit = '', change, trend, icon: Icon, loading = false, onClick, sparklineData = [] }) => {
  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  if (loading) {
    return (
      <Card variant="elevated" size="md" className="animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" size="md" className={`group ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2 mb-2">
            <h3 className="text-2xl font-bold text-gray-900">{value}{unit}</h3>
            {change && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendColors[trend]}`}>
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {change}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        )}
      </div>

      {sparklineData.length > 0 && (
        <div className="h-8 flex items-end space-x-1">
          {sparklineData.map((point, index) => (
            <div
              key={index}
              className="bg-blue-200 rounded-sm flex-1 transition-all duration-300 hover:bg-blue-400"
              style={{
                height: `${(point / Math.max(...sparklineData)) * 100}%`,
                minHeight: '2px'
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

// ============ ACTIVITY FEED ============
const ActivityFeed = ({ activities = [], live = true, maxItems = 10 }) => {
  const mockActivities = activities.length > 0 ? activities : [
    { id: 1, user: 'Maria Santos', action: 'extraiu BOM do', target: 'Projeto Alpha', time: '2 min atrás', type: 'bom' },
    { id: 2, user: 'Pedro Costa', action: 'iniciou sessão no', target: 'Projeto Beta', time: '5 min atrás', type: 'session' },
    { id: 3, user: 'Ana Lima', action: 'finalizou revisão de', target: 'Projeto Gamma', time: '12 min atrás', type: 'review' },
    { id: 4, user: 'Carlos Silva', action: 'exportou relatório de', target: 'Projeto Delta', time: '15 min atrás', type: 'export' }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'bom': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'session': return <Activity className="w-4 h-4 text-green-600" />;
      case 'review': return <CheckCircle className="w-4 h-4 text-purple-600" />;
      case 'export': return <Download className="w-4 h-4 text-orange-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card variant="elevated" size="md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Atividade em Tempo Real</h3>
        {live && (
          <div className="flex items-center space-x-2">
            <Badge dot variant="success" pulse />
            <span className="text-sm text-gray-600">Live</span>
          </div>
        )}
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto">
        {mockActivities.slice(0, maxItems).map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 mt-1">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                <span className="font-medium text-blue-600">{activity.target}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ============ SESSION MONITOR MINI ============
const SessionMonitorMini = ({ sessions = [] }) => {
  const mockSessions = sessions.length > 0 ? sessions : [
    { id: 1, user: 'João Silva', project: 'Projeto Alpha', duration: '2h 15m', status: 'active' },
    { id: 2, user: 'Maria Santos', project: 'Projeto Beta', duration: '1h 32m', status: 'active' },
    { id: 3, user: 'Pedro Costa', project: 'Projeto Gamma', duration: '45m', status: 'idle' }
  ];

  return (
    <Card variant="elevated" size="md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sessões Ativas</h3>
        <Badge variant="primary" size="sm">
          {mockSessions.filter(s => s.status === 'active').length} online
        </Badge>
      </div>

      <div className="space-y-4">
        {mockSessions.map((session) => (
          <div key={session.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100">
            <Avatar
              initials={session.user.split(' ').map(n => n[0]).join('')}
              size="md"
              status={session.status === 'active' ? 'online' : 'away'}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900">{session.user}</h4>
              <p className="text-sm text-gray-500">{session.project}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{session.duration}</p>
              <Badge variant={session.status === 'active' ? 'success' : 'warning'} size="xs">
                {session.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ============ HEADER COMPONENT ============
const Header = ({ onToggleSidebar, notifications = 3 }) => {
  const [isConnected, setIsConnected] = useState(true);

  return (
    <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar projetos, BOMs, usuários..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-6 h-6" />
            {notifications > 0 && (
              <Badge
                variant="danger"
                size="sm"
                className="absolute -top-1 -right-1 min-w-[1.5rem] h-6 text-xs flex items-center justify-center"
              >
                {notifications}
              </Badge>
            )}
          </button>

          {/* User */}
          <div className="flex items-center space-x-2">
            <Avatar initials="JS" size="sm" status="online" />
            <span className="text-sm text-gray-700 hidden sm:block">João Silva</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// ============ SIDEBAR COMPONENT ============
const Sidebar = ({ collapsed, activeSection, onSectionChange }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', badge: null },
    { id: 'projects', icon: Folder, label: 'Projetos', badge: 8 },
    { id: 'engineering', icon: Wrench, label: 'Engenharia', badge: null },
    { id: 'sessions', icon: Users, label: 'Sessões', badge: 12 },
    { id: 'reports', icon: BarChart3, label: 'Relatórios', badge: null },
    { id: 'settings', icon: Settings, label: 'Configurações', badge: null }
  ];

  return (
    <div className={`bg-white/95 backdrop-blur-lg border-r border-gray-200/50 h-full flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200/50 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg">EngDashboard</span>
              <div className="text-xs text-gray-500">v2.1.0</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${activeSection === item.id
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${activeSection === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
            {!collapsed && (
              <>
                <span className="font-medium flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant={activeSection === item.id ? 'default' : 'primary'} size="sm">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200/50">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
            <Avatar initials="JS" size="md" status="online" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">João Silva</p>
              <p className="text-sm text-gray-500 truncate">Engenheiro Senior</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ DASHBOARD PAGE CONTENT ============
const DashboardContent = () => {
  const { data, loading } = useAppContext();

  const mainMetrics = [
    {
      title: 'Usuários Online',
      value: data.stats.usersOnline,
      change: '+3',
      trend: 'up',
      icon: Users,
      sparklineData: [8, 10, 9, 12, 11, 12, 13, data.stats.usersOnline]
    },
    {
      title: 'Projetos Ativos',
      value: data.stats.activeProjects,
      change: '+2',
      trend: 'up',
      icon: Folder,
      sparklineData: [6, 7, 6, 8, 7, 8, 8, data.stats.activeProjects]
    },
    {
      title: 'BOMs Extraídas',
      value: data.stats.bomsToday,
      change: '+15%',
      trend: 'up',
      icon: FileText,
      sparklineData: [18, 20, 19, 23, 21, 23, 24, data.stats.bomsToday]
    },
    {
      title: 'Produtividade',
      value: data.stats.productivity,
      unit: '%',
      change: '+2%',
      trend: 'up',
      icon: Target,
      sparklineData: [89, 91, 88, 94, 92, 94, 96, data.stats.productivity]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Visão geral das atividades de engenharia em tempo real
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant="success" size="sm">Sistema Saudável</Badge>
          <Button variant="outline" icon={RefreshCw}>Atualizar</Button>
          <Button variant="primary" icon={Plus}>Novo Projeto</Button>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainMetrics.map((metric, index) => (
          <StatsCard key={index} {...metric} loading={loading} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" size="md">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Atividade por Hora</h3>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Gráfico de Atividade</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" size="md">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Status dos Projetos</h3>
          <div className="h-64 bg-gradient-to-r from-green-50 to-green-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-gray-600">Distribuição de Status</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity and Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed live />
        <SessionMonitorMini />
      </div>
    </div>
  );
};

// ============ PROJECTS PAGE CONTENT ============
const ProjectsContent = () => {
  const projects = [
    { id: 1, name: 'Motor Elétrico V3.0', status: 'active', progress: 75, manager: 'João Silva' },
    { id: 2, name: 'Sistema IoT', status: 'planning', progress: 25, manager: 'Ana Lima' },
    { id: 3, name: 'Chassi Veicular', status: 'review', progress: 90, manager: 'Maria Santos' },
    { id: 4, name: 'Software CAD', status: 'completed', progress: 100, manager: 'Carlos Silva' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os projetos de engenharia</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={Download}>Exportar</Button>
          <Button variant="primary" icon={Plus}>Novo Projeto</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.id} variant="elevated" size="md" className="cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{project.name}</h3>
              <Badge variant={project.status === 'active' ? 'success' : project.status === 'planning' ? 'info' : project.status === 'review' ? 'warning' : 'default'} size="sm">
                {project.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar initials={project.manager.split(' ').map(n => n[0]).join('')} size="sm" />
                  <span className="text-sm text-gray-600">{project.manager}</span>
                </div>
                <Button variant="ghost" size="sm" icon={MoreHorizontal} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ============ MAIN APPLICATION ============
const EngineeringDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [data, setData] = useState({
    stats: {
      usersOnline: 12,
      activeProjects: 8,
      bomsToday: 23,
      productivity: 94
    }
  });
  const [loading, setLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          usersOnline: Math.max(8, prev.stats.usersOnline + Math.floor(Math.random() * 3) - 1)
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />;
      case 'projects':
        return <ProjectsContent />;
      case 'engineering':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Módulo de Engenharia</h3>
              <p className="text-gray-600">Funcionalidades avançadas de BOM e CAD</p>
            </div>
          </div>
        );
      case 'sessions':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Monitor de Sessões</h3>
              <p className="text-gray-600">Acompanhamento detalhado de usuários</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios</h3>
              <p className="text-gray-600">Analytics e relatórios avançados</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações</h3>
              <p className="text-gray-600">Configurações do sistema e usuário</p>
            </div>
          </div>
        );
      default:
        return <DashboardContent />;
    }
  };

  const contextValue = {
    data,
    loading,
    sidebarCollapsed,
    activeSection,
    setSidebarCollapsed,
    setActiveSection
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="h-screen bg-gray-50 flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default EngineeringDashboard;
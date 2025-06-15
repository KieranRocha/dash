import React, { useState, useEffect } from 'react';
import {
  Home,
  Folder,
  Wrench,
  Users,
  BarChart3,
  Settings,
  Plus,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  Clock,
  Target,
  Zap,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  Package,
  Layers,
  Play,
  Pause,
  Square,
  Monitor,
  Cpu,
  HardDrive,
  Database,
  Wifi,
  WifiOff,
  Bell,
  Star,
  Archive,
  GitBranch,
  ExternalLink,
  Share2,
  Copy
} from 'lucide-react';

// Import all our modular components
import { Button, Badge, Card, Avatar, Tooltip } from './components/ui/ui-components'
import { StatsCard, DataTable, MetricsGrid } from './components/data/data-components'
import { BOMViewer, SessionMonitor, ActivityFeed } from './components/domain/domain-components';
import { MetricCard, DonutChart, ActivityTimeline, PerformanceDashboard } from './components/charts/chart-components';

// ============ CUSTOM HOOKS ============
const useRealTimeData = () => {
  const [data, setData] = useState({
    stats: {
      usersOnline: 12,
      activeProjects: 8,
      bomsToday: 23,
      hoursWorked: 156,
      productivity: 94,
      systemHealth: 98
    },
    activities: [],
    sessions: [],
    projects: [],
    performance: {
      cpu: 45,
      memory: 62,
      disk: 28,
      network: 12
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
          usersOnline: Math.max(8, prev.stats.usersOnline + Math.floor(Math.random() * 3) - 1),
          productivity: Math.min(100, Math.max(85, prev.stats.productivity + Math.floor(Math.random() * 3) - 1)),
          systemHealth: Math.min(100, Math.max(90, prev.stats.systemHealth + Math.floor(Math.random() * 2) - 1))
        },
        performance: {
          cpu: Math.min(100, Math.max(20, prev.performance.cpu + Math.floor(Math.random() * 10) - 5)),
          memory: Math.min(100, Math.max(30, prev.performance.memory + Math.floor(Math.random() * 8) - 4)),
          disk: Math.min(100, Math.max(20, prev.performance.disk + Math.floor(Math.random() * 4) - 2)),
          network: Math.min(100, Math.max(5, prev.performance.network + Math.floor(Math.random() * 6) - 3))
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return { data, loading, refreshData };
};

const useProjectData = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Motor Elétrico V3.0',
      description: 'Desenvolvimento de motor elétrico de alta eficiência',
      status: 'active',
      priority: 'high',
      progress: 75,
      manager: 'João Silva',
      team: ['Maria Santos', 'Pedro Costa'],
      budget: 250000,
      spent: 187500,
      deadline: '2024-12-15',
      category: 'mechanical',
      lastUpdate: '2 horas atrás',
      health: 'good'
    },
    {
      id: 2,
      name: 'Sistema de Controle IoT',
      description: 'Sistema de controle inteligente para equipamentos industriais',
      status: 'planning',
      priority: 'medium',
      progress: 25,
      manager: 'Ana Lima',
      team: ['Carlos Silva', 'Roberto Santos'],
      budget: 180000,
      spent: 45000,
      deadline: '2025-03-20',
      category: 'electrical',
      lastUpdate: '1 dia atrás',
      health: 'excellent'
    },
    {
      id: 3,
      name: 'Chassi Veicular Leve',
      description: 'Desenvolvimento de chassi em alumínio para veículos urbanos',
      status: 'review',
      priority: 'high',
      progress: 90,
      manager: 'Maria Santos',
      team: ['João Silva', 'Pedro Costa', 'Ana Lima'],
      budget: 320000,
      spent: 296000,
      deadline: '2024-11-30',
      category: 'mechanical',
      lastUpdate: '30 min atrás',
      health: 'warning'
    },
    {
      id: 4,
      name: 'Software de Simulação',
      description: 'Plataforma de simulação para testes virtuais',
      status: 'completed',
      priority: 'low',
      progress: 100,
      manager: 'Carlos Silva',
      team: ['Roberto Santos'],
      budget: 150000,
      spent: 145000,
      deadline: '2024-10-15',
      category: 'software',
      lastUpdate: '1 semana atrás',
      health: 'excellent'
    }
  ]);

  const [loading, setLoading] = useState(false);

  const updateProject = (projectId, updates) => {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, ...updates } : p
    ));
  };

  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now(),
      status: 'planning',
      progress: 0,
      spent: 0,
      lastUpdate: 'agora',
      health: 'excellent'
    };
    setProjects(prev => [...prev, newProject]);
  };

  return { projects, loading, updateProject, deleteProject, addProject };
};

// ============ DASHBOARD PAGE ============
export const DashboardPage = () => {
  const { data, loading, refreshData } = useRealTimeData();

  const mainMetrics = [
    {
      title: 'Usuários Online',
      value: data.stats.usersOnline,
      change: '+3',
      trend: 'up',
      icon: Users,
      chartData: [8, 10, 9, 12, 11, 12, 13, data.stats.usersOnline],
      target: 15,
      actions: [
        { icon: Eye, label: 'Ver detalhes', onClick: () => console.log('View users') },
        { icon: Bell, label: 'Notificar', onClick: () => console.log('Notify') }
      ]
    },
    {
      title: 'Projetos Ativos',
      value: data.stats.activeProjects,
      change: '+2',
      trend: 'up',
      icon: Folder,
      chartData: [6, 7, 6, 8, 7, 8, 8, data.stats.activeProjects],
      target: 10
    },
    {
      title: 'BOMs Extraídas',
      value: data.stats.bomsToday,
      change: '+15%',
      trend: 'up',
      icon: FileText,
      chartData: [18, 20, 19, 23, 21, 23, 24, data.stats.bomsToday]
    },
    {
      title: 'Produtividade',
      value: data.stats.productivity,
      unit: '%',
      change: '+2%',
      trend: 'up',
      icon: Target,
      chartData: [89, 91, 88, 94, 92, 94, 96, data.stats.productivity],
      target: 100,
      status: data.stats.productivity >= 95 ? 'success' : data.stats.productivity >= 85 ? 'warning' : 'danger',
      clickable: true,
      onClick: () => console.log('Productivity details')
    }
  ];

  const projectStatusData = [
    { label: 'Ativos', value: 8, color: '#10b981' },
    { label: 'Em Revisão', value: 3, color: '#f59e0b' },
    { label: 'Planejamento', value: 2, color: '#6b7280' },
    { label: 'Concluídos', value: 12, color: '#3b82f6' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Visão geral das atividades de engenharia em tempo real
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant={data.stats.systemHealth >= 95 ? 'success' : 'warning'} size="sm">
            Sistema {data.stats.systemHealth >= 95 ? 'Saudável' : 'Atenção'}
          </Badge>
          <Button variant="outline" icon={RefreshCw} onClick={refreshData} loading={loading}>
            Atualizar
          </Button>
          <Button variant="primary" icon={Plus}>
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Main Metrics */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Métricas Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </section>

      {/* Charts and Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status */}
        <Card size="md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Status dos Projetos</h3>
            <Button variant="ghost" size="sm" icon={MoreHorizontal} />
          </div>
          <div className="flex justify-center">
            <DonutChart
              data={projectStatusData}
              size={200}
              strokeWidth={20}
              centerContent={
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">25</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              }
            />
          </div>
        </Card>

        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <ActivityTimeline height={300} />
        </div>
      </section>

      {/* Activity Feed and Session Monitor */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed live maxItems={8} />
        <Card size="sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sessões Ativas</h3>
            <Badge variant="primary" size="sm">
              {data.stats.usersOnline} online
            </Badge>
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100">
                <Avatar
                  initials={['JS', 'MS', 'PC', 'AL'][i]}
                  size="md"
                  status={i < 2 ? 'online' : 'away'}
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Lima'][i]}
                  </div>
                  <div className="text-sm text-gray-500">
                    {['Projeto Alpha', 'Projeto Beta', 'Projeto Gamma', 'Projeto Delta'][i]}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium">{['2h 15m', '1h 32m', '45m', '3h 8m'][i]}</div>
                  <Badge variant={i < 2 ? 'success' : 'warning'} size="xs">
                    {i < 2 ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* System Performance */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance do Sistema</h2>
        <PerformanceDashboard metrics={data.performance} loading={loading} />
      </section>
    </div>
  );
};

// ============ PROJECTS PAGE ============
export const ProjectsPage = () => {
  const { projects, loading, updateProject, deleteProject } = useProjectData();
  const [viewMode, setViewMode] = useState('grid'); // grid, list, kanban
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastUpdate');

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      planning: 'info',
      review: 'warning',
      completed: 'default',
      paused: 'danger'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'default',
      medium: 'info',
      high: 'warning',
      critical: 'danger'
    };
    return colors[priority] || 'default';
  };

  const getHealthColor = (health) => {
    const colors = {
      excellent: 'success',
      good: 'info',
      warning: 'warning',
      critical: 'danger'
    };
    return colors[health] || 'default';
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  const projectColumns = [
    {
      key: 'name',
      header: 'Projeto',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">{row.description}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <Badge variant={getStatusColor(value)} size="sm">{value}</Badge>
    },
    {
      key: 'priority',
      header: 'Prioridade',
      render: (value) => <Badge variant={getPriorityColor(value)} size="sm">{value}</Badge>
    },
    {
      key: 'progress',
      header: 'Progresso',
      render: (value) => (
        <div className="w-full">
          <div className="flex justify-between text-sm mb-1">
            <span>{value}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'manager',
      header: 'Gerente',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Avatar initials={value.split(' ').map(n => n[0]).join('')} size="sm" />
          <span className="text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'budget',
      header: 'Orçamento',
      render: (value, row) => (
        <div className="text-right">
          <div className="font-medium">R$ {value.toLocaleString()}</div>
          <div className="text-xs text-gray-500">
            Gasto: R$ {row.spent.toLocaleString()}
          </div>
        </div>
      )
    },
    {
      key: 'deadline',
      header: 'Prazo',
      render: (value) => (
        <div className="text-sm">
          {new Date(value).toLocaleDateString('pt-BR')}
        </div>
      )
    },
    {
      key: 'health',
      header: 'Saúde',
      render: (value) => <Badge variant={getHealthColor(value)} size="sm">{value}</Badge>
    }
  ];

  const projectActions = [
    { icon: Eye, label: 'Visualizar', onClick: (row) => console.log('View project', row) },
    { icon: Edit, label: 'Editar', onClick: (row) => console.log('Edit project', row) },
    { icon: Copy, label: 'Duplicar', onClick: (row) => console.log('Clone project', row) },
    { icon: Archive, label: 'Arquivar', onClick: (row) => console.log('Archive project', row) },
    { icon: Trash2, label: 'Excluir', onClick: (row) => deleteProject(row.id) }
  ];

  const ProjectCard = ({ project }) => (
    <Card
      size="md"
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => console.log('Open project', project)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Badge variant={getStatusColor(project.status)} size="sm">
            {project.status}
          </Badge>
          <Button variant="ghost" size="sm" icon={MoreHorizontal} />
        </div>
      </div>

      <div className="space-y-3">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progresso</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar initials={project.manager.split(' ').map(n => n[0]).join('')} size="sm" />
            <div className="flex -space-x-1">
              {project.team.slice(0, 3).map((member, i) => (
                <Avatar
                  key={i}
                  initials={member.split(' ').map(n => n[0]).join('')}
                  size="sm"
                  className="border-2 border-white"
                />
              ))}
              {project.team.length > 3 && (
                <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600">
                  +{project.team.length - 3}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant={getPriorityColor(project.priority)} size="xs">
              {project.priority}
            </Badge>
            <Badge variant={getHealthColor(project.health)} size="xs">
              {project.health}
            </Badge>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            R$ {project.spent.toLocaleString()} / R$ {project.budget.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            {project.lastUpdate}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os projetos de engenharia
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" icon={Download}>
            Exportar
          </Button>
          <Button variant="primary" icon={Plus}>
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Todos ({projects.length})</option>
            <option value="active">Ativos ({projects.filter(p => p.status === 'active').length})</option>
            <option value="planning">Planejamento ({projects.filter(p => p.status === 'planning').length})</option>
            <option value="review">Em Revisão ({projects.filter(p => p.status === 'review').length})</option>
            <option value="completed">Concluídos ({projects.filter(p => p.status === 'completed').length})</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="lastUpdate">Última Atualização</option>
            <option value="name">Nome</option>
            <option value="priority">Prioridade</option>
            <option value="deadline">Prazo</option>
            <option value="progress">Progresso</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            Lista
          </Button>
        </div>
      </div>

      {/* Projects Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <DataTable
          columns={projectColumns}
          data={filteredProjects}
          actions={projectActions}
          sortable
          searchable
          exportable
          loading={loading}
        />
      )}

      {filteredProjects.length === 0 && (
        <Card size="lg" className="text-center py-12">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum projeto encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            Comece criando seu primeiro projeto de engenharia
          </p>
          <Button variant="primary" icon={Plus}>
            Criar Projeto
          </Button>
        </Card>
      )}
    </div>
  );
};

// Demo Component
export default function PageComponentsDemo() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const pages = {
    dashboard: <DashboardPage />,
    projects: <ProjectsPage />
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-8">
        <div className="flex space-x-4">
          <Button
            variant={currentPage === 'dashboard' ? 'primary' : 'ghost'}
            icon={Home}
            onClick={() => setCurrentPage('dashboard')}
          >
            Dashboard
          </Button>
          <Button
            variant={currentPage === 'projects' ? 'primary' : 'ghost'}
            icon={Folder}
            onClick={() => setCurrentPage('projects')}
          >
            Projetos
          </Button>
        </div>
      </div>

      {/* Page Content */}
      <div className="px-6 pb-8">
        {pages[currentPage]}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useConnectionStatus } from './hooks/useAPI';
import { ProjectsPage } from './pages/ProjectPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { Dashboard } from './pages/Dashboard';
import {
  AlertTriangle,
  Home,
  FileText,
  Plus,
  Menu,
  X,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';

// Simulação simples de roteamento
type Route = 'dashboard' | 'projects' | 'projects/new' | 'projects/detail';

interface AppState {
  currentRoute: Route;
  projectId?: string;
}

// Connection Status Component
const ConnectionStatus: React.FC<{ isConnected: boolean | null; loading: boolean }> = ({ isConnected, loading }) => {
  if (loading) return null;

  if (isConnected === false) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex items-center">
          <WifiOff className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-sm text-red-700">
            Sem conexão com o servidor. Algumas funcionalidades podem não estar disponíveis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-2 mb-4">
      <div className="flex items-center">
        <Wifi className="h-4 w-4 text-green-400 mr-2" />
        <p className="text-xs text-green-700">Conectado ao servidor</p>
      </div>
    </div>
  );
};

// Navigation Sidebar
const Sidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentRoute: Route;
  onNavigate: (route: Route) => void;
}> = ({ isOpen, onClose, currentRoute, onNavigate }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, route: 'dashboard' as Route },
    { id: 'projects', label: 'Projetos', icon: FileText, route: 'projects' as Route },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">CAD Companion</div>
              <div className="text-xs text-gray-500">Gestão de Projetos</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.route);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${currentRoute === item.route
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
              Ações Rápidas
            </h3>
            <button
              onClick={() => {
                onNavigate('projects/new');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Novo Projeto
            </button>
          </div>
        </nav>

        {/* Status Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            Sistema ativo
          </div>
        </div>
      </div>
    </>
  );
};

// Header Component
const Header: React.FC<{
  onMenuClick: () => void;
  title: string;
  subtitle?: string;
}> = ({ onMenuClick, title, subtitle }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 lg:ml-64">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">v1.0.0</div>
        </div>
      </div>
    </header>
  );
};

// Main App Component
export const App: React.FC = () => {
  const { isConnected, loading: connectionLoading } = useConnectionStatus();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appState, setAppState] = useState<AppState>({
    currentRoute: 'dashboard'
  });

  const navigate = (route: Route, projectId?: string) => {
    setAppState({ currentRoute: route, projectId });
  };

  const getPageInfo = () => {
    switch (appState.currentRoute) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Visão geral dos projetos' };
      case 'projects':
        return { title: 'Projetos', subtitle: 'Gestão de projetos CAD' };
      case 'projects/new':
        return { title: 'Novo Projeto', subtitle: 'Criar um novo projeto' };
      case 'projects/detail':
        return { title: 'Detalhes do Projeto', subtitle: 'Informações detalhadas' };
      default:
        return { title: 'CAD Companion', subtitle: '' };
    }
  };

  const renderContent = () => {
    // Simular componentes que dependem de navegação para projetos específicos
    const simulatedProjectsPage = React.cloneElement(<ProjectsPage />, {
      onNavigateToProject: (id: string) => navigate('projects/detail', id),
      onNavigateToNew: () => navigate('projects/new')
    });

    const simulatedCreatePage = React.cloneElement(<CreateProjectPage />, {
      onSuccess: () => navigate('projects'),
      onCancel: () => navigate('projects')
    });

    switch (appState.currentRoute) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return simulatedProjectsPage;
      case 'projects/new':
        return simulatedCreatePage;
      case 'projects/detail':
        return <ProjectDetailPage />;
      default:
        return <Dashboard />;
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentRoute={appState.currentRoute}
        onNavigate={navigate}
      />

      <Header
        onMenuClick={() => setSidebarOpen(true)}
        title={pageInfo.title}
        subtitle={pageInfo.subtitle}
      />

      <main className="lg:ml-64 pt-8">
        <div className="p-4 lg:p-6">

          {renderContent()}
        </div>
      </main>
    </div>
  );
};
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Activity, BarChart3, FileText, Home, Settings, Users, X } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

// Interface para definir as propriedades que o componente receberá
interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Hook para saber a rota atual
    const { data, lastUpdate } = useDashboard(); // Pega os dados para o status do sistema

    // Itens de navegação agora estão dentro do componente
    const navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
        { id: 'projects', label: 'Projetos', icon: FileText, path: '/projetos' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
        { id: 'engineers', label: 'Engenheiros', icon: Users, path: '/engineers' },
        { id: 'settings', label: 'Configurações', icon: Settings, path: '/settings' }
    ];

    const handleNavigate = (path: string) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <div
            id="mobile-sidebar"
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-900">CAD Companion</span>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <nav className="mt-6 px-3">
                <div className="space-y-1">
                    {navigationItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigate(item.path)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* System Status in Sidebar */}
            <div className="absolute bottom-4 left-3 right-3">
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div
                            className={`w-2 h-2 rounded-full ${data?.systemStatus === 'healthy'
                                    ? 'bg-green-500'
                                    : data?.systemStatus === 'warning'
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                }`}
                        />
                        <span className="text-xs font-medium text-gray-700">
                            Sistema{' '}
                            {data?.systemStatus === 'healthy'
                                ? 'Saudável'
                                : data?.systemStatus === 'warning'
                                    ? 'Atenção'
                                    : 'Crítico'}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500">
                        Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                    </div>
                </div>
            </div>
        </div>
    );
};
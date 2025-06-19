import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Menu, X, Home, BarChart3, Settings, Users, FileText, Target,
    Activity, Zap, ChevronLeft, ChevronRight, User, Database, Cog
} from 'lucide-react';

// Configurations (pode ser movido para um arquivo separado, ex: src/config/navigation.js)
const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/', description: 'Visão geral operacional' },
    { id: 'projects', label: 'Projetos', icon: FileText, path: '/projects', description: 'Gestão de projetos CAD' },
    { id: 'bom', label: 'BOMs', icon: Database, path: '/bom', description: 'Lista de materiais' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics', description: 'Métricas e relatórios' },
    { id: 'engineers', label: 'Engenheiros', icon: Users, path: '/engineers', description: 'Atividade da equipe' },
    { id: 'quality', label: 'Qualidade', icon: Target, path: '/quality', description: 'Controle de qualidade' }
];

const systemItems = [
    { id: 'settings', label: 'Configurações', icon: Settings, path: '/settings', description: 'Configurações do sistema' },
    { id: 'system', label: 'Sistema', icon: Cog, path: '/system', description: 'Status e manutenção' }
];


const Sidebar = ({ isCollapsed, onToggle, isMobileOpen, onMobileClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActivePage = (path) => location.pathname === path;

    const handleNavigation = (path) => {
        navigate(path);
        onMobileClose();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Logo Section */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="min-w-0">
                                <div className="font-bold text-gray-900 text-sm truncate">CAD Companion</div>
                                <div className="text-xs text-gray-500 truncate">Manufacturing Excellence</div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onToggle}
                        className="hidden lg:flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 text-gray-500"
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={onMobileClose}
                        className="lg:hidden flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 text-gray-500"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3">
                    {/* Main Navigation */}
                    <div className="space-y-1">
                        {!isCollapsed && (
                            <div className="px-2 py-2">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Operações</h3>
                            </div>
                        )}
                        {navigationItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.path)}
                                className={`
                  w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActivePage(item.path)
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                                title={isCollapsed ? item.label : ''}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && (
                                    <div className="min-w-0 flex-1 text-left">
                                        <div className="truncate">{item.label}</div>
                                        <div className="text-xs text-gray-500 truncate">{item.description}</div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* System Section */}
                    <div className="mt-8 space-y-1">
                        {!isCollapsed && (
                            <div className="px-2 py-2">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sistema</h3>
                            </div>
                        )}
                        {systemItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.path)}
                                className={`
                  w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActivePage(item.path)
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                                title={isCollapsed ? item.label : ''}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && (
                                    <div className="min-w-0 flex-1 text-left">
                                        <div className="truncate">{item.label}</div>
                                        <div className="text-xs text-gray-500 truncate">{item.description}</div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* System Status & User Section... (código original mantido) */}
            </div>
        </>
    );
};

export default Sidebar;
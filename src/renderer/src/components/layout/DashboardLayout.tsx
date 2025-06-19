import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Bell, Search, AlertTriangle } from 'lucide-react';

// 1. Importe o novo componente Sidebar
import { Sidebar } from './Sidebar';
import { useDashboard } from '../../hooks/useDashboard';

const DashboardLayout: React.FC = () => {
    // O estado que controla a sidebar continua aqui, pois o layout é o "pai"
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, error, refresh, toggleRealTime, isRealTimeEnabled, setFilters, filters } =
        useDashboard();

    // Efeito para fechar a sidebar ao clicar fora (continua o mesmo)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.getElementById('mobile-sidebar');
            const menuButton = document.getElementById('mobile-menu-button');

            if (
                sidebar &&
                !sidebar.contains(event.target as Node) &&
                menuButton &&
                !menuButton.contains(event.target as Node)
            ) {
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

    // Se houver um erro de conexão, mostre a mensagem de erro (continua o mesmo)
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
            {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />}

            {/* 2. Renderize o componente Sidebar e passe as props necessárias */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

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
                            {/* Restante do Header (Search, Time Range, Notifications, etc.) */}
                            {/* ...código do header aqui... */}
                        </div>
                    </div>
                </header>

                {/* O Outlet renderizará a página da rota atual aqui */}
                <main className="flex-1 p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
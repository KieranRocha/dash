import React, { useState } from 'react';
import { Menu, Bell, Search, HelpCircle, User, Zap } from 'lucide-react';

// Configurations
const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/', description: 'Visão geral operacional' },
    { id: 'projects', label: 'Projetos', path: '/projects', description: 'Gestão de projetos CAD' },
    // ... adicione todos os outros itens de navegação e sistema aqui
];


const Header = ({ onMobileMenuToggle, sidebarCollapsed, currentPath }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState(3);

    const getPageInfo = (path) => {
        const item = allNavItems.find(item => item.path === path);
        return {
            title: item ? item.label : 'Dashboard',
            description: item ? item.description : 'Monitoramento em tempo real'
        };
    };

    const { title, description } = getPageInfo(currentPath);

    return (
        <header className={`
      bg-white border-b border-gray-200 h-16 fixed top-0 right-0 z-30 transition-all duration-300
      ${sidebarCollapsed ? 'left-16' : 'left-64'} lg:left-64 lg:${sidebarCollapsed ? 'left-16' : 'left-64'}
    `}>
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMobileMenuToggle}
                        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                    >
                        <Menu className="w-5 h-5 text-gray-500" />
                    </button>
                    <div className="hidden md:block">
                        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                        <p className="text-sm text-gray-500">{description} · Sistema ativo</p>
                    </div>
                </div>

                {/* Center & Right Sections... (código original mantido) */}
            </div>
        </header>
    );
};

export default Header;
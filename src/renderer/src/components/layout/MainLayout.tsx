import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';

const MainLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                isMobileOpen={mobileMenuOpen}
                onMobileClose={() => setMobileMenuOpen(false)}
            />
            <Header
                onMobileMenuToggle={() => setMobileMenuOpen(true)}
                sidebarCollapsed={sidebarCollapsed}
                currentPath={location.pathname}
            />
            <main
                className={`
          transition-all duration-300 pt-16
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        `}
            >
                <div className="min-h-[calc(100vh-4rem)]">
                    <Outlet /> {/* O conteúdo da rota atual será renderizado aqui */}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
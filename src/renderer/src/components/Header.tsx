import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Menu,
    Bell,
    Search,
    HelpCircle,
    User,
    Zap,
    ArrowLeft,
    Home,
    ChevronRight
} from 'lucide-react';

// Mapeamento para breadcrumbs dinâmicos
const breadcrumbConfig = {
    '/': { label: 'Dashboard', icon: null },
    '/projects': { label: 'Projetos', icon: null },
    '/projects/new': { label: 'Novo Projeto', icon: null },
    '/bom': { label: 'BOMs', icon: null },
    '/analytics': { label: 'Analytics', icon: null },
    '/engineers': { label: 'Engenheiros', icon: null },
    '/quality': { label: 'Qualidade', icon: null },
    '/settings': { label: 'Configurações', icon: null },
    '/system': { label: 'Sistema', icon: null }
};

const Header = ({ onMobileMenuToggle, sidebarCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();

    /**
     * Gera os breadcrumbs baseado na URL atual
     * @param {string} pathname - O caminho atual da URL
     * @returns {Array} Array de breadcrumbs para exibir
     */
    const generateBreadcrumbs = (pathname) => {
        const breadcrumbs = [];

        // Sempre começar com Home
        breadcrumbs.push({
            label: 'Dashboard',
            path: '/',
            icon: null,
            isActive: pathname === '/'
        });

        // Se não for a home, processar o caminho
        if (pathname !== '/') {
            const pathSegments = pathname.split('/').filter(segment => segment);
            let currentPath = '';

            pathSegments.forEach((segment, index) => {
                currentPath += `/${segment}`;
                const isLast = index === pathSegments.length - 1;

                // Verificar se é um ID numérico (para rotas dinâmicas)
                const isNumericId = !isNaN(segment) && segment !== '';

                let breadcrumbItem = {
                    path: currentPath,
                    isActive: isLast
                };

                // Configuração estática
                if (breadcrumbConfig[currentPath]) {
                    breadcrumbItem = {
                        ...breadcrumbItem,
                        ...breadcrumbConfig[currentPath]
                    };
                }
                // Rotas dinâmicas de projetos
                else if (currentPath.startsWith('/projects/') && isNumericId) {
                    breadcrumbItem.label = 'Detalhes do Projeto';
                }
                else if (currentPath.endsWith('/bom')) {
                    breadcrumbItem.label = 'Visualizador de BOM';
                }
                else if (currentPath.endsWith('/machines')) {
                    breadcrumbItem.label = 'Máquinas';
                }

                // Fallback para outros segmentos
                else {
                    breadcrumbItem.label = segment.charAt(0).toUpperCase() + segment.slice(1);
                }

                breadcrumbs.push(breadcrumbItem);
            });
        }

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs(location.pathname);

    const handleBreadcrumbClick = (path) => {
        navigate(path);
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Classes CSS para o posicionamento correto em relação à sidebar
    const headerClasses = `
        bg-white border-b border-gray-200 h-16 fixed top-0 right-0 z-30 transition-all duration-300
        left-0 ${sidebarCollapsed ? 'lg:left-16' : 'lg:left-64'}
    `;

    return (
        <header className={headerClasses}>
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Seção Esquerda: Menu, Voltar e Breadcrumbs */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMobileMenuToggle}
                        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                    >
                        <Menu className="w-5 h-5 text-gray-500" />
                    </button>

                    {/* Botão de Voltar */}
                    {location.pathname !== '/' && (
                        <button
                            onClick={handleBack}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="Voltar"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                    )}

                    {/* Sistema de Breadcrumbs */}
                    <nav className="hidden md:flex items-center space-x-1" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-1">
                            {breadcrumbs.map((crumb, index) => {
                                const isLast = index === breadcrumbs.length - 1;
                                const IconComponent = crumb.icon;

                                return (
                                    <li key={crumb.path} className="flex items-center">
                                        {/* Separador (não mostrar no primeiro item) */}
                                        {index > 0 && (
                                            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                                        )}

                                        {/* Item do Breadcrumb */}
                                        <div className="flex items-center">
                                            {isLast ? (
                                                // Item ativo (não clicável)
                                                <span className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                                    {IconComponent && <IconComponent className="w-4 h-4" />}
                                                    {crumb.label}
                                                </span>
                                            ) : (
                                                // Item clicável
                                                <button
                                                    onClick={() => handleBreadcrumbClick(crumb.path)}
                                                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 rounded px-2 py-1 hover:bg-gray-50"
                                                >
                                                    {IconComponent && <IconComponent className="w-4 h-4" />}
                                                    {crumb.label}
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>

                    {/* Título mobile (quando breadcrumbs não são visíveis) */}
                    <div className="md:hidden">
                        <h1 className="text-lg font-semibold text-gray-900">
                            {breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard'}
                        </h1>
                    </div>
                </div>

                {/* Seção Direita: Pesquisa e Ícones */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <Search
                                className="w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-600"
                                aria-hidden="true"
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Pesquisar"
                            className="w-full pl-11 pr-4 py-2.5 text-gray-800 bg-white border border-gray-200 rounded-lg placeholder:text-gray-500 transition-all duration-300 ease-in-out shadow-sm hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <HelpCircle className="w-5 h-5 text-gray-500" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 relative">
                            <Bell className="w-5 h-5 text-gray-500" />
                            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100">
                            <User className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
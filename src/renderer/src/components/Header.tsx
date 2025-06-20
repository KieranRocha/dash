import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Menu,
    Bell,
    Search,
    HelpCircle,
    User,
    Zap,
    ArrowLeft
} from 'lucide-react';

// Itens de navegação para consulta de títulos e descrições
const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/', description: 'Visão geral operacional' },
    { id: 'projects', label: 'Projetos', path: '/projects', description: 'Gestão de projetos CAD' },
    { id: 'projects/new', label: 'Novo Projeto', path: '/projects/new', description: 'Criar um novo projeto' },
    { id: 'bom', label: 'BOMs', path: '/bom', description: 'Lista de materiais' },
    { id: 'analytics', label: 'Analytics', path: '/analytics', description: 'Métricas e relatórios' },
    { id: 'engineers', label: 'Engenheiros', path: '/engineers', description: 'Atividade da equipe' },
    { id: 'quality', label: 'Qualidade', path: '/quality', description: 'Controle de qualidade' },
    { id: 'settings', label: 'Configurações', path: '/settings', description: 'Configurações do sistema' },
    { id: 'system', label: 'Sistema', path: '/system', description: 'Status e manutenção' }
];


const Header = ({ onMobileMenuToggle, sidebarCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();

    /**
     * Obtém as informações da página atual para exibir no header.
     * @param {string} path - O caminho da URL atual.
     * @returns {{title: string, description: string}}
     */
    const getPageInfo = (path) => {
        // Tenta encontrar uma correspondência estática primeiro
        const staticItem = allNavItems.find(item => item.path === path);
        if (staticItem) {
            return { title: staticItem.label, description: staticItem.description };
        }

        // Lida com caminhos dinâmicos (ex: /projects/1, /projects/1/edit)
        if (path.startsWith('/projects/')) {
            if (path.endsWith('/bom')) {
                return { title: 'Visualizador de BOM', description: 'Lista de materiais da máquina' };
            }
            return { title: 'Detalhes do Projeto', description: 'Informações detalhadas do projeto' };
        }


        // Retorno padrão para rotas não mapeadas
        const defaultItem = allNavItems.find(item => item.path === '/');
        return {
            title: defaultItem?.label || 'Dashboard',
            description: defaultItem?.description || 'Visão geral operacional'
        };
    };

    const { title, description } = getPageInfo(location.pathname);

    // O botão "voltar" só deve aparecer se não estivermos na página inicial.
    const showBackButton = location.pathname !== '/';

    const handleBack = () => {
        navigate(-1); // Função do react-router para voltar à página anterior no histórico
    };

    // Ajuste nas classes CSS para o posicionamento correto em relação à sidebar
    const headerClasses = `
        bg-white border-b border-gray-200 h-16 fixed top-0 right-0 z-30 transition-all duration-300
        left-0 ${sidebarCollapsed ? 'lg:left-16' : 'lg:left-64'}
    `;

    return (
        <header className={headerClasses}>
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Seção Esquerda: Botão de Menu, Voltar e Título */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onMobileMenuToggle}
                        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                    >
                        <Menu className="w-5 h-5 text-gray-500" />
                    </button>

                    {/* Botão de Voltar condicional */}
                    {showBackButton && (
                        <button
                            onClick={handleBack}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="Voltar"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                    )}

                    <div className="hidden md:block">
                        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>
                </div>

                {/* Seção Direita: Pesquisa e Ícones */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 group">
                        {/* Novo contêiner para o ícone: 
      - Ocupa toda a altura do input (inset-y-0).
      - Usa flexbox para centralizar o ícone verticalmente (flex items-center).
      - 'pointer-events-none' garante que o clique passe direto para o input.
    */}
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <Search
                                className="w-5 h-5 text-gray-400 transition-colors duration-300 group-focus-within:text-blue-600"
                                aria-hidden="true"
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Pesquisar"

                            // O padding esquerdo (pl-11) foi ajustado para dar espaço ao ícone
                            className="w-full pl-11 pr-4 py-2.5 text-gray-800 bg-white border border-gray-200 rounded-lg placeholder:text-gray-500 transition-all duration-300 ease-in-out shadow-sm hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <HelpCircle className="w-5 h-5 text-gray-500" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 relative">
                            <Bell className="w-5 h-5 text-gray-500" />
                            {/* Exemplo de notificação */}
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
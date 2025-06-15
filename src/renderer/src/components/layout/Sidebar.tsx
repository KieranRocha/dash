import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    Bell,
    User,
    ChevronLeft,
    ChevronRight,
    Wrench,
    Settings,
    LogOut,
    Moon,
    Sun,
    Maximize,
    Minimize,
    Wifi,
    WifiOff,
    HelpCircle,
    Command,
    ArrowUpRight,
    Filter,
    Calendar,
    Clock,
    Star,
    Archive
} from 'lucide-react';

// Importar componentes base (assumindo que estão disponíveis)
import { Button, Badge, Avatar, Card, Input, Tooltip } from './ui-components';

// ============ COMMAND PALETTE ============
const CommandPalette = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    const commands = [
        { id: 1, title: 'Ir para Dashboard', shortcut: 'Ctrl+D', category: 'Navegação' },
        { id: 2, title: 'Nova Extração BOM', shortcut: 'Ctrl+N', category: 'Ações' },
        { id: 3, title: 'Exportar Dados', shortcut: 'Ctrl+E', category: 'Ações' },
        { id: 4, title: 'Configurações', shortcut: 'Ctrl+,', category: 'Sistema' },
        { id: 5, title: 'Buscar Projetos', shortcut: 'Ctrl+P', category: 'Busca' },
        { id: 6, title: 'Alterar Tema', shortcut: 'Ctrl+T', category: 'Interface' }
    ];

    const filteredCommands = commands.filter(cmd =>
        cmd.title.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                onClose?.();
            } else if (e.key === 'Escape') {
                onClose?.();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh]">
            <Card className="w-full max-w-2xl mx-4 max-h-96 overflow-hidden" size="sm">
                <div className="border-b border-gray-200 pb-4 mb-4">
                    <Input
                        ref={inputRef}
                        placeholder="Digite um comando ou pesquise..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        icon={Search}
                        className="border-0 focus:ring-0 text-lg"
                    />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredCommands.map((cmd) => (
                        <button
                            key={cmd.id}
                            className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group flex items-center justify-between"
                            onClick={onClose}
                        >
                            <div>
                                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {cmd.title}
                                </div>
                                <div className="text-sm text-gray-500">{cmd.category}</div>
                            </div>
                            <Badge variant="default" size="sm" className="font-mono">
                                {cmd.shortcut}
                            </Badge>
                        </button>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4 text-sm text-gray-500 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">↵</kbd>
                            <span>Executar</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
                            <span>Fechar</span>
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

// ============ NOTIFICATIONS PANEL ============
const NotificationsPanel = ({ isOpen, onClose, notifications = [] }) => {
    const [filter, setFilter] = useState('all');

    const mockNotifications = [
        {
            id: 1,
            type: 'success',
            title: 'BOM Extraída com Sucesso',
            message: 'Projeto Alpha - 24 componentes identificados',
            time: '2 min atrás',
            read: false
        },
        {
            id: 2,
            type: 'warning',
            title: 'Sessão Inativa',
            message: 'Pedro Costa está inativo há 15 minutos',
            time: '5 min atrás',
            read: false
        },
        {
            id: 3,
            type: 'info',
            title: 'Atualização Disponível',
            message: 'Nova versão do sistema disponível',
            time: '1 hora atrás',
            read: true
        }
    ];

    const allNotifications = notifications.length > 0 ? notifications : mockNotifications;

    const filteredNotifications = allNotifications.filter(notif => {
        if (filter === 'unread') return !notif.read;
        if (filter === 'read') return notif.read;
        return true;
    });

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            case 'info': return 'ℹ️';
            default: return '📢';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-full right-0 mt-2 w-96 z-50">
            <Card size="sm" className="max-h-96 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Notificações</h3>
                    <div className="flex items-center space-x-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="text-sm border border-gray-200 rounded px-2 py-1"
                        >
                            <option value="all">Todas</option>
                            <option value="unread">Não lidas</option>
                            <option value="read">Lidas</option>
                        </select>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            ✕
                        </Button>
                    </div>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {filteredNotifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${notif.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                                }`}
                        >
                            <div className="flex items-start space-x-3">
                                <span className="text-lg">{getNotificationIcon(notif.type)}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-medium ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                            {notif.title}
                                        </h4>
                                        {!notif.read && <Badge dot variant="primary" />}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                    <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                    <Button variant="ghost" size="sm" fullWidth>
                        Ver todas as notificações
                    </Button>
                </div>
            </Card>
        </div>
    );
};

// ============ SEARCH WITH SUGGESTIONS ============
const SmartSearch = ({ className = '' }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const mockSuggestions = [
        { type: 'project', title: 'Projeto Alpha', subtitle: 'Última atualização: hoje' },
        { type: 'bom', title: 'BOM Motor V2.1', subtitle: '156 componentes' },
        { type: 'user', title: 'João Silva', subtitle: 'Engenheiro Senior' },
        { type: 'component', title: 'Parafuso M8x20', subtitle: 'Usado em 12 projetos' }
    ];

    useEffect(() => {
        if (query.length > 1) {
            const filtered = mockSuggestions.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filtered);
            setIsOpen(true);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    }, [query]);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'project': return '📁';
            case 'bom': return '📋';
            case 'user': return '👤';
            case 'component': return '⚙️';
            default: return '🔍';
        }
    };

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar projetos, BOMs, usuários..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 1 && setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">⌘K</kbd>
                </div>
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                    {suggestions.map((item, index) => (
                        <button
                            key={index}
                            className="w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                            onClick={() => {
                                setQuery(item.title);
                                setIsOpen(false);
                            }}
                        >
                            <span className="text-lg">{getTypeIcon(item.type)}</span>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900">{item.title}</div>
                                <div className="text-sm text-gray-500">{item.subtitle}</div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-gray-400" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ============ USER MENU ============
const UserMenu = ({ isOpen, onClose, user }) => {
    if (!isOpen) return null;

    const menuItems = [
        { icon: User, label: 'Perfil', shortcut: '⌘P' },
        { icon: Settings, label: 'Configurações', shortcut: '⌘,' },
        { icon: HelpCircle, label: 'Ajuda', shortcut: '⌘?' },
        { icon: Moon, label: 'Modo Escuro', shortcut: '⌘D' },
        { divider: true },
        { icon: LogOut, label: 'Sair', shortcut: '⌘Q', danger: true }
    ];

    return (
        <div className="absolute top-full right-0 mt-2 w-64 z-50">
            <Card size="sm">
                {/* User Info */}
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200 mb-3">
                    <Avatar initials="JS" size="md" status="online" />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">João Silva</p>
                        <p className="text-sm text-gray-500 truncate">j.silva@empresa.com</p>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1">
                    {menuItems.map((item, index) => {
                        if (item.divider) {
                            return <div key={index} className="border-t border-gray-200 my-2" />;
                        }

                        return (
                            <button
                                key={index}
                                className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between group ${item.danger
                                        ? 'hover:bg-red-50 hover:text-red-600'
                                        : 'hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                onClick={onClose}
                            >
                                <div className="flex items-center space-x-3">
                                    <item.icon className="w-4 h-4" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                <span className="text-xs text-gray-400 font-mono">{item.shortcut}</span>
                            </button>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

// ============ ENHANCED HEADER ============
export const Header = ({ onCommandPalette }) => {
    const [isConnected, setIsConnected] = useState(true);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

    // Simulate connection status
    useEffect(() => {
        const interval = setInterval(() => {
            setIsConnected(Math.random() > 0.1); // 90% uptime simulation
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // Command palette keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
                <div className="flex items-center justify-between">
                    {/* Search */}
                    <SmartSearch className="flex-1 max-w-2xl" />

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Connection Status */}
                        <Tooltip content={isConnected ? 'Conectado' : 'Desconectado'}>
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
                        </Tooltip>

                        <div className="h-6 w-px bg-gray-300"></div>

                        {/* Quick Actions */}
                        <Tooltip content="Paleta de Comandos (⌘K)">
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={Command}
                                onClick={() => setCommandPaletteOpen(true)}
                                className="hidden md:flex"
                            />
                        </Tooltip>

                        {/* Notifications */}
                        <div className="relative">
                            <Tooltip content="Notificações">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={Bell}
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="relative"
                                >
                                    <Badge
                                        variant="danger"
                                        size="sm"
                                        className="absolute -top-2 -right-2 min-w-[1.5rem] h-6 text-xs flex items-center justify-center"
                                    >
                                        3
                                    </Badge>
                                </Button>
                            </Tooltip>

                            <NotificationsPanel
                                isOpen={notificationsOpen}
                                onClose={() => setNotificationsOpen(false)}
                            />
                        </div>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <Avatar initials="JS" size="sm" status="online" />
                                <ChevronLeft className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-90' : ''}`} />
                            </button>

                            <UserMenu
                                isOpen={userMenuOpen}
                                onClose={() => setUserMenuOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <CommandPalette
                isOpen={commandPaletteOpen}
                onClose={() => setCommandPaletteOpen(false)}
            />
        </>
    );
};

// ============ NAV ITEM COMPONENT ============
export const NavItem = ({
    icon: Icon,
    label,
    active = false,
    badge,
    onClick,
    collapsed = false,
    shortcut,
    notification = false
}) => {
    return (
        <Tooltip content={collapsed ? label : ''} position="right">
            <button
                onClick={onClick}
                className={`
          w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left 
          transition-all duration-200 group relative overflow-hidden
          ${active
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-[1.02]'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:transform hover:scale-[1.01]'
                    }
        `}
                title={collapsed ? label : ''}
            >
                {/* Animated background for active state */}
                {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 animate-pulse" />
                )}

                <div className="relative flex items-center space-x-3 w-full">
                    <div className="relative">
                        <Icon className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${active ? 'text-white scale-110' : 'text-gray-400 group-hover:text-gray-600 group-hover:scale-110'
                            }`} />
                        {notification && (
                            <Badge
                                dot
                                variant="danger"
                                className="absolute -top-1 -right-1 w-2 h-2"
                                pulse
                            />
                        )}
                    </div>

                    {!collapsed && (
                        <>
                            <span className="font-medium flex-1 transition-all duration-200">
                                {label}
                            </span>

                            <div className="flex items-center space-x-2">
                                {badge && (
                                    <Badge
                                        variant={active ? 'default' : 'primary'}
                                        size="sm"
                                        className={active ? 'bg-white/20 text-white border-white/20' : ''}
                                    >
                                        {badge}
                                    </Badge>
                                )}

                                {shortcut && (
                                    <kbd className={`px-2 py-1 rounded text-xs font-mono ${active
                                            ? 'bg-white/10 text-white/70'
                                            : 'bg-gray-100 text-gray-500 opacity-0 group-hover:opacity-100'
                                        } transition-opacity duration-200`}>
                                        {shortcut}
                                    </kbd>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </button>
        </Tooltip>
    );
};

// ============ ENHANCED SIDEBAR ============
export const Sidebar = ({ collapsed, onToggle, activeSection, onSectionChange }) => {
    const [quickActions, setQuickActions] = useState([]);

    const navItems = [
        { id: 'dashboard', icon: Calendar, label: 'Dashboard', badge: null, shortcut: '⌘D' },
        { id: 'projects', icon: Archive, label: 'Projetos', badge: 8, shortcut: '⌘P', notification: true },
        { id: 'engineering', icon: Wrench, label: 'Engenharia', badge: null, shortcut: '⌘E' },
        { id: 'sessions', icon: User, label: 'Sessões', badge: 12, shortcut: '⌘S' },
        { id: 'reports', icon: Clock, label: 'Relatórios', badge: null, shortcut: '⌘R' },
        { id: 'settings', icon: Settings, label: 'Configurações', badge: null, shortcut: '⌘,' }
    ];

    // Quick actions for collapsed sidebar
    const handleQuickAction = (action) => {
        // Implement quick actions
        console.log('Quick action:', action);
    };

    return (
        <div className={`
      bg-white/95 backdrop-blur-lg border-r border-gray-200/50 h-full flex flex-col 
      transition-all duration-300 ease-out shadow-lg
      ${collapsed ? 'w-20' : 'w-72'}
    `}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200/50 flex items-center justify-between">
                {!collapsed && (
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Wrench className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 text-lg">EngDashboard</span>
                            <div className="text-xs text-gray-500">v2.1.0</div>
                        </div>
                    </div>
                )}

                <Tooltip content={collapsed ? 'Expandir' : 'Recolher'} position="right">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={collapsed ? ChevronRight : ChevronLeft}
                        onClick={onToggle}
                        className="hover:bg-gray-100"
                    />
                </Tooltip>
            </div>

            {/* Quick Stats (when expanded) */}
            {!collapsed && (
                <div className="p-4 border-b border-gray-200/50">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                            <div className="text-green-800 font-semibold text-lg">12</div>
                            <div className="text-green-600 text-xs">Online</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <div className="text-blue-800 font-semibold text-lg">8</div>
                            <div className="text-blue-600 text-xs">Projetos</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        active={activeSection === item.id}
                        badge={item.badge}
                        shortcut={item.shortcut}
                        notification={item.notification}
                        onClick={() => onSectionChange(item.id)}
                        collapsed={collapsed}
                    />
                ))}

                {/* Quick Actions for collapsed state */}
                {collapsed && (
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                        <Tooltip content="Ação Rápida" position="right">
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={Star}
                                onClick={() => handleQuickAction('favorite')}
                                className="w-full"
                            />
                        </Tooltip>
                    </div>
                )}
            </nav>

            {/* User Profile */}
            <div className={`p-4 border-t border-gray-200/50 ${collapsed ? 'flex justify-center' : ''}`}>
                {collapsed ? (
                    <Tooltip content="João Silva" position="right">
                        <Avatar initials="JS" size="md" status="online" />
                    </Tooltip>
                ) : (
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <Avatar initials="JS" size="md" status="online" />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">João Silva</p>
                            <p className="text-sm text-gray-500 truncate">Engenheiro Senior</p>
                        </div>
                        <Button variant="ghost" size="sm" icon={Settings} />
                    </div>
                )}
            </div>
        </div>
    );
};

// Demo Component
export default function LayoutDemo() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');

    return (
        <div className="h-screen bg-gray-50 flex">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            Layout Components Demo
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <h3 className="font-semibold mb-3">Features do Header:</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Busca inteligente com sugestões</li>
                                    <li>• Paleta de comandos (⌘K)</li>
                                    <li>• Notificações em tempo real</li>
                                    <li>• Menu de usuário completo</li>
                                    <li>• Status de conexão</li>
                                </ul>
                            </Card>

                            <Card>
                                <h3 className="font-semibold mb-3">Features da Sidebar:</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Navegação com atalhos</li>
                                    <li>• Estados visuais avançados</li>
                                    <li>• Quick stats incorporadas</li>
                                    <li>• Tooltips contextuais</li>
                                    <li>• Animações suaves</li>
                                </ul>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
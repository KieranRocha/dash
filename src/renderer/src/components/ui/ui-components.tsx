/* eslint-disable prettier/prettier */
import React, { useState, useEffect, forwardRef } from 'react';
import { Check, ChevronDown, X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

// ============ CARD COMPONENT ============
export const Card = ({
    children,
    variant = 'elevated',
    size = 'md',
    className = '',
    onClick,
    hoverable = true,
    animated = true,
    gradient = false
}) => {
    const variants = {
        elevated: 'bg-white shadow-lg border border-gray-100 hover:shadow-xl',
        outlined: 'bg-white border-2 border-gray-200 hover:border-gray-300',
        filled: 'bg-gray-50 border border-gray-200 hover:bg-gray-100',
        ghost: 'bg-transparent hover:bg-gray-50',
        gradient: 'bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100 hover:shadow-xl'
    };

    const sizes = {
        xs: 'p-3',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
    };

    const cardVariant = gradient ? 'gradient' : variant;

    return (
        <div
            className={`
        rounded-xl 
        ${animated ? 'transition-all duration-300 ease-out' : ''}
        ${hoverable && onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}
        ${variants[cardVariant]} 
        ${sizes[size]} 
        ${className}
        ${onClick ? 'select-none' : ''}
      `}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
        >
            {children}
        </div>
    );
};

// ============ BUTTON COMPONENT ============
export const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    className = '',
    loading = false,
    disabled = false,
    fullWidth = false,
    rounded = 'lg',
    ...props
}, ref) => {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:shadow-sm',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 shadow-sm hover:shadow-md',
        outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md',
        ghost: 'hover:bg-gray-100 text-gray-700 hover:shadow-sm',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg active:shadow-sm',
        success: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg active:shadow-sm',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg active:shadow-sm',
        gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
    };

    const sizes = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl'
    };

    const roundings = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
    };

    return (
        <button
            ref={ref}
            className={`
        ${roundings[rounded]}
        font-medium 
        transition-all 
        duration-200 
        ease-out
        focus:outline-none 
        focus:ring-4 
        focus:ring-blue-500/20 
        focus:ring-offset-2
        flex 
        items-center 
        justify-center 
        space-x-2 
        disabled:opacity-50 
        disabled:cursor-not-allowed 
        disabled:hover:scale-100
        ${fullWidth ? 'w-full' : ''}
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
        hover:scale-105 
        active:scale-95
        transform
      `}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
                    <span>{children}</span>
                    {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
                </>
            )}
        </button>
    );
});

// ============ BADGE COMPONENT ============
export const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    rounded = 'full',
    dot = false,
    pulse = false,
    className = ''
}) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800 border-gray-200',
        primary: 'bg-blue-100 text-blue-800 border-blue-200',
        success: 'bg-green-100 text-green-800 border-green-200',
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        danger: 'bg-red-100 text-red-800 border-red-200',
        info: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        purple: 'bg-purple-100 text-purple-800 border-purple-200',
        pink: 'bg-pink-100 text-pink-800 border-pink-200',
        indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };

    const sizes = {
        xs: 'text-xs px-1.5 py-0.5',
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-2 py-1',
        lg: 'text-base px-3 py-1',
        xl: 'text-lg px-4 py-2'
    };

    const roundings = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
    };

    if (dot) {
        return (
            <span className={`
        inline-flex items-center justify-center w-2 h-2 rounded-full
        ${variants[variant].split(' ')[0]}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `} />
        );
    }

    return (
        <span className={`
      inline-flex 
      items-center 
      font-medium 
      border
      transition-all
      duration-200
      ${roundings[rounded]}
      ${variants[variant]} 
      ${sizes[size]}
      ${pulse ? 'animate-pulse' : ''}
      ${className}
    `}>
            {children}
        </span>
    );
};

// ============ AVATAR COMPONENT ============
export const Avatar = ({
    src,
    alt,
    size = 'md',
    initials,
    className = '',
    status,
    statusPosition = 'bottom-right',
    rounded = 'full',
    border = false,
    fallbackColor = 'blue'
}) => {
    const sizes = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
        '2xl': 'w-20 h-20 text-2xl'
    };

    const statusColors = {
        online: 'bg-green-500',
        away: 'bg-yellow-500',
        busy: 'bg-red-500',
        offline: 'bg-gray-400'
    };

    const statusPositions = {
        'top-right': 'top-0 right-0',
        'top-left': 'top-0 left-0',
        'bottom-right': 'bottom-0 right-0',
        'bottom-left': 'bottom-0 left-0'
    };

    const fallbackColors = {
        blue: 'bg-blue-500 text-white',
        green: 'bg-green-500 text-white',
        yellow: 'bg-yellow-500 text-white',
        red: 'bg-red-500 text-white',
        purple: 'bg-purple-500 text-white',
        pink: 'bg-pink-500 text-white',
        indigo: 'bg-indigo-500 text-white',
        gray: 'bg-gray-400 text-white'
    };

    const roundings = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
    };

    return (
        <div className={`relative inline-block ${className}`}>
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className={`
            object-cover 
            ${sizes[size]} 
            ${roundings[rounded]}
            ${border ? 'border-2 border-white shadow-md' : ''}
            transition-all duration-200 hover:scale-105
          `}
                />
            ) : (
                <div className={`
          ${fallbackColors[fallbackColor]}
          ${sizes[size]}
          ${roundings[rounded]}
          ${border ? 'border-2 border-white shadow-md' : ''}
          flex items-center justify-center font-medium
          transition-all duration-200 hover:scale-105
        `}>
                    {initials || '?'}
                </div>
            )}

            {status && (
                <span className={`
          absolute w-3 h-3 border-2 border-white rounded-full
          ${statusColors[status]}
          ${statusPositions[statusPosition]}
          transition-all duration-200
        `} />
            )}
        </div>
    );
};

// ============ INPUT COMPONENT ============
export const Input = forwardRef(({
    label,
    error,
    success,
    hint,
    icon: Icon,
    iconPosition = 'left',
    size = 'md',
    variant = 'default',
    className = '',
    ...props
}, ref) => {
    const [focused, setFocused] = useState(false);

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-4 py-3 text-lg'
    };

    const variants = {
        default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20',
        success: 'border-green-500 focus:border-green-600 focus:ring-green-500/20',
        error: 'border-red-500 focus:border-red-600 focus:ring-red-500/20'
    };

    const inputVariant = error ? 'error' : success ? 'success' : variant;

    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <div className="relative">
                {Icon && iconPosition === 'left' && (
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                )}

                <input
                    ref={ref}
                    className={`
            w-full
            border
            rounded-lg
            transition-all
            duration-200
            focus:outline-none
            focus:ring-4
            focus:ring-offset-0
            ${sizes[size]}
            ${variants[inputVariant]}
            ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error ? 'border-red-500' : success ? 'border-green-500' : ''}
            ${focused ? 'transform scale-[1.01]' : ''}
            ${className}
          `}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    {...props}
                />

                {Icon && iconPosition === 'right' && (
                    <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                )}

                {error && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                )}

                {success && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
            </div>

            {(hint || error || success) && (
                <div className="flex items-center space-x-1 text-sm">
                    {error && (
                        <>
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-red-600">{error}</span>
                        </>
                    )}
                    {success && !error && (
                        <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-green-600">{success}</span>
                        </>
                    )}
                    {hint && !error && !success && (
                        <>
                            <Info className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500">{hint}</span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
});

// ============ SELECT COMPONENT ============
export const Select = ({
    options = [],
    value,
    onChange,
    placeholder = "Selecione...",
    label,
    error,
    success,
    size = 'md',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(
        options.find(opt => opt.value === value) || null
    );

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-4 py-3 text-lg'
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        onChange?.(option.value);
        setIsOpen(false);
    };

    return (
        <div className="relative space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <button
                type="button"
                className={`
          w-full
          text-left
          border
          rounded-lg
          transition-all
          duration-200
          focus:outline-none
          focus:ring-4
          focus:ring-blue-500/20
          focus:border-blue-500
          flex
          items-center
          justify-between
          ${sizes[size]}
          ${error ? 'border-red-500' : success ? 'border-green-500' : 'border-gray-300'}
          ${isOpen ? 'ring-4 ring-blue-500/20 border-blue-500' : ''}
          ${className}
        `}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`
                w-full
                text-left
                px-4
                py-2
                hover:bg-gray-50
                transition-colors
                duration-150
                flex
                items-center
                justify-between
                ${selectedOption?.value === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
              `}
                            onClick={() => handleSelect(option)}
                        >
                            <span>{option.label}</span>
                            {selectedOption?.value === option.value && (
                                <Check className="w-4 h-4 text-blue-600" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {error && (
                <div className="flex items-center space-x-1 text-sm">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">{error}</span>
                </div>
            )}
        </div>
    );
};

// ============ TOOLTIP COMPONENT ============
export const Tooltip = ({ children, content, position = 'top', delay = 0 }) => {
    const [visible, setVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    const positions = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };

    const arrows = {
        top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900',
        bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900',
        left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900',
        right: 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900'
    };

    const showTooltip = () => {
        if (delay > 0) {
            const id = setTimeout(() => setVisible(true), delay);
            setTimeoutId(id);
        } else {
            setVisible(true);
        }
    };

    const hideTooltip = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setVisible(false);
    };

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
            >
                {children}
            </div>

            {visible && (
                <div className={`absolute z-50 ${positions[position]} pointer-events-none`}>
                    <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg animate-in fade-in duration-200">
                        {content}
                        <div className={`absolute w-0 h-0 ${arrows[position]}`} />
                    </div>
                </div>
            )}
        </div>
    );
};

// ============ TOAST COMPONENT ============
export const Toast = ({
    type = 'info',
    title,
    message,
    onClose,
    autoClose = true,
    duration = 5000,
    actions = []
}) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(onClose, 300); // Wait for animation
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    const types = {
        success: {
            icon: CheckCircle,
            colors: 'bg-green-50 border-green-200 text-green-800',
            iconColor: 'text-green-600'
        },
        error: {
            icon: AlertCircle,
            colors: 'bg-red-50 border-red-200 text-red-800',
            iconColor: 'text-red-600'
        },
        warning: {
            icon: AlertTriangle,
            colors: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            iconColor: 'text-yellow-600'
        },
        info: {
            icon: Info,
            colors: 'bg-blue-50 border-blue-200 text-blue-800',
            iconColor: 'text-blue-600'
        }
    };

    const { icon: Icon, colors, iconColor } = types[type];

    return (
        <div className={`
      fixed top-4 right-4 z-50 max-w-md w-full
      transform transition-all duration-300 ease-out
      ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
            <div className={`
        border rounded-lg p-4 shadow-lg backdrop-blur-sm
        ${colors}
      `}>
                <div className="flex items-start space-x-3">
                    <Icon className={`w-5 h-5 mt-0.5 ${iconColor}`} />

                    <div className="flex-1 min-w-0">
                        {title && (
                            <h4 className="font-medium mb-1">{title}</h4>
                        )}
                        {message && (
                            <p className="text-sm opacity-90">{message}</p>
                        )}

                        {actions.length > 0 && (
                            <div className="flex space-x-2 mt-3">
                                {actions.map((action, index) => (
                                    <Button
                                        key={index}
                                        variant="ghost"
                                        size="sm"
                                        onClick={action.onClick}
                                        className="text-current hover:bg-black/10"
                                    >
                                        {action.label}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className="text-current opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Demo Component para mostrar todos os componentes
export default function UIComponentsDemo() {
    const [selectedValue, setSelectedValue] = useState('');
    const [showToast, setShowToast] = useState(false);

    const selectOptions = [
        { value: 'option1', label: 'Opção 1' },
        { value: 'option2', label: 'Opção 2' },
        { value: 'option3', label: 'Opção 3' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Design System Components</h1>

                {/* Cards */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card variant="elevated" size="md">
                            <h3 className="font-semibold mb-2">Elevated Card</h3>
                            <p className="text-gray-600">Card com sombra elevada</p>
                        </Card>
                        <Card variant="outlined" size="md">
                            <h3 className="font-semibold mb-2">Outlined Card</h3>
                            <p className="text-gray-600">Card com borda</p>
                        </Card>
                        <Card variant="gradient" size="md">
                            <h3 className="font-semibold mb-2">Gradient Card</h3>
                            <p className="text-gray-600">Card com gradiente</p>
                        </Card>
                    </div>
                </section>

                {/* Buttons */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Buttons</h2>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="danger">Danger</Button>
                        <Button variant="gradient">Gradient</Button>
                        <Button variant="primary" loading>Loading</Button>
                    </div>
                </section>

                {/* Badges */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Badges</h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Badge variant="primary">Primary</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="danger">Danger</Badge>
                        <Badge variant="info">Info</Badge>
                        <Badge dot variant="success" />
                        <Badge pulse variant="danger">Live</Badge>
                    </div>
                </section>

                {/* Avatars */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Avatars</h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Avatar initials="JS" size="sm" />
                        <Avatar initials="MS" size="md" status="online" />
                        <Avatar initials="PC" size="lg" status="away" fallbackColor="green" />
                        <Avatar initials="AL" size="xl" status="busy" fallbackColor="purple" border />
                    </div>
                </section>

                {/* Form Components */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Form Components</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Nome"
                            placeholder="Digite seu nome"
                            hint="Este campo é obrigatório"
                        />
                        <Input
                            label="Email"
                            placeholder="email@exemplo.com"
                            success="Email válido"
                        />
                        <Input
                            label="Senha"
                            type="password"
                            placeholder="********"
                            error="Senha muito fraca"
                        />
                        <Select
                            label="Categoria"
                            options={selectOptions}
                            value={selectedValue}
                            onChange={setSelectedValue}
                            placeholder="Selecione uma opção"
                        />
                    </div>
                </section>

                {/* Interactive Demo */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Interactive Demo</h2>
                    <div className="flex gap-4">
                        <Tooltip content="Este é um botão com tooltip" position="top">
                            <Button variant="primary">Hover me</Button>
                        </Tooltip>

                        <Button
                            variant="success"
                            onClick={() => setShowToast(true)}
                        >
                            Show Toast
                        </Button>
                    </div>
                </section>

                {showToast && (
                    <Toast
                        type="success"
                        title="Sucesso!"
                        message="Componente toast funcionando perfeitamente"
                        onClose={() => setShowToast(false)}
                        actions={[
                            { label: 'Desfazer', onClick: () => console.log('Undo') }
                        ]}
                    />
                )}
            </div>
        </div>
    );
}
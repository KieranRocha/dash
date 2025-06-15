import React, { useState, useEffect, useRef } from 'react';
import {
    Plus,
    Minus,
    Upload,
    X,
    Check,
    Search,
    Calendar,
    Clock,
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    FileText,
    Paperclip,
    AlertCircle,
    CheckCircle,
    Info,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronUp,
    Settings,
    Save,
    RotateCcw,
    Trash2,
    Copy,
    Edit3,
    Tag,
    Star,
    Hash,
    DollarSign,
    Percent,
    Calculator,
    Link
} from 'lucide-react';

// Import base components
import { Button, Badge, Card, Input, Avatar, Tooltip } from './ui-components';

// ============ ENHANCED SELECT WITH SEARCH ============
export const SearchableSelect = ({
    options = [],
    value,
    onChange,
    placeholder = "Selecione uma opção...",
    searchPlaceholder = "Buscar...",
    label,
    error,
    success,
    multiple = false,
    creatable = false,
    loading = false,
    disabled = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOptions, setSelectedOptions] = useState(
        multiple ? (Array.isArray(value) ? value : []) : (value ? [value] : [])
    );

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (option) => {
        if (multiple) {
            const newSelection = selectedOptions.includes(option.value)
                ? selectedOptions.filter(v => v !== option.value)
                : [...selectedOptions, option.value];
            setSelectedOptions(newSelection);
            onChange?.(newSelection);
        } else {
            setSelectedOptions([option.value]);
            onChange?.(option.value);
            setIsOpen(false);
        }
        setSearchQuery('');
    };

    const handleCreate = () => {
        if (creatable && searchQuery.trim()) {
            const newOption = { value: searchQuery, label: searchQuery };
            handleSelect(newOption);
        }
    };

    const selectedLabels = options
        .filter(opt => selectedOptions.includes(opt.value))
        .map(opt => opt.label);

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    className={`
            w-full text-left border rounded-lg px-4 py-2 bg-white transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-500' : success ? 'border-green-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}
            ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          `}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            {selectedLabels.length > 0 ? (
                                multiple ? (
                                    <div className="flex flex-wrap gap-1">
                                        {selectedLabels.slice(0, 3).map((label, index) => (
                                            <Badge key={index} variant="primary" size="sm">
                                                {label}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const optionToRemove = options.find(opt => opt.label === label);
                                                        if (optionToRemove) handleSelect(optionToRemove);
                                                    }}
                                                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                        {selectedLabels.length > 3 && (
                                            <Badge variant="default" size="sm">
                                                +{selectedLabels.length - 3} mais
                                            </Badge>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-gray-900">{selectedLabels[0]}</span>
                                )
                            ) : (
                                <span className="text-gray-500">{placeholder}</span>
                            )}
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
                        {/* Search Input */}
                        <div className="p-2 border-b border-gray-200">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Options List */}
                        <div className="max-h-40 overflow-y-auto">
                            {loading ? (
                                <div className="p-3 text-center text-gray-500">Carregando...</div>
                            ) : filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`
                      w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors
                      flex items-center justify-between
                      ${selectedOptions.includes(option.value) ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
                    `}
                                        onClick={() => handleSelect(option)}
                                    >
                                        <span>{option.label}</span>
                                        {selectedOptions.includes(option.value) && (
                                            <Check className="w-4 h-4 text-blue-600" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="p-3 text-center text-gray-500">
                                    {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhuma opção disponível'}
                                    {creatable && searchQuery && (
                                        <button
                                            type="button"
                                            onClick={handleCreate}
                                            className="block w-full mt-2 p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            Criar "{searchQuery}"
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {(error || success) && (
                <div className="flex items-center space-x-1 mt-1 text-sm">
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
                </div>
            )}
        </div>
    );
};

// ============ FILE UPLOAD COMPONENT ============
export const FileUpload = ({
    accept = "*/*",
    multiple = false,
    maxSize = 10, // MB
    onUpload,
    label,
    hint,
    error,
    disabled = false,
    preview = true,
    className = ''
}) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFiles = (fileList) => {
        const newFiles = Array.from(fileList).map(file => ({
            id: Date.now() + Math.random(),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            status: 'pending'
        }));

        // Validate file size
        const validFiles = newFiles.filter(fileObj => {
            const sizeMB = fileObj.size / (1024 * 1024);
            return sizeMB <= maxSize;
        });

        setFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
        onUpload?.(validFiles.map(f => f.file));
    };

    const removeFile = (fileId) => {
        setFiles(prev => {
            const updated = prev.filter(f => f.id !== fileId);
            onUpload?.(updated.map(f => f.file));
            return updated;
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <div
                className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${error ? 'border-red-500 bg-red-50' : ''}
        `}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (!disabled) handleFiles(e.dataTransfer.files);
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => !disabled && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                    disabled={disabled}
                />

                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-1">
                    Clique para enviar ou arraste arquivos aqui
                </p>
                {hint && (
                    <p className="text-xs text-gray-500">{hint}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                    Tamanho máximo: {maxSize}MB
                </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((fileObj) => (
                        <div
                            key={fileObj.id}
                            className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-white"
                        >
                            {fileObj.preview ? (
                                <img
                                    src={fileObj.preview}
                                    alt={fileObj.name}
                                    className="w-10 h-10 object-cover rounded"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                    <Paperclip className="w-5 h-5 text-gray-400" />
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {fileObj.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatFileSize(fileObj.size)}
                                </p>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(fileObj.id);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="flex items-center space-x-1 mt-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">{error}</span>
                </div>
            )}
        </div>
    );
};

// ============ DYNAMIC FORM BUILDER ============
export const DynamicForm = ({
    schema = [],
    initialValues = {},
    onSubmit,
    onReset,
    loading = false,
    readOnly = false,
    className = ''
}) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const updateField = (fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));

        // Clear error when user starts typing
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: null }));
        }
    };

    const validateField = (field, value) => {
        if (field.required && (!value || value.toString().trim() === '')) {
            return `${field.label} é obrigatório`;
        }

        if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
            return 'Email inválido';
        }

        if (field.type === 'number' && value && isNaN(value)) {
            return 'Deve ser um número válido';
        }

        if (field.minLength && value && value.length < field.minLength) {
            return `Mínimo de ${field.minLength} caracteres`;
        }

        if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
            return field.patternMessage || 'Formato inválido';
        }

        return null;
    };

    const handleSubmit = () => {
        // Validate all fields
        const newErrors = {};
        schema.forEach(field => {
            const error = validateField(field, formData[field.name]);
            if (error) newErrors[field.name] = error;
        });

        setErrors(newErrors);
        setTouched(schema.reduce((acc, field) => ({ ...acc, [field.name]: true }), {}));

        if (Object.keys(newErrors).length === 0) {
            onSubmit?.(formData);
        }
    };

    const handleReset = () => {
        setFormData(initialValues);
        setErrors({});
        setTouched({});
        onReset?.();
    };

    const renderField = (field) => {
        const value = formData[field.name] || '';
        const error = touched[field.name] ? errors[field.name] : null;
        const success = touched[field.name] && !errors[field.name] && value ? 'Válido' : null;

        const commonProps = {
            label: field.label,
            error,
            success,
            disabled: readOnly || loading,
            placeholder: field.placeholder,
            required: field.required
        };

        switch (field.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'number':
                return (
                    <Input
                        key={field.name}
                        type={field.type}
                        value={value}
                        onChange={(e) => updateField(field.name, e.target.value)}
                        onBlur={() => setTouched(prev => ({ ...prev, [field.name]: true }))}
                        {...commonProps}
                    />
                );

            case 'textarea':
                return (
                    <div key={field.name}>
                        {field.label && (
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                        )}
                        <textarea
                            value={value}
                            onChange={(e) => updateField(field.name, e.target.value)}
                            onBlur={() => setTouched(prev => ({ ...prev, [field.name]: true }))}
                            placeholder={field.placeholder}
                            rows={field.rows || 3}
                            disabled={readOnly || loading}
                            className={`
                w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${error ? 'border-red-500' : success ? 'border-green-500' : 'border-gray-300'}
                ${readOnly || loading ? 'bg-gray-100' : ''}
              `}
                        />
                        {(error || success) && (
                            <div className="flex items-center space-x-1 mt-1 text-sm">
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
                            </div>
                        )}
                    </div>
                );

            case 'select':
                return (
                    <SearchableSelect
                        key={field.name}
                        options={field.options || []}
                        value={value}
                        onChange={(val) => updateField(field.name, val)}
                        multiple={field.multiple}
                        {...commonProps}
                    />
                );

            case 'file':
                return (
                    <FileUpload
                        key={field.name}
                        accept={field.accept}
                        multiple={field.multiple}
                        maxSize={field.maxSize}
                        onUpload={(files) => updateField(field.name, files)}
                        {...commonProps}
                    />
                );

            case 'checkbox':
                return (
                    <div key={field.name} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={field.name}
                            checked={value}
                            onChange={(e) => updateField(field.name, e.target.checked)}
                            disabled={readOnly || loading}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={field.name} className="text-sm text-gray-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Card size="md" className={className}>
            <div onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {schema.map(field => (
                        <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                            {renderField(field)}
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        disabled={loading}
                        icon={RotateCcw}
                    >
                        Limpar
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        loading={loading}
                        icon={Save}
                        onClick={handleSubmit}
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

// ============ PROJECT FORM COMPONENT ============
export const ProjectForm = ({ project, onSubmit, loading = false }) => {
    const projectSchema = [
        {
            name: 'name',
            type: 'text',
            label: 'Nome do Projeto',
            placeholder: 'Ex: Motor Elétrico V3.0',
            required: true,
            fullWidth: true
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Descrição',
            placeholder: 'Descreva o projeto...',
            rows: 3,
            fullWidth: true
        },
        {
            name: 'category',
            type: 'select',
            label: 'Categoria',
            required: true,
            options: [
                { value: 'mechanical', label: 'Mecânico' },
                { value: 'electrical', label: 'Elétrico' },
                { value: 'software', label: 'Software' },
                { value: 'mixed', label: 'Misto' }
            ]
        },
        {
            name: 'priority',
            type: 'select',
            label: 'Prioridade',
            required: true,
            options: [
                { value: 'low', label: 'Baixa' },
                { value: 'medium', label: 'Média' },
                { value: 'high', label: 'Alta' },
                { value: 'critical', label: 'Crítica' }
            ]
        },
        {
            name: 'manager',
            type: 'select',
            label: 'Gerente do Projeto',
            required: true,
            options: [
                { value: 'joao', label: 'João Silva' },
                { value: 'maria', label: 'Maria Santos' },
                { value: 'pedro', label: 'Pedro Costa' },
                { value: 'ana', label: 'Ana Lima' }
            ]
        },
        {
            name: 'team',
            type: 'select',
            label: 'Equipe',
            multiple: true,
            options: [
                { value: 'eng1', label: 'Engenheiro Mecânico' },
                { value: 'eng2', label: 'Engenheiro Elétrico' },
                { value: 'des1', label: 'Designer Industrial' },
                { value: 'tec1', label: 'Técnico em CAD' }
            ]
        },
        {
            name: 'budget',
            type: 'number',
            label: 'Orçamento (R$)',
            placeholder: '0,00'
        },
        {
            name: 'deadline',
            type: 'date',
            label: 'Prazo de Entrega',
            required: true
        },
        {
            name: 'files',
            type: 'file',
            label: 'Documentos do Projeto',
            accept: '.pdf,.doc,.docx,.dwg,.step',
            multiple: true,
            maxSize: 50,
            fullWidth: true
        },
        {
            name: 'confidential',
            type: 'checkbox',
            label: 'Projeto Confidencial',
            fullWidth: true
        }
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {project ? 'Editar Projeto' : 'Novo Projeto'}
                </h2>
                <p className="text-gray-600">
                    {project ? 'Atualize as informações do projeto' : 'Preencha os dados para criar um novo projeto'}
                </p>
            </div>

            <DynamicForm
                schema={projectSchema}
                initialValues={project || {}}
                onSubmit={onSubmit}
                loading={loading}
            />
        </div>
    );
};

// Demo Component
export default function FormComponentsDemo() {
    const [loading, setLoading] = useState(false);

    const handleProjectSubmit = (data) => {
        setLoading(true);
        console.log('Project data:', data);
        setTimeout(() => {
            setLoading(false);
            alert('Projeto salvo com sucesso!');
        }, 2000);
    };

    const sampleOptions = [
        { value: 'option1', label: 'Primeira Opção' },
        { value: 'option2', label: 'Segunda Opção' },
        { value: 'option3', label: 'Terceira Opção' },
        { value: 'option4', label: 'Quarta Opção' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-900">Form Components Demo</h1>

                {/* Individual Components */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Individual Form Components</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card size="md">
                            <h3 className="font-semibold mb-4">Searchable Select</h3>
                            <SearchableSelect
                                label="Selecione uma opção"
                                options={sampleOptions}
                                placeholder="Escolha uma opção..."
                                searchPlaceholder="Buscar opções..."
                                creatable
                            />
                        </Card>

                        <Card size="md">
                            <h3 className="font-semibold mb-4">Multiple Select</h3>
                            <SearchableSelect
                                label="Múltiplas opções"
                                options={sampleOptions}
                                multiple
                                placeholder="Escolha várias opções..."
                            />
                        </Card>

                        <Card size="md" className="md:col-span-2">
                            <h3 className="font-semibold mb-4">File Upload</h3>
                            <FileUpload
                                label="Upload de Arquivos"
                                hint="Suporte para PDF, DOC, DWG, STEP"
                                accept=".pdf,.doc,.docx,.dwg,.step"
                                multiple
                                maxSize={20}
                                onUpload={(files) => console.log('Uploaded files:', files)}
                            />
                        </Card>
                    </div>
                </section>

                {/* Project Form */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Dynamic Project Form</h2>
                    <ProjectForm
                        onSubmit={handleProjectSubmit}
                        loading={loading}
                    />
                </section>

                {/* Features Overview */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Features Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <h3 className="font-semibold mb-3">Form Features:</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Dynamic form generation from schema</li>
                                <li>• Advanced validation system</li>
                                <li>• Real-time error feedback</li>
                                <li>• File upload with preview</li>
                                <li>• Searchable multi-select</li>
                                <li>• Responsive grid layout</li>
                            </ul>
                        </Card>

                        <Card>
                            <h3 className="font-semibold mb-3">Input Features:</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Smart search and filtering</li>
                                <li>• Drag & drop file uploads</li>
                                <li>• Type-ahead suggestions</li>
                                <li>• Custom validation rules</li>
                                <li>• Loading and disabled states</li>
                                <li>• Accessibility compliant</li>
                            </ul>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
}
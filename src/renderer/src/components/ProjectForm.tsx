// src/components/ProjectForm.tsx
import React, { useState, useEffect } from 'react';
import { Project } from '../types/index';
import { api } from '../services/api';

interface ProjectFormProps {
    projectToEdit?: Project | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ projectToEdit, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Project>>({
        name: '',
        contractNumber: '',
        client: '',
        status: 'Planning',
        responsibleEngineer: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = !!projectToEdit;

    useEffect(() => {
        if (isEditMode) {
            setFormData(projectToEdit);
        }
    }, [projectToEdit, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (isEditMode) {
                await api.updateProject(projectToEdit.id, formData);
            } else {
                await api.createProject(formData);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Falha ao salvar o projeto.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditMode ? 'Editar Projeto' : 'Novo Projeto'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nome do Projeto */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Projeto</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    {/* Contrato e Cliente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="contractNumber" className="block text-sm font-medium text-gray-700">Nº do Contrato</label>
                            <input type="text" name="contractNumber" id="contractNumber" value={formData.contractNumber} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="client" className="block text-sm font-medium text-gray-700">Cliente</label>
                            <input type="text" name="client" id="client" value={formData.client} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>

                    {/* Status e Engenheiro Responsável */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                <option>Planning</option>
                                <option>Active</option>
                                <option>OnHold</option>
                                <option>Completed</option>
                                <option>Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="responsibleEngineer" className="block text-sm font-medium text-gray-700">Engenheiro Responsável</label>
                            <input type="text" name="responsibleEngineer" id="responsibleEngineer" value={formData.responsibleEngineer} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Botões */}
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                            {isSubmitting ? 'Salvando...' : 'Salvar Projeto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
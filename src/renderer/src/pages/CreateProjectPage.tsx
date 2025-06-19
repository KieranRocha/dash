// src/pages/CreateProjectPage.tsx
import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
import { Stepper } from '../components/project/create/Stepper';
import { Step1_BasicInfo } from '../components/project/create/Step1_BasicInfo';
import { Step2_Scope } from '../components/project/create/Step2_Scope';
import { Step3_TimelineBudget } from '../components/project/create/Step3_TimelineBudget';
import { Step4_Machines } from '../components/project/create/Step4_Machines';
import { Step5_Team } from '../components/project/create/Step5_Team';
import { Step6_Review } from '../components/project/create/Step6_Review';
import { api } from '../services/api'; // Supondo que você tenha a instância da API aqui
import { Project } from '../types/';

const steps = [
    'Informações Básicas',
    'Escopo e Detalhes',
    'Prazos e Orçamento',
    'Máquinas',
    'Equipe',
    'Revisão',
];

export const CreateProjectPage: React.FC = () => {
    // const history = useHistory();
    const [currentStep, setCurrentStep] = useState(1);
    const [projectData, setProjectData] = useState<Partial<Project>>({
        machines: [],
        team: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateData = (newData: Partial<Project>) => {
        setProjectData((prev) => ({ ...prev, ...newData }));
    };

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        console.log("Enviando projeto para a API:", projectData);
        try {
            await api.createProject(projectData);
            alert("Projeto criado com sucesso!");
            // history.push('/projects');
        } catch (error) {
            console.error("Erro ao criar projeto:", error);
            alert("Falha ao criar o projeto.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return <Step1_BasicInfo data={projectData} updateData={updateData} />;
            case 2: return <Step2_Scope data={projectData} updateData={updateData} />;
            case 3: return <Step3_TimelineBudget data={projectData} updateData={updateData} />;
            case 4: return <Step4_Machines data={projectData} updateData={updateData} />;
            case 5: return <Step5_Team data={projectData} updateData={updateData} />;
            case 6: return <Step6_Review data={projectData} />;
            default: return <div>Passo inválido</div>;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Novo Projeto</h1>
                <p className="text-lg text-gray-600 mb-8">Siga os passos para configurar um novo projeto detalhadamente.</p>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <Stepper steps={steps} currentStep={currentStep} />
                    <div className="mt-10 py-6 border-t border-gray-200 min-h-[300px]">
                        {renderStepContent()}
                    </div>
                    <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
                        <div>
                            {currentStep > 1 && (
                                <button type="button" onClick={handleBack} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Voltar</button>
                            )}
                        </div>
                        <div>
                            {currentStep < steps.length && (
                                <button type="button" onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Avançar</button>
                            )}
                            {currentStep === steps.length && (
                                <button type="button" onClick={handleFinalSubmit} disabled={isSubmitting} className="px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-green-400">
                                    {isSubmitting ? 'Criando Projeto...' : 'Finalizar e Criar Projeto'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
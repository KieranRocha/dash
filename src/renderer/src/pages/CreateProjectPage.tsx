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
import { Project } from '../types/index';
import { Navigate, useNavigation } from 'react-router-dom';

// Os nomes dos passos para o Stepper
const steps = [
    'Informações Básicas',
    'Escopo e Detalhes',
    'Prazos e Orçamento',
    'Máquinas', // Este passo está alinhado com a necessidade de detalhar a máquina e o BOM
    'Equipe',
    'Revisão',
];
const MOCK_PROJECT_FOR_TESTING: Partial<Project> = {
    name: 'machien',
    contractNumber: 'C-2025-TEST',
    client: 'Cliente de Teste',
    description: 'Esta é uma descrição para um projeto de teste para agilizar o desenvolvimento e os testes de UI.',
    responsibleEngineer: 'Engenheiro de Teste',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    budgetValue: 150000,
    estimatedHours: 800,
    machines: [{ id: 1, name: 'Prensa Hidráulica P-100', code: 'PH-P100' }, { id: 2, name: 'Prensa Hidráulica P-150', code: 'PH-P100' }],
    team: [{ id: 1, name: 'Carlos Silva', email: 'carlos@email.com', role: 'Engineer' }],
};
export const CreateProjectPage: React.FC = () => {
    // const history = useHistory();
    const [currentStep, setCurrentStep] = useState(6); //! 1; // Começa no passo 1
    const [projectData, setProjectData] = useState<Partial<Project>>(MOCK_PROJECT_FOR_TESTING)
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Função para os componentes filhos atualizarem o estado centralizado
    const updateData = (newData: Partial<Project>) => {
        setProjectData((prev) => ({ ...prev, ...newData }));
    };

    // Funções para os botões de Avançar e Voltar
    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    // --- NOVA FUNÇÃO ---
    // Função para lidar com o clique direto em um passo no Stepper
    const handleStepClick = (step: number) => {
        // A lógica do componente Stepper já garante que esta função
        // só será chamada para passos concluídos (step < currentStep).
        setCurrentStep(step);
    };

    // Envia o projeto final para a API
    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        console.log("Dados originais do formulário:", projectData);

        try {
            // ✅ CORREÇÃO 1: Função para converter data local para ISO string corretamente
            const convertDateToISO = (dateString: string): string => {
                // Input: "2025-06-20" (formato do input date)
                // Criar data no timezone local às 12:00 para evitar problemas de timezone
                const [year, month, day] = dateString.split('-').map(Number);
                const localDate = new Date(year, month - 1, day, 12, 0, 0); // 12:00 local time
                return localDate.toISOString();
            };

            // ✅ CORREÇÃO 2: Mapear dados para formato correto do backend
            const projectPayload: CreateProject = {
                // Dados básicos do projeto
                name: projectData.name!,
                contractNumber: projectData.contractNumber || undefined,
                description: projectData.description || undefined,
                folderPath: projectData.folderPath || undefined,
                client: projectData.client || undefined,
                responsibleEngineer: projectData.responsibleEngineer || undefined,

                // ✅ DATAS CORRIGIDAS: Conversão segura para ISO
                startDate: projectData.startDate ? convertDateToISO(projectData.startDate) : undefined,
                endDate: projectData.endDate ? convertDateToISO(projectData.endDate) : undefined,

                // Dados financeiros
                budgetValue: projectData.budgetValue || undefined,
                estimatedHours: projectData.estimatedHours || undefined,

                // ✅ MÁQUINAS CORRIGIDAS: Mapear para formato do backend
                initialMachines: projectData.machines?.map((machine, index) => ({
                    name: machine.name,
                    operationNumber: machine.code || `OP-${String(index + 1).padStart(3, '0')}`, // OP-001, OP-002, etc
                    description: machine.description || `Máquina ${machine.name}`,
                    folderPath: undefined, // Será definido pelo backend
                    mainAssemblyPath: undefined // Será definido depois
                })) || []
            };

            console.log("✅ Payload corrigido para API:", projectPayload);

            // ✅ VALIDAÇÃO: Verificar dados obrigatórios
            if (!projectPayload.name?.trim()) {
                throw new Error("Nome do projeto é obrigatório");
            }

            // ✅ ENVIAR PARA API
            const createdProject = await api.createProject(projectPayload);

            console.log("✅ Projeto criado com sucesso:", createdProject);
            console.log(`✅ ${projectPayload.initialMachines?.length || 0} máquinas associadas`);

            // ✅ FEEDBACK DETALHADO
            const machineCount = projectPayload.initialMachines?.length || 0;
            const successMessage = machineCount > 0
                ? `Projeto "${createdProject.name}" criado com ${machineCount} máquina(s)!`
                : `Projeto "${createdProject.name}" criado com sucesso!`;

            alert(successMessage);

            // ✅ REDIRECIONAR PARA O PROJETO CRIADO (não para lista)

        } catch (error: any) {
            console.error("❌ Erro ao criar projeto:", error);

            // ✅ TRATAMENTO DE ERRO MELHORADO
            let errorMessage = "Falha ao criar o projeto.";

            if (error.message?.includes("Nome do projeto")) {
                errorMessage = "Nome do projeto é obrigatório.";
            } else if (error.status === 400) {
                errorMessage = "Dados inválidos. Verifique os campos preenchidos.";
            } else if (error.status === 500) {
                errorMessage = "Erro interno do servidor. Tente novamente.";
            } else if (error.message) {
                errorMessage = `Erro: ${error.message}`;
            }

            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };
    // Renderiza o conteúdo do passo atual
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
        <div className="min-h-screen bg-white layout-main">
            <div className="container mx-auto ">
                <div className="bg-white  sm:p-8 ">

                    {/* --- ATUALIZAÇÃO AQUI ---
                        A prop onStepClick foi adicionada para habilitar a navegação. */}
                    <Stepper
                        steps={steps}
                        currentStep={currentStep}
                        onStepClick={handleStepClick}
                    />

                    <div className="mt-20 py-6 border-t border-gray-200 min-h-[350px]">
                        {renderStepContent()}
                    </div>

                    <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between items-center">
                        <div>
                            {currentStep > 1 && (
                                <button type="button" onClick={handleBack} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Voltar</button>
                            )}
                        </div>
                        <div>
                            {currentStep < steps.length && (
                                <button type="button" onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Avançar</button>
                            )}
                            {currentStep === steps.length && (
                                <button type="button" onClick={handleFinalSubmit} disabled={isSubmitting} className="px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors">
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
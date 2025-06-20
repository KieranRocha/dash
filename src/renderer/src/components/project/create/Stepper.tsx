import React from 'react';
import { Check, Circle } from 'lucide-react';

interface StepperProps {
    steps: string[];
    currentStep: number;
    onStepClick: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
    return (
        <nav aria-label="Progresso do formulário" className="px-4 py-8 sm:px-6 lg:px-8">
            <ol role="list" className="flex w-full items-center">
                {steps.map((step, index) => {
                    const stepIndex = index + 1;
                    const isCompleted = currentStep > stepIndex;
                    const isCurrent = currentStep === stepIndex;
                    const isLast = index === steps.length - 1;

                    // O wrapper do passo (ícone + texto) que pode ser um botão ou uma div
                    const StepWrapper = isCompleted ? 'button' : 'div';
                    const wrapperProps = {
                        ...(isCompleted && { onClick: () => onStepClick(stepIndex) }),
                        className: 'relative flex flex-col items-center justify-center',
                        ...(isCompleted && { 'aria-label': `Voltar para o Passo ${stepIndex}: ${step}` }),
                    };

                    return (
                        <React.Fragment key={step}>
                            <li className="relative flex items-center">
                                <StepWrapper {...wrapperProps}>
                                    {/* Ícone do Step */}
                                    <span
                                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200 ${isCompleted
                                            ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-800'
                                            : isCurrent
                                                ? 'border-blue-600 bg-white text-blue-600 shadow-lg ring-2 ring-blue-100'
                                                : 'border-gray-300 bg-white text-gray-400'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-5 w-5" aria-hidden="true" />
                                        ) : isCurrent ? (
                                            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                                        ) : (
                                            <Circle className="h-4 w-4" aria-hidden="true" />
                                        )}
                                    </span>

                                    {/* Textos do Step (posicionados abaixo) */}
                                    <div className="absolute top-full mt-2 w-max text-center">
                                        <div
                                            className={`text-sm font-semibold tracking-wide ${isCompleted || isCurrent ? 'text-blue-600' : 'text-gray-500'}`}
                                        >
                                            Passo {stepIndex}
                                        </div>
                                        <div
                                            className={`text-sm ${isCurrent ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
                                        >
                                            {step}
                                        </div>
                                        {/* Indicador de status para o passo atual */}
                                        {isCurrent && (
                                            <span className="mt-1 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                Em andamento
                                            </span>
                                        )}
                                    </div>
                                </StepWrapper>
                            </li>

                            {/* Linha Conectora */}
                            {!isLast && (
                                <div
                                    className={`h-0.5 flex-1 transition-colors duration-300 ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                    aria-hidden="true"
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
};
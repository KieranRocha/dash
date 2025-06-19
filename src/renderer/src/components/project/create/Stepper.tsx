// src/components/project/create/Stepper.tsx
import React from 'react';

interface StepperProps {
    steps: string[];
    currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
    return (
        <nav aria-label="Progress">
            <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                {steps.map((step, index) => {
                    const stepIndex = index + 1;
                    const isCompleted = currentStep > stepIndex;
                    const isCurrent = currentStep === stepIndex;

                    return (
                        <li key={step} className="md:flex-1">
                            {isCompleted ? (
                                <div className="group flex flex-col border-l-4 border-blue-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                                    <span className="text-sm font-medium text-blue-600 transition-colors">
                                        Passo {stepIndex}
                                    </span>
                                    <span className="text-sm font-medium">{step}</span>
                                </div>
                            ) : isCurrent ? (
                                <div
                                    className="flex flex-col border-l-4 border-blue-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                                    aria-current="step"
                                >
                                    <span className="text-sm font-medium text-blue-600">
                                        Passo {stepIndex}
                                    </span>
                                    <span className="text-sm font-medium">{step}</span>
                                </div>
                            ) : (
                                <div className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                                    <span className="text-sm font-medium text-gray-500 transition-colors">
                                        Passo {stepIndex}
                                    </span>
                                    <span className="text-sm font-medium">{step}</span>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
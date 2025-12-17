import React from 'react';
import { AppStep } from '../types';
import { CheckCircle2, Circle } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: AppStep;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: AppStep.INPUT, label: '대본 입력' },
    { id: AppStep.TOPIC_SELECTION, label: '분석 & 주제 선정' },
    { id: AppStep.RESULT, label: '대본 완성' },
  ];

  const getStepStatus = (stepId: AppStep) => {
    const order = [AppStep.INPUT, AppStep.ANALYZING, AppStep.TOPIC_SELECTION, AppStep.GENERATING, AppStep.RESULT];
    const currentIndex = order.indexOf(currentStep === AppStep.ANALYZING ? AppStep.INPUT : (currentStep === AppStep.GENERATING ? AppStep.TOPIC_SELECTION : currentStep));
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 ${status === 'upcoming' ? 'opacity-40' : ''}`}>
                {status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold
                    ${status === 'current' ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-slate-300 text-slate-400'}
                  `}>
                    {index + 1}
                  </div>
                )}
                <span className={`text-sm font-medium hidden sm:block ${status === 'current' ? 'text-indigo-900' : 'text-slate-500'}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 sm:w-16 h-0.5 bg-slate-200 mx-2 sm:mx-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

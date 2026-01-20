import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '../ui/utils';

interface QuestionnaireStep {
  question: string;
  type: 'select' | 'textarea' | 'radio';
  options?: string[];
  required: boolean;
  field: string;
}

const questionnaireSteps: QuestionnaireStep[] = [
  {
    question: 'What type of issue are you facing?',
    type: 'select',
    options: [
      'Technical Problem',
      'Account Issue',
      'Payment/Billing',
      'Feature Request',
      'Bug Report',
      'General Inquiry',
      'Other'
    ],
    required: true,
    field: 'issueType'
  },
  {
    question: 'How would you describe the issue?',
    type: 'textarea',
    required: true,
    field: 'description'
  },
  {
    question: 'What is the priority level?',
    type: 'radio',
    options: ['Low', 'Medium', 'High', 'Urgent'],
    required: true,
    field: 'priority'
  },
  {
    question: 'Any additional details? (Optional)',
    type: 'textarea',
    required: false,
    field: 'additionalDetails'
  }
];

interface TicketForm {
  issueType: string;
  description: string;
  priority: string;
  additionalDetails?: string;
}

interface TicketQuestionnaireProps {
  onSubmit: (formData: TicketForm) => void;
  onCancel: () => void;
  originalMessage: string;
}

export function TicketQuestionnaire({ onSubmit, onCancel, originalMessage }: TicketQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<TicketForm>>({});

  const currentQuestion = questionnaireSteps[currentStep];
  const isLastStep = currentStep === questionnaireSteps.length - 1;
  const canProceed = currentQuestion.required 
    ? formData[currentQuestion.field as keyof TicketForm] 
    : true;

  const handleNext = () => {
    if (isLastStep) {
      // Submit form
      const finalFormData: TicketForm = {
        issueType: formData.issueType || '',
        description: formData.description || '',
        priority: formData.priority || 'Medium',
        additionalDetails: formData.additionalDetails,
      };
      onSubmit(finalFormData);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const handleChange = (value: string) => {
    setFormData({
      ...formData,
      [currentQuestion.field]: value
    });
  };

  return (
    <div className="p-4 space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-800/30">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questionnaireSteps.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 font-footer whitespace-nowrap">
          {currentStep + 1} / {questionnaireSteps.length}
        </span>
      </div>

      {/* Question */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-white font-hero block">
          {currentQuestion.question}
          {currentQuestion.required && (
            <span className="text-red-400 ml-1">*</span>
          )}
        </label>
        
        {/* Select Input */}
        {currentQuestion.type === 'select' && (
          <select
            value={formData[currentQuestion.field as keyof TicketForm] as string || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-3 text-white text-sm font-footer focus:outline-none focus:border-blue-500/50 transition-colors"
          >
            <option value="" className="bg-slate-800">Select an option...</option>
            {currentQuestion.options?.map(opt => (
              <option key={opt} value={opt} className="bg-slate-800">{opt}</option>
            ))}
          </select>
        )}
        
        {/* Textarea Input */}
        {currentQuestion.type === 'textarea' && (
          <textarea
            value={formData[currentQuestion.field as keyof TicketForm] as string || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-3 text-white text-sm font-footer min-h-[100px] resize-none focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-500"
            placeholder={currentQuestion.required ? "Please provide details..." : "Optional details..."}
          />
        )}
        
        {/* Radio Input */}
        {currentQuestion.type === 'radio' && (
          <div className="space-y-2">
            {currentQuestion.options?.map(opt => (
              <label
                key={opt}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  formData[currentQuestion.field as keyof TicketForm] === opt
                    ? "bg-blue-600/20 border-blue-500/50"
                    : "bg-slate-800/50 border-white/10 hover:bg-slate-800/70"
                )}
              >
                <input
                  type="radio"
                  name={currentQuestion.field}
                  value={opt}
                  checked={formData[currentQuestion.field as keyof TicketForm] === opt}
                  onChange={(e) => handleChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-white font-footer">{opt}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2 justify-between pt-2">
        <Button
          onClick={handleBack}
          variant="outline"
          className="bg-slate-800/50 border-white/10 text-gray-300 hover:text-white hover:bg-slate-800/70"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-gradient-to-br from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0"
        >
          {isLastStep ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Submit Ticket
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}


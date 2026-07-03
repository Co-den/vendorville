'use client'

import { motion } from 'framer-motion'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

const steps = ['Identity', 'Business', 'Location', 'Security']

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="step-indicator">
      <div className="step-header">
        <span className="step-count">Step {currentStep} of {totalSteps}</span>
      </div>

      <div className="progress-container">
        <div className="progress-bar-bg">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="step-dots">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className={`step-dot ${index < currentStep ? 'completed' : index === currentStep - 1 ? 'active' : 'pending'}`}
            animate={{
              scale: index === currentStep - 1 ? 1.2 : 1,
              backgroundColor: index < currentStep ? 'var(--accent)' : index === currentStep - 1 ? 'var(--accent)' : '#d1d5db',
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>

      <div className="step-labels">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`step-label ${index < currentStep ? 'completed' : index === currentStep - 1 ? 'active' : 'pending'}`}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

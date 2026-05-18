import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

export default function QuestionnaireModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title = "Questions",
  questions = [] 
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  if (!isOpen || questions.length === 0) return null;

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const isFirstStep = currentStep === 0;

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
  };

  const handleNext = () => {
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      alert('Please answer this question before proceeding');
      return;
    }
    if (isLastStep) {
      onSubmit(answers);
      setCurrentStep(0);
      setAnswers({});
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setAnswers({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl border border-slate-700 max-w-2xl w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Question {currentStep + 1} of {questions.length}
          </p>
        </div>

        {/* Question */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            {currentQuestion.question}
          </h3>

          {/* Question Type: Text Input */}
          {currentQuestion.type === 'text' && (
            <input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={currentQuestion.placeholder || 'Enter your answer...'}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          )}

          {/* Question Type: Textarea */}
          {currentQuestion.type === 'textarea' && (
            <textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={currentQuestion.placeholder || 'Enter your answer...'}
              rows={5}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
            />
          )}

          {/* Question Type: Multiple Choice */}
          {currentQuestion.type === 'multiple-choice' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <label
                  key={option}
                  className="flex items-center p-3 bg-slate-950 border border-slate-700 rounded-lg cursor-pointer hover:border-indigo-500 transition"
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="w-4 h-4 accent-indigo-500"
                  />
                  <span className="ml-3 text-slate-300">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* Question Type: Checkbox (Multiple Select) */}
          {currentQuestion.type === 'checkbox' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <label
                  key={option}
                  className="flex items-center p-3 bg-slate-950 border border-slate-700 rounded-lg cursor-pointer hover:border-indigo-500 transition"
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={(answers[currentQuestion.id] || []).includes(option)}
                    onChange={(e) => {
                      const current = answers[currentQuestion.id] || [];
                      if (e.target.checked) {
                        handleAnswerChange([...current, option]);
                      } else {
                        handleAnswerChange(current.filter(item => item !== option));
                      }
                    }}
                    className="w-4 h-4 accent-indigo-500"
                  />
                  <span className="ml-3 text-slate-300">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* Question Type: Rating */}
          {currentQuestion.type === 'rating' && (
            <div className="flex gap-3 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleAnswerChange(star)}
                  className={`text-4xl transition ${
                    answers[currentQuestion.id] >= star
                      ? 'text-yellow-400'
                      : 'text-slate-700 hover:text-slate-500'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          )}

          {/* Question Type: Dropdown */}
          {currentQuestion.type === 'dropdown' && (
            <select
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            >
              <option value="">Select an option...</option>
              {currentQuestion.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Footer with Buttons */}
        <div className="flex items-center justify-between p-6 border-t border-slate-700 gap-3">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition"
            >
              {isLastStep ? 'Submit' : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Plus, Rocket, Users, Calendar, Target, ArrowRight, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import './styles/ProjectCreationFlow.scss';
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../../Redux/Actions/PlatformActions.js/projectsActions';

export default function ProjectCreationFlow(createNew) {
  const [step, setStep] = useState('empty'); // empty, questions, creating, success
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const {projectCreateSucess} = useSelector((state)=>state.projects)
  const [answers, setAnswers] = useState({});
  const dispatch = useDispatch();
  const {userDetails} = useSelector((state)=>state.user)
  const questions = [
    {
      id: 'projectName',
      title: "What's your project name?",
      subtitle: "Give your project a memorable name",
      icon: Rocket,
      type: 'text',
      placeholder: 'e.g., Mobile App Redesign',
      validation: (value) => value.length >= 3
    },
    {
      id: 'projectType',
      title: "What type of project is this?",
      subtitle: "Select the category that best fits",
      icon: Target,
      type: 'select',
      options: [
        { value: 'web', label: 'Web Development' },
        { value: 'mobile', label: 'Mobile App' },
        { value: 'design', label: 'Design Project' },
        { value: 'marketing', label: 'Marketing Campaign' },
        { value: 'research', label: 'Research & Development' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'description',
      title: "Describe your project",
      subtitle: "What are you building and why?",
      icon: Sparkles,
      type: 'textarea',
      placeholder: 'Tell us about your project goals and objectives...',
      validation: (value) => value.length >= 10
    },
    {
      id: 'teamSize',
      title: "How many people will work on this?",
      subtitle: "Select your team size",
      icon: Users,
      type: 'radio',
      options: [
        { value: 'solo', label: 'Just me', description: 'Working alone' },
        { value: 'small', label: '2-5 people', description: 'Small team' },
        { value: 'medium', label: '6-15 people', description: 'Medium team' },
        { value: 'large', label: '15+ people', description: 'Large team' }
      ]
    },
    {
      id: 'timeline',
      title: "What's your project timeline?",
      subtitle: "When do you plan to complete this?",
      icon: Calendar,
      type: 'radio',
      options: [
        { value: 'week', label: '1 Week', description: 'Quick sprint' },
        { value: 'month', label: '1 Month', description: 'Short-term' },
        { value: 'quarter', label: '3 Months', description: 'Quarterly' },
        { value: 'year', label: '6+ Months', description: 'Long-term' }
      ]
    }
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value }); // directly storing data using input id instd of creating snd predefining data values in state
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('creating');
      dispatch(createProject(answers,userDetails?.id))
      setTimeout(() => {
        
        setStep('success');
        set
      }, 2000);
      console.log('Project Created with answers:', answers);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const isCurrentQuestionAnswered = () => {
    const question = questions[currentQuestion];
    const answer = answers[question.id];
    
    if (!answer) return false;
    
    if (question.validation) {
      return question.validation(answer);
    }
    
    return true;
  };

  const startProjectCreation = () => {
    setStep('questions');
  };

  const createAnotherProject = () => {
    setStep('empty');
    setCurrentQuestion(0);
    setAnswers({});
  };

  // Empty State
  if (step === 'empty') {
    return (
      <div className="project-flow">
        <div className="project-flow__content project-flow__content--centered">
          <div className="empty-state">
            <div className="empty-state__icon">
              <div className="icon-wrapper icon-wrapper--float">
                <Rocket className="icon icon--large" />
              </div>
            </div>
            {
              !createNew ?(
                <>
                   <h1 className="empty-state__title">No Projects Yet</h1>
            
            <p className="empty-state__description">
              It looks like you haven't created any projects. Let's get started and bring your ideas to life!
            </p>
                </>
              ):(
                <>
                   <h1 className="empty-state__title">Create your new Projects </h1>
            
            <p className="empty-state__description">
             Let's get started and bring your ideas to life!
            </p></>
              )
            }
         
            
            <button onClick={startProjectCreation} className="btn btn--primary btn--large">
              <Plus className="btn__icon" />
              Create Your First Project
            </button>
            
            <div className="feature-grid">
              <div className="feature-card">
                <Target className="feature-card__icon feature-card__icon--indigo" />
                <h3 className="feature-card__title">Set Goals</h3>
                <p className="feature-card__description">Define clear objectives</p>
              </div>
              <div className="feature-card">
                <Users className="feature-card__icon feature-card__icon--purple" />
                <h3 className="feature-card__title">Build Teams</h3>
                <p className="feature-card__description">Collaborate seamlessly</p>
              </div>
              <div className="feature-card">
                <Rocket className="feature-card__icon feature-card__icon--pink" />
                <h3 className="feature-card__title">Launch Fast</h3>
                <p className="feature-card__description">Ship with confidence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Creating State
  if (step === 'creating') {
    return (
      <div className="project-flow">
        <div className="project-flow__content project-flow__content--centered">
          <div className="loading-state">
            <div className="loading-state__spinner">
              <Sparkles className="icon icon--large" />
            </div>
            <h2 className="loading-state__title">Creating Your Project...</h2>
            <p className="loading-state__description">Setting things up for you</p>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (step === 'success' && projectCreateSucess) {
    return (
      <div className="project-flow">
        <div className="project-flow__content project-flow__content--centered">
          <div className="success-state">
            <div className="success-state__icon">
              <CheckCircle className="icon icon--large" />
            </div>
            
            <h1 className="success-state__title">Project Created! 🎉</h1>
            
            <p className="success-state__description">
              Your project "<strong>{answers.projectName}</strong>" is ready to go!
            </p>
            
            <div className="project-summary">
              <h3 className="project-summary__title">Project Summary</h3>
              <div className="project-summary__content">
                <div className="project-summary__row">
                  <span className="project-summary__label">Name:</span>
                  <span className="project-summary__value">{answers.projectName}</span>
                </div>
                <div className="project-summary__row">
                  <span className="project-summary__label">Type:</span>
                  <span className="project-summary__value">
                    {questions[1].options.find(o => o.value === answers.projectType)?.label}
                  </span>
                </div>
                <div className="project-summary__row">
                  <span className="project-summary__label">Team Size:</span>
                  <span className="project-summary__value">
                    {questions[3].options.find(o => o.value === answers.teamSize)?.label}
                  </span>
                </div>
                <div className="project-summary__row">
                  <span className="project-summary__label">Timeline:</span>
                  <span className="project-summary__value">
                    {questions[4].options.find(o => o.value === answers.timeline)?.label}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="success-state__actions">
              <button onClick={() => window.location.reload()} className="btn btn--primary btn--large">
                Go to Dashboard
              </button>
              <button onClick={createAnotherProject} className="btn btn--secondary btn--large">
                Create Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Questions Flow
  const currentQ = questions[currentQuestion];
  const CurrentIcon = currentQ.icon;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="project-flow">
      <div className="project-flow__content">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-bar__header">
            <span className="progress-bar__text">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="progress-bar__percentage">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="progress-bar__track">
            <div 
              className="progress-bar__fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <div className="question-card__header">
            <div className="question-icon">
              <CurrentIcon className="icon icon--medium" />
            </div>
            <div>
              <h2 className="question-card__title">{currentQ.title}</h2>
              <p className="question-card__subtitle">{currentQ.subtitle}</p>
            </div>
          </div>

          {/* Input Fields */}
          <div className="question-card__body">
            {currentQ.type === 'text' && (
              <input
                type="text"
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                placeholder={currentQ.placeholder}
                className="form-input"
                autoFocus
              />
            )}

            {currentQ.type === 'textarea' && (
              <textarea
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                placeholder={currentQ.placeholder}
                rows={5}
                className="form-textarea"
                autoFocus
              />
            )}

            {currentQ.type === 'select' && (
              <select
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                className="form-select"
              >
                <option value="">Select an option...</option>
                {currentQ.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {currentQ.type === 'radio' && (
              <div className="radio-grid">
                {currentQ.options.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQ.id, option.value)}
                    className={`radio-option ${answers[currentQ.id] === option.value ? 'radio-option--active' : ''}`}
                  >
                    <div className="radio-option__header">
                      <div className={`radio-button ${answers[currentQ.id] === option.value ? 'radio-button--checked' : ''}`}>
                        {answers[currentQ.id] === option.value && (
                          <div className="radio-button__dot" />
                        )}
                      </div>
                      <span className="radio-option__label">{option.label}</span>
                    </div>
                    <p className="radio-option__description">{option.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="question-card__footer">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="btn btn--ghost"
            >
              <ArrowLeft className="btn__icon" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered()}
              className="btn btn--primary"
            >
              {currentQuestion === questions.length - 1 ? 'Create Project' : 'Continue'}
              <ArrowRight className="btn__icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
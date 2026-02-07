import { ChevronRight, Check, Info, AlertCircle, Calendar, Target, Clock, TrendingUp, Zap, ChevronLeft } from 'lucide-react';
import { fetchAnalyticsMapping, saveAnalyticsMappingAction } from '../../Redux/Actions/AnalyticsActions/analyticsMappingActions';
import "./styles/sprintAnalyticsMapping.scss"
import { fetchProjectScrumFlow } from '../../Redux/Actions/SprintActions/sprintActionsV1';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';

const DroppableContainer = ({ id, children, className, onDragOver, onDragLeave }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  return (
    <div 
      ref={setNodeRef} 
      className={`${className} ${isOver ? 'drag-over' : ''}`}
    >
      {children}
    </div>
  );
};
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';

const SortableStatusChip = ({ id, status, colors, categoryColor, onToggle, isSelected }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    borderColor: colors?.[status]?.border || categoryColor,
    background: colors?.[status]?.bg || (isSelected ? `${categoryColor}15` : '#ffffff'),
    color: colors?.[status]?.text || '#111827',
    zIndex: isDragging ? 1000 : 'auto'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`statusChip ${isSelected ? 'selected' : ''} grab-handle`}
      {...attributes}
      {...listeners}
      onClick={() => onToggle(status)}
    >
      <div className={`checkbox ${isSelected ? 'selected' : ''}`}
           style={{ background: colors?.[status]?.border || categoryColor }}>
        {isSelected && <Check size={12} color="#ffffff" />}
      </div>
      <span>{status}</span>
    </div>
  );
};
const SprintAnalyticsMapping = ({ projectId, onCompleted }) => {
  const dispatch = useDispatch();

  const { mapping, loading } = useSelector((state) => state.analyticsMapping);
  const { ticketFlowTypes, statusColors } = useSelector((state) => state.sprint);

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [mappings, setMappings] = useState({
    sprintCompletion: 'storyPoints',
    velocityMetric: 'storyPoints',
    workflowStages: {
      todo: [],
      inProgress: [],
      testing: [],
      done: []
    },
    cycleTimeStart: 'backlog',
    cycleTimeEnd: 'done'
  });


//   =================== fetch api calls ===================
  useEffect(() => {
    const controller = new AbortController();
    if (projectId) {
      dispatch(fetchAnalyticsMapping(projectId));
      dispatch(fetchProjectScrumFlow(projectId));
    }
    return () => {
      controller.abort();
    };
  }, [projectId, dispatch]);
//   =================== fetch api calls ===================

//   =================== local state update ===================
  useEffect(() => {
    if (mapping && !loading) {
      setMappings({
        sprintCompletion: mapping.effortConfig?.field === 'estimatePoints' ? 'storyPoints' : mapping.effortConfig?.field === 'totalTimeLogged' ? 'timeLogged' : 'taskCount',
        velocityMetric: mapping.effortConfig?.field === 'estimatePoints' ? 'storyPoints' : mapping.effortConfig?.field === 'totalTimeLogged' ? 'timeLogged' : 'taskCount',
        workflowStages: mapping.statusMapping || {
          todo: [],
          inProgress: [],
          testing: [],
          done: []
        },
        cycleTimeStart: mapping.doraConfig?.leadTime?.startStatus?.toLowerCase() || 'backlog',
        cycleTimeEnd: mapping.doraConfig?.leadTime?.endStatus?.toLowerCase() || 'done'
      });
    }
  }, [mapping, loading]);
//   =================== local state update ===================

//   =================== local state update ===================
  const availableFields = {
    completion: [
      { id: 'storyPoints', label: 'Story Points', description: 'Fibonacci-based estimation' },
      { id: 'taskCount', label: 'Task Count', description: 'Simple count of completed tasks' },
      { id: 'timeLogged', label: 'Hours Logged', description: 'Actual time spent' }
    ]
  };

  const mappingSteps = [
    {
      id: 'sprintCompletion',
      title: 'Sprint Completion Metric',
      description: 'How do you measure completed work in your sprints?',
      helpText: 'This determines how velocity and sprint burndown are calculated. Story Points are recommended for agile teams using relative estimation.',
      icon: <Target size={24} />,
      type: 'single'
    },
    {
      id: 'velocityMetric',
      title: 'Velocity Tracking',
      description: 'Select the primary metric for team velocity measurement',
      helpText: 'Velocity helps predict future sprint capacity and track team productivity trends over time.',
      icon: <TrendingUp size={24} />,
      type: 'single'
    },
    {
      id: 'workflowStages',
      title: 'Workflow Stage Mapping',
      description: 'Map your statuses to workflow stages for accurate analytics',
      helpText: 'This helps Hora understand your team\'s workflow and calculate metrics like WIP, throughput, and flow efficiency.',
      icon: <Zap size={24} />,
      type: 'workflow'
    },
    {
      id: 'cycleTime',
      title: 'Cycle Time Boundaries',
      description: 'Define when work starts and ends for cycle time tracking',
      helpText: 'Cycle time measures how long it takes to complete work items. This helps identify bottlenecks and improve delivery speed.',
      icon: <Clock size={24} />,
      type: 'cycle'
    }
  ];

  const currentStepData = mappingSteps[currentStep];
  const isLastStep = currentStep === mappingSteps.length - 1;

  const canProceed = () => {
    const step = currentStepData.id;
    if (step === 'sprintCompletion' || step === 'velocityMetric') {
      return mappings[step] !== '';
    }
    if (step === 'workflowStages') {
      return mappings.workflowStages.done.length > 0;
    }
    if (step === 'cycleTime') {
      return mappings.cycleTimeStart !== '' && mappings.cycleTimeEnd !== '';
    }
    return false;
  };

  const handleFieldSelect = (fieldId) => {
    setMappings({
      ...mappings,
      [currentStepData.id]: fieldId
    });
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    const statusId = active.id;
    const overId = over.id;

    // Determine target category
    let targetCategory = null;
    if (['todo', 'inProgress', 'testing', 'done', 'pool'].includes(overId)) {
        targetCategory = overId;
    } else {
        // Find which category the 'over' element belongs to
        Object.keys(mappings.workflowStages).forEach(cat => {
            if (mappings.workflowStages[cat].includes(overId)) {
                targetCategory = cat;
            }
        });
        if (!targetCategory && (ticketFlowTypes || []).includes(overId)) {
            targetCategory = 'pool';
        }
    }

    if (!targetCategory) return;

    const newWorkflowStages = { ...mappings.workflowStages };
    
    // Remove from previous
    Object.keys(newWorkflowStages).forEach(cat => {
      newWorkflowStages[cat] = newWorkflowStages[cat].filter(id => id !== statusId);
    });

    // Add to new if not pool
    if (targetCategory !== 'pool') {
        newWorkflowStages[targetCategory] = [...newWorkflowStages[targetCategory], statusId];
    }

    setMappings({
      ...mappings,
      workflowStages: newWorkflowStages
    });
  };

  const handleStatusToggle = (statusId, category) => {
    // Keep click-to-toggle/move as a backup/alternative
    let foundCategory = null;
    Object.keys(mappings.workflowStages).forEach(cat => {
      if (mappings.workflowStages[cat].includes(statusId)) {
        foundCategory = cat;
      }
    });

    const newWorkflowStages = { ...mappings.workflowStages };

    if (foundCategory === category) {
      newWorkflowStages[category] = newWorkflowStages[category].filter(id => id !== statusId);
    } else {
      if (foundCategory) {
        newWorkflowStages[foundCategory] = newWorkflowStages[foundCategory].filter(id => id !== statusId);
      }
      newWorkflowStages[category] = [...newWorkflowStages[category], statusId];
    }
    
    setMappings({
      ...mappings,
      workflowStages: newWorkflowStages
    });
  };

  const handleCycleTimeSelect = (type, statusId) => {
    if (type === 'start') {
      setMappings({ ...mappings, cycleTimeStart: statusId });
    } else {
      setMappings({ ...mappings, cycleTimeEnd: statusId });
    }
  };

  const handleNext = () => {
    if (canProceed() && !isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const backendData = {
      effortConfig: {
        field: mappings.sprintCompletion === 'storyPoints' ? 'estimatePoints' : mappings.sprintCompletion === 'timeLogged' ? 'totalTimeLogged' : 'count',
        unit: mappings.sprintCompletion === 'storyPoints' ? 'points' : mappings.sprintCompletion === 'timeLogged' ? 'hours' : 'count'
      },
      statusMapping: mappings.workflowStages,
      doraConfig: {
        leadTime: {
          startStatus: mappings.cycleTimeStart?.toUpperCase(),
          endStatus: mappings.cycleTimeEnd?.toUpperCase(),
          startDateField: 'createdAt',
          endDateField: 'deployedAt'
        }
      }
    };

    console.log('Submitting sprint analytics mappings:', backendData);
    const res = await dispatch(saveAnalyticsMappingAction(projectId, backendData));
    if (res?.success || res?.projectId) {
       if (onCompleted) onCompleted();
    }
  };

  const getStageColor = (category) => {
    const colors = {
      todo: '#3b82f6',
      inProgress: '#f59e0b',
      testing: '#8b5cf6',
      done: '#10b981'
    };
    return colors[category] || '#64748b';
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="sprint-analytics-mapping-container">
      <div className="wrapper">
        {/* Header */}
        <div className="header">
          <div className="headerContent">
            <h1>Sprint Analytics Configuration</h1>
            <p>
              Configure how Hora calculates sprint metrics, velocity, and team performance analytics
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="progressContainer">
          <div className="progressBar">
            <div 
              className="progressFill"
              style={{
                width: `${((currentStep + 1) / mappingSteps.length) * 100}%`
              }}
            />
          </div>
          <span className="progressText">
            Step {currentStep + 1} of {mappingSteps.length}
          </span>
        </div>

        {/* Main Content */}
        <div className="content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Step Info */}
              <div className="stepInfo">
                <div className="stepIcon">
                  {currentStepData.icon}
                </div>
                <div>
                  <h2 className="stepTitle">{currentStepData.title}</h2>
                  <p className="stepDescription">{currentStepData.description}</p>
                </div>
              </div>

              {/* Help Banner */}
              <div className="helpBanner">
                <Info size={18} className="helpIcon" />
                <p className="helpText">{currentStepData.helpText}</p>
              </div>

              {/* Dynamic Content Based on Step */}
              {currentStepData.type === 'single' && (
                <div className="fieldList">
                  {availableFields.completion.map((field) => {
                    const isSelected = mappings[currentStepData.id] === field.id;

                    return (
                      <motion.div
                        key={field.id}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.99 }}
                        className={`fieldCard ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleFieldSelect(field.id)}
                      >
                        <div className="fieldCardContent">
                          <div>
                             <div className="fieldLabel">{field.label}</div>
                             <div className="fieldType">{field.description}</div>
                          </div>
                          {isSelected && (
                            <Check size={20} color="var(--primary-color)" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {currentStepData.type === 'workflow' && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="workflow-container">
                        {/* Unmapped Statuses Pool */}
                        <DroppableContainer id="pool" className="status-pool-section">
                            <h3 className="pool-title">Project Statuses (Unmapped)</h3>
                            <p className="pool-desc">Drag a status to a category or click to unassign</p>
                            
                            <SortableContext 
                                id="pool"
                                items={(ticketFlowTypes || []).filter(status => 
                                    !Object.values(mappings.workflowStages).flat().includes(status)
                                )}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="status-pool">
                                    {(ticketFlowTypes || []).filter(status => 
                                        !Object.values(mappings.workflowStages).flat().includes(status)
                                    ).map(status => (
                                        <SortableStatusChip
                                            key={status}
                                            id={status}
                                            status={status}
                                            colors={statusColors}
                                            onToggle={(s) => handleStatusToggle(s, null)}
                                            isSelected={false}
                                        />
                                    ))}
                                    {(ticketFlowTypes || []).filter(status => 
                                        !Object.values(mappings.workflowStages).flat().includes(status)
                                    ).length === 0 && <p className="pool-empty">All statuses mapped</p>}
                                </div>
                            </SortableContext>
                        </DroppableContainer>

                        <div className="workflowGrid">
                            {['todo', 'inProgress', 'testing', 'done'].map((category) => (
                            <DroppableContainer key={category} id={category} className="workflowColumn">
                                <div className="workflowHeader">
                                <div className="workflowTitle">
                                    {category === 'todo' ? 'To Do' : 
                                    category === 'inProgress' ? 'In Progress' :
                                    category === 'testing' ? 'Testing' : 'Done'}
                                </div>
                                <span className="workflowCount">
                                    {mappings.workflowStages[category].length}
                                </span>
                                </div>
                                
                                <SortableContext 
                                    id={category}
                                    items={mappings.workflowStages[category]}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="statusList">
                                        {mappings.workflowStages[category].map((status) => (
                                            <SortableStatusChip
                                                key={status}
                                                id={status}
                                                status={status}
                                                colors={statusColors}
                                                categoryColor={getStageColor(category)}
                                                onToggle={(s) => handleStatusToggle(s, category)}
                                                isSelected={true}
                                            />
                                        ))}
                                        
                                        {mappings.workflowStages[category].length === 0 && (
                                            <div className="empty-dropzone-hint">
                                                Drop statuses here
                                            </div>
                                        )}
                                    </div>
                                </SortableContext>
                            </DroppableContainer>
                            ))}
                        </div>
                    </div>

                    <DragOverlay dropAnimation={{
                        sideEffects: defaultDropAnimationSideEffects({
                            styles: {
                                active: { opacity: '0.5' },
                            },
                        }),
                    }}>
                        {activeId ? (
                            <div className="statusChip selected dragging-overlay">
                                <div className="checkbox selected" style={{ background: statusColors?.[activeId]?.border || 'var(--primary-color)' }}>
                                    <Check size={12} color="#ffffff" />
                                </div>
                                <span>{activeId}</span>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
              )}

              {currentStepData.type === 'cycle' && (
                <div className="cycleTimeContainer">
                  <div className="cycleTimeSection">
                    <h3 className="cycleTimeLabel">Starts At</h3>
                    <p className="cycleTimeDesc">Work moves into active status</p>
                    <div className="statusList">
                      {(ticketFlowTypes || []).map((status) => {
                        const isSelected = mappings.cycleTimeStart === status;
                        return (
                          <div
                            key={status}
                            className={`statusChip ${isSelected ? 'selected' : ''}`}
                            style={isSelected ? { borderColor: 'var(--primary-color)' } : {}}
                            onClick={() => handleCycleTimeSelect('start', status)}
                          >
                            <div className={`checkbox ${isSelected ? 'selected' : ''}`}
                                 style={isSelected ? { background: 'var(--primary-color)' } : {}}>
                              {isSelected && <Check size={12} color="#ffffff" />}
                            </div>
                            <span>{status}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="cycleTimeArrow">
                    <ChevronRight size={32} color="var(--border-focus)" opacity={0.5} />
                  </div>

                  <div className="cycleTimeSection">
                    <h3 className="cycleTimeLabel">Ends At</h3>
                    <p className="cycleTimeDesc">Work is officially completed</p>
                    <div className="statusList">
                      {(ticketFlowTypes || []).map((status) => {
                        const isSelected = mappings.cycleTimeEnd === status;
                        return (
                          <div
                            key={status}
                            className={`statusChip ${isSelected ? 'selected' : ''}`}
                            style={isSelected ? { borderColor: 'var(--primary-color)' } : {}}
                            onClick={() => handleCycleTimeSelect('end', status)}
                          >
                            <div className={`checkbox ${isSelected ? 'selected' : ''}`}
                                 style={isSelected ? { background: 'var(--primary-color)' } : {}}>
                              {isSelected && <Check size={12} color="#ffffff" />}
                            </div>
                            <span>{status}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="footer">
          <button
            className="button buttonSecondary"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft size={18} />
            Back
          </button>
          
          <button
            className="button buttonPrimary"
            onClick={isLastStep ? handleSubmit : handleNext}
            disabled={!canProceed()}
          >
            {isLastStep ? 'Complete Setup' : 'Continue'}
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <h3 className="sidebarTitle">Setup Progress</h3>
          <div className="summaryList">
            {mappingSteps.map((step, index) => {
              const isCurrent = index === currentStep;
              const isCompleted = index < currentStep || 
                (step.id === 'sprintCompletion' && mappings.sprintCompletion) ||
                (step.id === 'velocityMetric' && mappings.velocityMetric) ||
                (step.id === 'workflowStages' && mappings.workflowStages.done.length > 0) ||
                (step.id === 'cycleTime' && mappings.cycleTimeStart && mappings.cycleTimeEnd);

              return (
                <div
                  key={step.id}
                  className={`summaryItem ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <div className={`summaryDot ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}>
                    {isCompleted ? <Check size={16} /> : index + 1}
                  </div>
                  <div>
                    <div className="summaryLabel">{step.title}</div>
                    {isCompleted && step.id === 'sprintCompletion' && (
                      <div className="summaryValue">
                        {availableFields.completion.find(f => f.id === mappings.sprintCompletion)?.label}
                      </div>
                    )}
                    {isCompleted && step.id === 'workflowStages' && (
                      <div className="summaryValue">
                        {Object.values(mappings.workflowStages).flat().length} statuses mapped
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintAnalyticsMapping;
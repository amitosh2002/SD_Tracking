import React, { useCallback, useEffect, useState, useMemo } from 'react';
import './styles/issueDetails.scss';
import { ButtonUD, ButtonV1 } from '../customFiles/customComponent/CustomButtons';
// import defaultUser from "../assets/platformIcons/defaultUser.svg";
import { addStoryPointToTicket, addTimeLogForWork, assignTaskApi, changeTicketStatus, getTicketById, ticketLabelActions, ticketPriorityActions } from '../Redux/Actions/TicketActions/ticketAction';
import { useDispatch, useSelector } from 'react-redux';
import IconColorDropdown, { DropDownForTicketStatus, DropDownV1 } from '../customFiles/customComponent/DropDown';
import { PopupV1 } from '../customFiles/customComponent/popups';
import { convertInputToSeconds, formatMinutesToCustomDays, getLabelsbyId, getPriorityById, refactorSprintData } from '../utillity/helper';
import { SHOW_SNACKBAR } from '../Redux/Constants/PlatformConstatnt/platformConstant';
import { GET_TICKET_UPDATED_DETAILS } from '../Redux/Constants/ticketReducerConstants';
import { assignSprintToTicket, fetchProjectScrumFlow, fetctCurrentProjectSprint } from '../Redux/Actions/SprintActions/sprintActionsV1';
import { useNavigate } from 'react-router-dom';
import { 
    User, 
    UserPlus, 
    Calendar, 
    Hash, 
    Clock, 
    GitBranch, 
    MoreHorizontal, 
    ChevronLeft, 
    ChevronRight,
    Eye,
    Link as LinkIcon,
    AlertCircle,
    CheckCircle2,
    Lock,
    Terminal,
    Zap,
    TagIcon,
    Presentation
} from 'lucide-react';
import { ticketConfiguratorActionV1 } from '../Redux/Actions/PlatformActions.js/projectsActions';

const IssueDetails = ({ task }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const { ticketDetailsChange, selectedTicket } = useSelector((state) => state.worksTicket);
    const { ticketSprint, statusWorkFlow } = useSelector((state) => state.sprint);
    const ticketStatus = statusWorkFlow?.statuses || [];
    const { userDetails } = useSelector((state) => state.user);
    const {projectlabels,projectsPriorities}= useSelector((state)=>state.projects)
    

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [timeLogged, setTimeLogged] = useState('');
    const [timeLogPopup, setTimeLogPopup] = useState(false);
    const [githubPopup, setGithubPopup] = useState(false);
    const [githubErrorPopup, setGithubErrorPopup] = useState(false);
    const [sprints, setSprints] = useState([]);
    const [isEditingSP, setIsEditingSP] = useState(false);
    const [tempSP, setTempSP] = useState(0);
    const [showBranches, setShowBranches] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        if (task?._id) {
            dispatch(getTicketById(task._id));
            dispatch(fetchProjectScrumFlow(task?.projectId));
        }
    }, [dispatch, task?._id, ticketDetailsChange, task?.projectId]);

    // Sprint Management
    useEffect(() => {
        if (!selectedTicket?.projectId) return;
        dispatch(fetctCurrentProjectSprint(selectedTicket.projectId));
        dispatch(ticketConfiguratorActionV1(selectedTicket.projectId))

    }, [dispatch, selectedTicket?.projectId]);

    useEffect(() => {
        if (!ticketSprint) return;
        const refined = refactorSprintData(ticketSprint);
        setSprints(refined);
    }, [ticketSprint]);

    const activeSprint = useMemo(() => {
        if (!selectedTicket?.sprint || sprints.length === 0) return null;
        const sprintId = typeof selectedTicket.sprint === 'object' ? selectedTicket.sprint._id : selectedTicket.sprint;
        return sprints.find(s => s.id === sprintId) || null;
    }, [selectedTicket?.sprint, sprints]);

    // Handlers
    const handleStatusChange = useCallback((statusData) => {
        if (!selectedTicket?._id) return;
        dispatch(changeTicketStatus(selectedTicket._id, statusData?.newStatus));
        dispatch({ type: GET_TICKET_UPDATED_DETAILS });
    }, [selectedTicket?._id, dispatch]);

    const handleAssignToMe = () => {
        if (!selectedTicket?._id || !userDetails?.id) return;
        dispatch(assignTaskApi(selectedTicket._id, userDetails.id));
        dispatch({ type: GET_TICKET_UPDATED_DETAILS });
    };

    const handleSprintChange = async (e) => {
        const sprintId = e.target.value;
        if (!selectedTicket?._id) return;
        try {
            await dispatch(assignSprintToTicket(selectedTicket._id, sprintId));
            dispatch({ type: GET_TICKET_UPDATED_DETAILS });
            dispatch({ type: SHOW_SNACKBAR, payload: { message: "Sprint updated successfully", type: "success" } });
        } catch (err) {
            console.error('Failed to assign sprint', err);
        }
    };

    const handleStoryPointUpdate = async () => {
        if (!selectedTicket?._id || tempSP === "" || Number(tempSP) === selectedTicket?.storyPoint) {
            setIsEditingSP(false);
            return;
        }
        try {
            await dispatch(addStoryPointToTicket({
                point: Number(tempSP),
                userId: userDetails.id,
                ticketId: selectedTicket._id
            }));
            dispatch({ type: GET_TICKET_UPDATED_DETAILS });
            dispatch({ type: SHOW_SNACKBAR, payload: { message: `Story points updated to ${tempSP}`, type: "success" } });
            setIsEditingSP(false);
        } catch (err) {
            console.error("Error updating story points", err);
        }
    };

    const handleTimeLogSubmit = (e) => {
        e.preventDefault();
        let totalSeconds = convertInputToSeconds(timeLogged);
        if (!selectedTicket?._id || !userDetails?.id) return;

        dispatch(addTimeLogForWork(selectedTicket._id, userDetails.id, totalSeconds, ""));
        setTimeLogPopup(false);
        setTimeLogged("");
        dispatch({ type: GET_TICKET_UPDATED_DETAILS });
        dispatch({ type: SHOW_SNACKBAR, payload: { message: "Time logged successfully", type: "success" } });
    };

    const handleCreateBranchClick = async () => {
        if (!selectedTicket?.projectId) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${backendUrl}/api/gihub-repo/config/${selectedTicket.projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.config?.githubSecretCode) {
                setGithubPopup(true);
            } else {
                setGithubErrorPopup(true);
            }
        } catch (err) {
            setGithubErrorPopup(true);
            dispatch({
                type:"error",
                message:err
            })
        }
    };

    const handleBranchRedirect = () => {
        navigate('/create-branch', {
            state: {
                ticketId: selectedTicket?._id,
                ticketTitle: selectedTicket?.title,
                ticketKey: selectedTicket?.ticketKey,
                projectId: selectedTicket?.projectId
            }
        });
        setGithubPopup(false);
    };

    // label helper functions 

    if (isCollapsed) {
        return (
            <div className="sidebar_collapsed_strip" onClick={() => setIsCollapsed(false)}>
                <div className="expand_trigger">
                    <ChevronRight size={20} />
                </div>
                <div className="mini_stats">
                    <div className="stat_icon"><CheckCircle2 size={18} /></div>
                    <div className="stat_icon"><Clock size={18} /></div>
                </div>
            </div>
        );
    }

    return (
        <div className="modern_sidebar_container">
            {/* Header / Top Bar */}
            <div className="sidebar_header">
                <button className="collapse_toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
                <div className="header_actions">
                    <DropDownForTicketStatus
                        ticketTypes={ticketStatus.map(s => s.key || s.label || s)}
                        value={selectedTicket?.status || "OPEN"}
                        onStatusChange={(statusData) => {
                            handleStatusChange(statusData);
                        }}
                        className="status-dropdown"
                        ticketId={selectedTicket?._id}
                        statusWorkflow={statusWorkFlow?.workflow}
                        statusColors={statusWorkFlow?.statuses?.reduce((acc, s) => {
                            acc[s.key] = s.color;
                            return acc;
                        }, {})}
                    />
                    <div className="meta_actions">
                        <button className="icon_action"><Eye size={16} /> <span>5</span></button>
                        <button className="icon_action"><LinkIcon size={16} /></button>
                        <button className="icon_action"><MoreHorizontal size={16} /></button>
                    </div>
                </div>
            </div>

            <div className="sidebar_content">
                {/* User Section */}
                <section className="sidebar_section">
                    <h4 className="section_label">People</h4>
                    <div className="people_stack">
                        <div className="person_item">
                            <span className="small_label">Assignee</span>
                            <div className="person_column_layout">
                                {selectedTicket?.assignee && selectedTicket.assignee !== "Unassigned" ? (
                                    <div className="user_badge">
                                        <div className="avatar_circle">{selectedTicket.assignee[0]}</div>
                                        <span className="username_text">{selectedTicket.assignee}</span>
                                    </div>
                                ) : (
                                    <div className="user_badge unassigned">
                                        <div className="avatar_circle grey"><User size={14} /></div>
                                        <span className="username_text">Unassigned</span>
                                    </div>
                                )}
                                {selectedTicket?.assignee !== userDetails?.username && (
                                    <div style={{ marginTop: '0.25rem' }}>
                                        <ButtonUD text="Assign to me" onClick={handleAssignToMe} />
                                    </div>
                                )}
                                {selectedTicket?.assignee === userDetails?.username && (
                                    <div style={{ marginTop: '0.25rem' }}>
                                        <ButtonUD text="Unassign" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="person_item">
                            <span className="small_label">Reporter</span>
                            <div className="person_row">
                                <div className="user_badge">
                                    <div className="avatar_circle secondary">{selectedTicket?.reporter?.[0] || 'R'}</div>
                                    <span className="username_text">{selectedTicket?.reporter || 'Reporter'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Development Section */}
                <section className="sidebar_section highlight">
                    <h4 className="section_label">Intelligence & Dev</h4>
                    <div className="dev_grid">
                        {selectedTicket?.githubBranches && selectedTicket.githubBranches.length > 0 ? (
                            <div className="branch_section_expanded">
                                <div className="branch_header" onClick={() => setShowBranches(!showBranches)}>
                                    <div className="branch_info">
                                        <GitBranch size={16} />
                                        <span>{selectedTicket.githubBranches.length} Branch{selectedTicket.githubBranches.length > 1 ? 'es' : ''}</span>
                                    </div>
                                    <button className="icon_btn" onClick={(e) => { e.stopPropagation(); handleCreateBranchClick(); }}>
                                        <UserPlus size={16} />
                                    </button>
                                </div>
                                {showBranches && (
                                    <div className="branch_list">
                                        {selectedTicket.githubBranches.map((branch, idx) => (
                                            <a 
                                                key={idx} 
                                                href={branch.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="branch_item"
                                            >
                                                <GitBranch size={14} />
                                                <span className="branch_name">{branch.name}</span>
                                                <span className={`branch_status ${branch.status?.toLowerCase()}`}>
                                                    {branch.status || 'CREATED'}
                                                </span>
                                            </a>
                                        ))}
                                        <button className="create_branch_btn" onClick={handleCreateBranchClick}>
                                            <UserPlus size={14} />
                                            <span>Create New Branch</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="dev_card branch" onClick={handleCreateBranchClick}>
                                <GitBranch size={16} />
                                <span>Create Branch</span>
                            </div>
                        )}
                        <div className="dev_card vscode">
                            <Terminal size={16} />
                            <span>VS Code</span>
                        </div>
                    </div>
                </section>

                {/* Planning Section */}
                <section className="sidebar_section">
                    <h4 className="section_label">Planning</h4>
                    <div className="planning_stack">
                        <div className="planning_item">
                            <div className="item_header">
                                <Calendar size={14} />
                                <span>Sprint Execution</span>
                            </div>
                            <select 
                                className="modern_inline_select"
                                value={activeSprint?.id || ''}
                                onChange={handleSprintChange}
                            >
                                <option value="">Move to Backlog</option>
                                {sprints.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} {s.status === 'active' ? '●' : ''}</option>
                                ))}
                            </select>
                            {activeSprint && (
                                <div className="sprint_meta">
                                    <span className={`status_pill ${activeSprint.status}`}>{activeSprint.status}</span>
                                    <span className="date_range">{activeSprint.startDate} - {activeSprint.endDate}</span>
                                </div>
                            )}
                        </div>
                        <div className="planning_item">
                            <div className="item_header">
                                 <TagIcon size={19} color={getLabelsbyId(projectlabels, selectedTicket?.labels[0] || "")?.color || "#000000"} />
                                <span> Label</span>
                            </div>
                            
                                    <DropDownV1
                                        defaultType= {getLabelsbyId(projectlabels, selectedTicket?.labels[0]||"")?.name || 'select label'}
                                        accentColor={getLabelsbyId(projectlabels, selectedTicket?.labels[0]||"")?.color || "#ebdada"}
                                        dataTypes={projectlabels.map((label) => label.name)} // array of label names
                                        onChange={(selectedName) => {
                                                        // 1. Find the label object that matches the selected name
                                                const selectedLabel = projectlabels.find(label => label.name === selectedName);
                                                // 2. Extract the ID
                                                const labelId = selectedLabel?.id;

                                                if (labelId) {
                                                    // 3. Dispatch using the ID instead of just the name
                                                    dispatch(ticketLabelActions(selectedTicket?._id, labelId));
                                                }
                                            }}
                                    />
                            <div className="item_header">
                                 <Presentation size={19} color={getPriorityById(projectsPriorities,selectedTicket?.priority[0])?.color || "#c1aeae"} />
                                <span> Priority</span>
                            </div>
                            
                                    <DropDownV1
                                        defaultType= {getPriorityById(projectsPriorities,selectedTicket?.priority[0])?.name || 'select priority'}
                                        accentColor={getPriorityById(projectsPriorities,selectedTicket?.priority[0])?.color || "#f7eeee"}
                                        dataTypes={projectsPriorities.map((_ele) => _ele.name)} // array of label names
                                        onChange={(selectedName) => {
                                                        // 1. Find the label object that matches the selected name
                                                const selectedpriority = projectsPriorities.find(_ele => _ele.name === selectedName);
                                                // 2. Extract the ID
                                                const priorityId = selectedpriority?.id;

                                                if (priorityId) {
                                                    // 3. Dispatch using the ID instead of just the name
                                                    dispatch(ticketPriorityActions(selectedTicket?._id, priorityId));
                                                }
                                            }}
                                    />
                            
                            
                        </div>

                        {/* <IconColorDropdown/> */}

                        <div className="planning_item">
                            <div className="item_header">
                                <Hash size={14} />
                                <span>Story Point</span>
                            </div>
                            <div className="sp_input_wrapper">
                                <input 
                                    type="number" 
                                    className="modern_inline_input"
                                    value={isEditingSP ? tempSP : (selectedTicket?.storyPoint || 0)}
                                    onChange={(e) => setTempSP(e.target.value)}
                                    onFocus={() => {
                                        setTempSP(selectedTicket?.storyPoint || 0);
                                        setIsEditingSP(true);
                                    }}
                                    placeholder="0"
                                />
                                {isEditingSP && (
                                    <div className="sp_actions">
                                        <ButtonUD text="Add" onClick={handleStoryPointUpdate} />
                                        <ButtonUD text="Cancel" onClick={() => setIsEditingSP(false)} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Activity / Time Section */}
                <section className="sidebar_section">
                    <h4 className="section_label">Activity</h4>
                    <div className="activity_card" onClick={() => setTimeLogPopup(true)}>
                        <div className="activity_left">
                            <Clock size={16} />
                            <span>Work Logged</span>
                        </div>
                        <div className="activity_right">
                            <span className="time_value">{formatMinutesToCustomDays(selectedTicket?.totalTimeLogged)}</span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Popups */}
            {timeLogPopup && (
                <PopupV1 title="Log Work" onClose={() => setTimeLogPopup(false)}>
                    <form onSubmit={handleTimeLogSubmit} className="modern_popup_form">
                        <div className="input_group">
                            <label>Duration</label>
                            <input 
                                type="text" 
                                value={timeLogged}
                                onChange={(e) => setTimeLogged(e.target.value)}
                                placeholder="e.g. 2h 30m"
                                autoFocus
                            />
                        </div>
                        <p className="hint_text">Use d, h, m (e.g. 1d 4h)</p>
                        <ButtonV1 type="primary" style={{ width: '100%', marginTop: '1rem' }} disabled={!timeLogged.trim()}>
                            Record Time
                        </ButtonV1>
                    </form>
                </PopupV1>
            )}

            {githubPopup && (
                <PopupV1 title="Source Control" onClose={() => setGithubPopup(false)}>
                    <div className="modern_popup_content">
                        <Zap size={40} className="popup_hero_icon" color="#7C3AED" />
                        <h3>Ready to code?</h3>
                        <p>We'll create a synchronized branch on GitHub for this task.</p>
                        <div className="popup_actions">
                            <ButtonV1 type="primary" onClick={handleBranchRedirect}>Initialize Branch</ButtonV1>
                            <ButtonV1 type="secondary" onClick={() => setGithubPopup(false)}>Not now</ButtonV1>
                        </div>
                    </div>
                </PopupV1>
            )}

            {githubErrorPopup && (
                <PopupV1 title="Configuration Required" onClose={() => setGithubErrorPopup(false)}>
                    <div className="modern_popup_content error">
                        <AlertCircle size={40} className="popup_hero_icon" color="#EF4444" />
                        <h3>GitHub Not Connected</h3>
                        <p>This project hasn't been linked to a GitHub environment yet.</p>
                        <div className="popup_actions">
                            {(userDetails?.role === 'admin' || userDetails?.accessType >= 300) ? (
                                <ButtonV1 type="primary" onClick={() => navigate('/admin/github-config', { state: { projectId: selectedTicket?.projectId } })}>
                                    Configure Project
                                </ButtonV1>
                            ) : (
                                <p className="admin_hint">Please ask your administrator to link GitHub.</p>
                            )}
                            <ButtonV1 type="secondary" onClick={() => setGithubErrorPopup(false)}>Dismiss</ButtonV1>
                        </div>
                    </div>
                </PopupV1>
            )}
        </div>
    );
};

export default IssueDetails;

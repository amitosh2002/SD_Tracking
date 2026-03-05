import React, { useCallback, useEffect, useState, useMemo } from 'react';
import './styles/issueDetails.scss';
import { ButtonUD, ButtonV1 } from '../customFiles/customComponent/CustomButtons';
// import defaultUser from "../assets/platformIcons/defaultUser.svg";
import { addStoryPointToTicket, addTimeLogForWork, assignTaskApi, changeTicketStatus, cloneTicketActions, createTicket, getTicketById, ticketLabelActions, ticketPriorityActions, updateTicket } from '../Redux/Actions/TicketActions/ticketAction';
import { useDispatch, useSelector } from 'react-redux';
import IconColorDropdown, { CustomDropDownV3, DropDownForTicketStatus, DropDownV1, SimpleDivDropDown } from '../customFiles/customComponent/DropDown';
import { PopupV1 } from '../customFiles/customComponent/popups';
import { convertInputToSeconds, formatMinutesToCustomDays, getLabelsbyId, getPriorityById, refactorSprintData } from '../utillity/helper';
import { SHOW_SNACKBAR } from '../Redux/Constants/PlatformConstatnt/platformConstant';
import { GET_TICKET_UPDATED_DETAILS } from '../Redux/Constants/ticketReducerConstants';
import { fetchProjectScrumFlow, fetctCurrentProjectSprint } from '../Redux/Actions/SprintActions/sprintActionsV1';
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
    Presentation,
    Plus,
    PlusIcon,
    GitPullRequest,
    GitCommit,
    ExternalLink,
    Activity,
    ArrowLeft,
    Bookmark,
    ChevronsRight,
    Minimize2
} from 'lucide-react';
import { ticketConfiguratorActionV1, handleUsersInProjects, getProjectBacklogAction } from '../Redux/Actions/PlatformActions.js/projectsActions';
import SidePanel from '../customFiles/customComponent/utilityComponenet/sidePanel';
import apiClient from '../utils/axiosConfig';
import { getAllTicketApiv1 } from '../Api/Plat/TicketsApi';

const IssueDetails = ({ task }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const { ticketDetailsChange, selectedTicket } = useSelector((state) => state.worksTicket);
    const { ticketSprint, statusWorkFlow } = useSelector((state) => state.sprint);
    const ticketStatus = statusWorkFlow?.statuses || [];
    const { userDetails } = useSelector((state) => state.user);
    const { projectlabels, projectsPriorities, projectMembers, projectBacklog } = useSelector((state) => state.projects)
    

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [timeLogged, setTimeLogged] = useState('');
    const [timeLogPopup, setTimeLogPopup] = useState(false);
    const [githubPopup, setGithubPopup] = useState(false);
    const [githubErrorPopup, setGithubErrorPopup] = useState(false);
    const [sprints, setSprints] = useState([]);
    const [isEditingSP, setIsEditingSP] = useState(false);
    const [tempSP, setTempSP] = useState(0);
    const [showBranchPanel, setShowBranchPanel] = useState(false);
    const [isBreakPopupOpen, setIsBreakPopupOpen] = useState(false);
    const [newSubtaskTitles, setNewSubtaskTitles] = useState("");
    const [isEditingEta, setIsEditingEta] = useState(false);
    const [tempEta, setTempEta] = useState("");

    const [isMoreOptionOpen, setIsMoreOptionOpen] = useState(false);
    const [parentOptions, setParentOptions] = useState([]);

    // Fetch potential parent tickets from the same project
    useEffect(() => {
        const fetchTickets = async () => {
            if (!selectedTicket?.projectId) return;
            try {
                const res = await apiClient.get(`${getAllTicketApiv1}`, {
                    params: { project: selectedTicket.projectId, limit: 100 }
                });
                if (res.data?.items) {
                    const fetchedOptions = res.data.items
                        .filter(t => t._id !== selectedTicket._id)
                        .map(t => ({
                            label: t.ticketKey,
                            value: t._id,
                            fullLabel: `${t.ticketKey} - ${t.title}`
                        }));
                    setParentOptions(fetchedOptions);
                }
            } catch (err) {
                console.error("Error fetching tickets for parent selection:", err);
            }
        };
        fetchTickets();
    }, [selectedTicket?.projectId, selectedTicket?._id]);

    const handleParentChange = async (parentId) => {
        if (!selectedTicket?._id) return;
        try {
            const res = await apiClient.patch(`${getAllTicketApiv1}/update/${selectedTicket._id}`, {
                parentTicket: parentId
            });
            if (res.status === 200) {
                dispatch({ type: GET_TICKET_UPDATED_DETAILS });
                dispatch({
                    type: SHOW_SNACKBAR,
                    payload: { message: "Parent ticket updated successfully", type: "success" }
                });
            }
        } catch (err) {
            console.error("Failed to update parent ticket:", err);
            dispatch({
                type: SHOW_SNACKBAR,
                payload: { message: "Failed to update parent ticket", type: "error" }
            });
        }
    };

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
        dispatch(ticketConfiguratorActionV1(selectedTicket.projectId));
        dispatch(handleUsersInProjects(selectedTicket.projectId, "get"));
        dispatch(getProjectBacklogAction(selectedTicket.projectId));
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

    const assigneeOptions = useMemo(() => {
        if (!projectMembers || projectMembers.length === 0) return [];
        return projectMembers
            .filter(m => m.userId) // Only accepted users can be assigned tasks
            .map(m => {
                const label = m.username || m.name || "Unknown";
                return {
                    label: label,
                    value: m.userId,
                    image: m.profile?.avatar,
                    initials: label.charAt(0).toUpperCase()
                };
            });
    }, [projectMembers]);

    // Handlers
    const handleAssigneeChange = async (userId) => {
        if (!selectedTicket?._id) return;
        await dispatch(assignTaskApi(selectedTicket._id, userId));
        // No need to dispatch GET_TICKET_UPDATED_DETAILS as Redux state is updated locally by the action
    };
    const handleStatusChange = useCallback(async (statusData) => {
        if (!selectedTicket?._id) return;
        await dispatch(changeTicketStatus(selectedTicket._id, statusData?.newStatus));
        // No need to dispatch GET_TICKET_UPDATED_DETAILS for status as action already updates Redux locally
    }, [selectedTicket?._id, dispatch]);

    const handleAssignToMe = async () => {
        if (!selectedTicket?._id || !userDetails?.id) return;
        await dispatch(assignTaskApi(selectedTicket._id, userDetails.id));
        // Redux state updated locally
    };

    const handlePlacementChange = async (e) => {
        const targetId = e.target.value;
        if (!selectedTicket?._id) return;

        const isSprintSelected = sprints.some(s => s.id === targetId);
        const isBacklogSelected = projectBacklog?.some(b => b.id === targetId);

        let payload = {};
        if (isSprintSelected) {
            payload = { sprint: targetId, backlogId: null };
        } else if (isBacklogSelected) {
            payload = { backlogId: targetId, sprint: null };
        } else {
            payload = { sprint: null, backlogId: null };
        }

        try {
            await dispatch(updateTicket(selectedTicket._id, payload));
            dispatch({ type: GET_TICKET_UPDATED_DETAILS });
            dispatch({ type: SHOW_SNACKBAR, payload: { message: "Placement updated successfully", type: "success" } });
        } catch (err) {
            console.error('Failed to update ticket placement', err);
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

    const handleEtaUpdate = async () => {
        if (!selectedTicket?._id || !tempEta) return;
        try {
            await dispatch(updateTicket(selectedTicket._id, { eta: tempEta }));
            dispatch({ type: GET_TICKET_UPDATED_DETAILS });
            dispatch({ type: SHOW_SNACKBAR, payload: { message: `ETA updated to ${tempEta}`, type: "success" } });
            setIsEditingEta(false);
        } catch (err) {
            console.error("Error updating ETA", err);
        }
    };

    const handleTimeLogSubmit = async (e) => {
        e.preventDefault();
        let totalSeconds = convertInputToSeconds(timeLogged);
        if (!selectedTicket?._id || !userDetails?.id) return;

        await dispatch(addTimeLogForWork(selectedTicket._id, userDetails.id, totalSeconds, ""));
        setTimeLogPopup(false);
        setTimeLogged("");
        dispatch({ type: GET_TICKET_UPDATED_DETAILS }); // keep refresh for time logs to update totalLoggedTime
        dispatch({ type: SHOW_SNACKBAR, payload: { message: "Time logged successfully", type: "success" } });
    };

    const handleCreateBranchClick = () => {
        if (!selectedTicket?.projectId) return;
        
        // Use the flag from the ticket if available, otherwise fallback to check
        if (selectedTicket.isGithubConnected) {
            setGithubPopup(true);
        } else {
            setGithubErrorPopup(true);
        }
    };

    const handleBranchRedirect = () => {
        // const state = {
        //     ticketId: selectedTicket?._id,
        //     ticketTitle: selectedTicket?.title,
        //     ticketKey: selectedTicket?.ticketKey,
        //     projectId: selectedTicket?.projectId
        // };
        
        // Save state to session storage to retrieve in new tab if needed, 
        // or just use query params for simpler transport.
        const queryParams = new URLSearchParams({
            ticketId: selectedTicket?._id || '',
            ticketTitle: selectedTicket?.title || '',
            ticketKey: selectedTicket?.ticketKey || '',
            projectId: selectedTicket?.projectId || ''
        }).toString();

        window.open(`/create-branch?${queryParams}`, '_blank');
        setGithubPopup(false);
    };

    // label helper functions 

    if (isCollapsed) {
        return (
            <div className="sidebar_collapsed_strip" onClick={() => setIsCollapsed(false)}>
                <div className="expand_trigger">
                    <Minimize2 size={20} />
                </div>
                <div className="mini_stats">
                    <div className="stat_icon"><CheckCircle2 size={18} /></div>
                    <div className="stat_icon"><Clock size={18} /></div>
                </div>
            </div>
        );
    }


    const handleCopyTicketLink = () => {
        const ticketLink = `${window.location.origin}/tickets/${selectedTicket?._id}`;
        navigator.clipboard.writeText(ticketLink);
        dispatch({ type: SHOW_SNACKBAR, payload: { message: "Ticket link copied to clipboard", type: "success" } });
    };

    const handleCloneTicket = () => {
        if (!selectedTicket?._id || !task?._id) return;
        dispatch(cloneTicketActions(task._id?? selectedTicket._id, navigate));
        setIsMoreOptionOpen(false);
    };

    const handleBreakSubmit = async (e) => {
        e.preventDefault();
        const titles = newSubtaskTitles.split('\n').filter(t => t.trim() !== "");
        if (titles.length === 0 || !selectedTicket) return;

        for (const title of titles) {
            const subtaskData = {
                title: title.trim(),
                projectId: selectedTicket.projectId,
                type: selectedTicket.type || "TASK", // Fallback to parent type or TASK
                parentTicket: selectedTicket._id,
                assignee: "Unassigned",
                reporter: userDetails?.username,
                priority: selectedTicket.priority?.[0] || "MEDIUM"
            };
            await dispatch(createTicket(subtaskData));
        }

        setIsBreakPopupOpen(false);
        setNewSubtaskTitles("");
        dispatch({ type: SHOW_SNACKBAR, payload: { message: `Created ${titles.length} sub-tasks`, type: "success" } });
        // Refresh ticket details to show child count if we had that, 
        // but for now just show snackbar.
    };

    return (
        <div className="modern_sidebar_container">
            {/* Header / Top Bar */}
            <div className="sidebar_header">
                <div className="collapse_trigger" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {!isCollapsed ? <Minimize2 size={20} /> : <ChevronRight size={20} />}
                </div>
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
                        <button className="icon_action" onClick={handleCopyTicketLink}><LinkIcon size={16} /></button>
                        <div className="more_option_container">
                             <button className="icon_action" onClick={() => setIsMoreOptionOpen(!isMoreOptionOpen)}><MoreHorizontal size={16}/></button>
                        { isMoreOptionOpen &&    <div className="more_option_dropdown">
                                <p className="option_item" onClick={handleCloneTicket}>Clone Ticket</p>
                                <p className="option_item" onClick={() => { setIsBreakPopupOpen(true); setIsMoreOptionOpen(false); }}>Break into Sub-tasks</p>
                                <p className="option_item">Delete Ticket</p>
                                <p className="option_item">Move Ticket</p>
                                <p className="option_item">Convert To Sub-task</p>
                                <p className="option_item">Convert To Epic</p>
                             </div>}
                        </div>
                       

                    </div>
                </div>
                
            </div>

            <div className="sidebar_content">
                {/* User Section */}
                <section className="sidebar_section">
                    <div className="sidebar_parent_container" style={{ marginBottom: "16px" }}>
                   
                        
                        <div className="parent_display_row" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", minWidth: "50px" }}>
                                <Bookmark size={16} color="#65a30d" fill="#65a30d" style={{ opacity: 0.8 }} />
                                Parent</span>
                            
                            <div className="parent_selector_wrapper" style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                                <SimpleDivDropDown
                                    value={selectedTicket?.parentTicket}
                                    onChange={handleParentChange}
                                    options={parentOptions}
                                    placeholder="+ Add parent"
                                    className="sidebar-parent-dropdown-v3"
                                    searchable={true}
                                />
                            </div>
                        </div>
                    </div>
                    <h4 className="section_label">People</h4>
                    <div className="people_stack">
                        <div className="person_item">
                            <span className="small_label">Assignee</span>
                             <div className="person_column_layout">
                                <SimpleDivDropDown
                                   value={projectMembers?.find(m => 
                                        m.userId === selectedTicket?.assigneeId || 
                                        m._id === selectedTicket?.assigneeId ||
                                        m.username === selectedTicket?.assignee
                                   )?.userId}
                                   onChange={handleAssigneeChange}
                                   options={assigneeOptions}
                                   placeholder="Unassigned"
                                   className="sidebar-assignee-dropdown-v2"
                                />
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
                                    <div className="avatar_circle secondary">
                                        {selectedTicket?.reporterImage ? (
                                            <img src={selectedTicket.reporterImage} alt={selectedTicket.reporter} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            selectedTicket?.reporter?.[0] || 'R'
                                        )}
                                    </div>
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
                        <div className="dev_card branch" onClick={handleCreateBranchClick}>
                            <GitBranch size={16} />
                            <span>Create Branch</span>
                        </div>
                        {selectedTicket?.githubBranches && selectedTicket.githubBranches.length > 0 && (
                            <div className="dev_card branch_list_trigger" onClick={() => setShowBranchPanel(true)}>
                                <GitBranch size={16} />
                                <span>View {selectedTicket.githubBranches.length} Branch{selectedTicket.githubBranches.length > 1 ? 'es' : ''}</span>
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
                                <span>Ticket Placement</span>
                            </div>
                            <select 
                                className="modern_inline_select"
                                value={selectedTicket?.sprint || selectedTicket?.backlogId || ''}
                                onChange={handlePlacementChange}
                            >
                                <option value="">Unassigned (No Backlog/Sprint)</option>
                                <optgroup label="Sprints">
                                    {sprints.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} {s.status === 'active' ? '●' : ''}</option>
                                    ))}
                                </optgroup>
                                {projectBacklog && projectBacklog.length > 0 && (
                                    <optgroup label="Backlog Sections">
                                        {projectBacklog.map(b => (
                                            <option key={b.id} value={b.id}>{b.title}</option>
                                        ))}
                                    </optgroup>
                                )}
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
                                        dataTypes={projectsPriorities?.map((_ele) => _ele.name)} // array of label names
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
                        <div className="planning_item">
                            <div className="item_header">
                                <Calendar size={14} />
                                <span>ETA</span>
                            </div>
                            <div className="sp_input_wrapper">
                                <input 
                                    type="date" 
                                    className="modern_inline_input"
                                    value={isEditingEta ? tempEta : (selectedTicket?.eta ? new Date(selectedTicket.eta).toISOString().split('T')[0] : "")}
                                    onChange={(e) => setTempEta(e.target.value)}
                                    onFocus={() => {
                                        setTempEta(selectedTicket?.eta ? new Date(selectedTicket.eta).toISOString().split('T')[0] : "");
                                        setIsEditingEta(true);
                                    }}
                                />
                                {isEditingEta && (
                                    <div className="sp_actions">
                                        <ButtonUD text="Update" onClick={handleEtaUpdate} />
                                        <ButtonUD text="Cancel" onClick={() => setIsEditingEta(false)} />
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
            {isBreakPopupOpen && (
                <PopupV1 title="Break Ticket into Sub-tasks" onClose={() => setIsBreakPopupOpen(false)}>
                    <form onSubmit={handleBreakSubmit} className="modern_popup_form">
                        <div className="input_group">
                            <label>Sub-task Titles (One per line)</label>
                            <textarea 
                                value={newSubtaskTitles}
                                onChange={(e) => setNewSubtaskTitles(e.target.value)}
                                placeholder="Design UI&#10;Implement API&#10;Write Tests"
                                style={{ width: '100%', minHeight: '120px', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'inherit' }}
                                autoFocus
                            />
                        </div>
                        <p className="hint_text" style={{ marginTop: '8px' }}>Enter titles separated by new lines to create multiple sub-tasks at once.</p>
                        <ButtonV1 type="primary" style={{ width: '100%', marginTop: '1rem' }} disabled={!newSubtaskTitles.trim()}>
                            Create Sub-tasks
                        </ButtonV1>
                    </form>
                </PopupV1>
            )}

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
                <PopupV1 title="Source Control Intelligence" onClose={() => setGithubPopup(false)}>
                    <div className="modern_popup_content info">
                        <div className="icon_circle">
                            <Zap size={32} className="popup_hero_icon" />
                        </div>
                        <h3>Synchronize Workflow</h3>
                        <p>We're ready to create a dedicated development branch. This will link your commits directly to <strong>{selectedTicket?.ticketKey}</strong>.</p>
                        
                        <div className="feature_list_mini">
                            <div className="feature_item_mini">
                                <GitBranch size={14} /> <span>Automatic branch naming</span>
                            </div>
                            <div className="feature_item_mini">
                                <Terminal size={14} /> <span>Bi-directional sync active</span>
                            </div>
                        </div>

                        <div className="popup_actions">
                            <ButtonV1 type="primary" onClick={handleBranchRedirect} style={{ width: '100%' }}>
                                Initialize Branch
                            </ButtonV1>
                            <ButtonV1 type="secondary" onClick={() => setGithubPopup(false)} style={{ width: '100%' }}>
                                I'll do it later
                            </ButtonV1>
                        </div>
                    </div>
                </PopupV1>
            )}

            {githubErrorPopup && (
                <PopupV1 title="Configuration Required" onClose={() => setGithubErrorPopup(false)}>
                    <div className="modern_popup_content error">
                        <div className="icon_circle_error">
                            <AlertCircle size={32} className="popup_hero_icon" />
                        </div>
                        <h3>GitHub Not Linked</h3>
                        <p>This project is currently running in "Offline Mode". Connect GitHub to enable automated branching and PR tracking.</p>
                        
                        <div className="popup_actions">
                            {(userDetails?.role === 'admin' || userDetails?.accessType >= 300) ? (
                                <ButtonV1 type="primary" onClick={() => navigate('/admin/github-config', { state: { projectId: selectedTicket?.projectId } })} style={{ width: '100%' }}>
                                    Link Repository Now
                                </ButtonV1>
                            ) : (
                                <div className="admin_notice">
                                    <Lock size={14} />
                                    <span>Administrator access required to link GitHub environments.</span>
                                </div>
                            )}
                            <ButtonV1 type="secondary" onClick={() => setGithubErrorPopup(false)} style={{ width: '100%' }}>
                                Continue without GitHub
                            </ButtonV1>
                        </div>
                    </div>
                </PopupV1>
            )}

            {/* Branch Side Panel */}
          

            <SidePanel 
    isOpen={showBranchPanel} 
    onClose={() => setShowBranchPanel(false)}
    width="450px"
>
    <div className="repo-panel">
        <div className="repo-panel__header">
            <div className="repo-panel__title">
                <GitBranch size={22} />
                <div className="title-text">
                    <h3>Ticket Branches Details</h3>
                    <span className="subtitle">GitHub Integration</span>
                </div>
            </div>
            <button 
                className="repo-panel__close" 
                onClick={() => setShowBranchPanel(false)}
                aria-label="Close panel"
            >
                <ChevronRight size={20} />
            </button>
        </div>

        <div className="repo-panel__body">
            {selectedTicket?.githubBranches?.length > 0 ? (
                <>
                    {/* Repository Info Summary */}
                    <div className="repo-summary">
                        <div className="repo-summary__stat">
                            <GitBranch size={16} />
                            <span className="stat-value">{selectedTicket.githubBranches.length}</span>
                            <span className="stat-label">Branches</span>
                        </div>
                        <div className="repo-summary__stat">
                            <GitPullRequest size={16} />
                            <span className="stat-value">
                                {selectedTicket.githubBranches.filter(b => b.status === 'merged').length}
                            </span>
                            <span className="stat-label">Merged</span>
                        </div>
                        <div className="repo-summary__stat">
                            <Activity size={16} />
                            <span className="stat-value">
                                {selectedTicket.githubBranches.filter(b => b.status === 'active').length}
                            </span>
                            <span className="stat-label">Active</span>
                        </div>
                    </div>

                    {/* Branch List */}
                    <div className="branch-list">
                        <div className="branch-list__header">
                            <h4>Branches</h4>
                            <button className="btn-create-branch" onClick={handleCreateBranchClick}>
                                <Plus size={16} />
                                New Branch
                            </button>
                        </div>

                        {selectedTicket.githubBranches.map((branch, idx) => (
                            <div key={idx} className="branch-card">
                                <div className="branch-card__header">
                                    <div className="branch-name-wrapper">
                                        <GitBranch size={16} className="branch-icon" />
                                        <span className="branch-name" title={branch.name}>
                                            {branch.name}
                                        </span>
                                    </div>
                                    <span className={`branch-status branch-status--${branch.status?.toLowerCase()}`}>
                                        {branch.status === 'merged' && <GitMerge size={12} />}
                                        {branch.status === 'active' && <Circle size={12} />}
                                        {branch.status === 'closed' && <XCircle size={12} />}
                                        {branch.status}
                                    </span>
                                </div>

                                <div className="branch-card__meta">
                                    <div className="meta-item">
                                        <User size={12} />
                                        <span>{branch.createdBy || 'System'}</span>
                                    </div>
                                    <div className="meta-divider">•</div>
                                    <div className="meta-item">
                                        <Clock size={12} />
                                        <span>{new Date(branch.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {branch.commits && (
                                    <div className="branch-card__commits">
                                        <GitCommit size={12} />
                                        <span>{branch.commits} commits</span>
                                    </div>
                                )}

                                <div className="branch-card__actions">
                                    <a 
                                        href={branch.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn-github"
                                    >
                                        <ExternalLink size={14} />
                                        View on GitHub
                                    </a>
                                    {/* {branch.status === 'active' && (
                                        <button className="btn-pr" onClick={() => handleCreatePR(branch)}>
                                            <GitPullRequest size={14} />
                                            Create PR
                                        </button>
                                    )} */}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="repo-empty-state">
                    <div className="empty-state-icon">
                        <GitBranch size={48} />
                    </div>
                    <h4 className="empty-state-title">No Repository Connected</h4>
                    <p className="empty-state-description">
                        Connect this task to a GitHub repository to track branches, commits, and pull requests.
                    </p>
                    <div className="empty-state-actions">
                        <ButtonV1 
                            type="primary" 
                            onClick={() => { 
                                setShowBranchPanel(false); 
                                handleCreateBranchClick(); 
                            }}
                        >
                            <PlusIcon size={16} />
                            Create First Branch
                        </ButtonV1>
                        {/* <ButtonV1 
                            type="secondary" 
                            onClick={handleLinkRepository}
                        >
                            <Link size={16} />
                            Link Repository
                        </ButtonV1> */}
                    </div>
                </div>
            )}
        </div>
    </div>
</SidePanel>
        </div>
    );
};

export default IssueDetails;

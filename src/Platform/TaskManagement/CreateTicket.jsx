import React, { useState, useEffect } from "react";
import { X, Plus, Calendar, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createTicket, getAllWorkTicket } from "../../Redux/Actions/TicketActions/ticketAction";
import { getAllProjects, ticketConfiguratorActionV1 } from "../../Redux/Actions/PlatformActions.js/projectsActions";
import { useParams } from "react-router-dom";
import { OPEN_CREATE_TICKET_POPUP } from "../../Redux/Constants/ticketReducerConstants";
import { SHOW_SNACKBAR } from "../../Redux/Constants/PlatformConstatnt/platformConstant";
import { PROJECT_CONFIG_FETCH_SUCESS } from "../../Redux/Constants/projectConstant";
import "./styles/createTicket.scss";
import { CustomDropDownV3 } from "../../customFiles/customComponent/DropDown";
import { getProjectTeamMembers } from "../../Redux/Actions/PlatformActions.js/userActions";
import { fetchProjectScrumFlow } from "../../Redux/Actions/SprintActions/sprintActionsV1";
import TextEditor from "../Editor";
const CreateTicket = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  const { projects, projectConventions, projectsPriorities ,projectlabels} = useSelector((state) => state.projects || {});
  const {ticketFlowTypes} = useSelector((state) => state.sprint || {});
  const { projectId: projectIdParam } = useParams();
  const {projectTeamMembers} = useSelector((state) => state.user || {});
  const [ticketData, setTicketData] = useState({
    title: "",
    type: null,
    priority: null,
    status: null,
    assignee: null,
    storyPoints: 0,
    dueDate: "",
    labels: [],
    description: "",
    projectId: null,
  });


  // Load projects on mount
  useEffect(() => {
    if (userDetails?.id) {
      dispatch(getAllProjects(userDetails.id));
    }
    return () => {
      const controller = new AbortController();
      controller.abort();
    };
  }, [dispatch, userDetails?.id]);

  // useEffect(() => {
  //   if (projectlabels?.length > 0 && ticketData.labels.length === 0) {
  //     setTicketData((prev) => ({ ...prev, labels: [projectlabels[0].id] }));
  //     console.log(projectlabels[0].id)
  //   }
  // }, [projectlabels, ticketData.labels]);

  // Auto-select project from URL param
  useEffect(() => {
    if (projectIdParam && Array.isArray(projects) && projects.length > 0) {
      const matched = projects.find(
        (p) => String(p._id) === String(projectIdParam) || String(p.projectId) === String(projectIdParam)
      );
      if (matched) {
        const projectId = matched.projectId || matched._id;
        setTicketData((prev) => ({ ...prev, projectId }));
        dispatch(ticketConfiguratorActionV1(projectId));
      }
    }
  }, [projectIdParam, projects, dispatch]);

  // Auto-select first priority/type when they load
  useEffect(() => {
    if (projectsPriorities?.length > 0 && !ticketData.priority) {
      setTicketData((prev) => ({ ...prev, priority: projectsPriorities[0].id }));
    }
  }, [projectsPriorities, ticketData.priority]);

  useEffect(() => {
    if (projectConventions?.length > 0 && !ticketData.type) {
      setTicketData((prev) => ({ ...prev, type: projectConventions[0].id }));
    }
  }, [projectConventions, ticketData.type]);

  const handleChange = (field, value) => {
    setTicketData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProjectChange = (projectId) => {
    handleChange("projectId", projectId);
    dispatch(ticketConfiguratorActionV1(projectId));
    dispatch(getProjectTeamMembers(projectId));
    dispatch(fetchProjectScrumFlow(projectId));
    // Reset dependent fields
    setTicketData((prev) => ({ ...prev, type: null, priority: null }));
  };



  const handleCreateTicket = () => {
    if (!ticketData.title || !ticketData.projectId) {
      return dispatch({
        type: SHOW_SNACKBAR,
        payload: { message: "Please fill in required fields", type: "error" },
      });
    }
    dispatch(createTicket(ticketData, userDetails?.id));
    dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: false });
    dispatch({
      type: SHOW_SNACKBAR,
      payload: { message: `Successfully created ticket "${ticketData.title}"`, type: "success" },
    });
    dispatch(getAllWorkTicket());
  };

  const handleClose = () => {
    dispatch({ type: OPEN_CREATE_TICKET_POPUP, payload: false });
    dispatch({ type: PROJECT_CONFIG_FETCH_SUCESS, payload: null });
  };

  const hasProject = !!ticketData.projectId;

  // Prepare dropdown options
  const projectOptions = Array.isArray(projects)
    ? projects.map((p) => ({
        label: p.name || p.projectName || "Unknown Project",
        value: p.projectId || p._id,
      }))
    : [];

  const typeOptions = (projectConventions || []).map((c) => ({
    label: c.suffix,
    value: c.id,
  }));

  const priorityOptions = (projectsPriorities || []).map((p) => ({
    label: p.name,
    value: p.id,
    icon: p.name === "Medium" ? "—" : null,
    color: p.name === "Medium" ? "#f59e0b" : null,
  }));
  // ========================== Mapping ticketFlowTypes to statusOptions =========================
  const statusOptions = ticketFlowTypes?.map((s) => ({
    label: s,
    value: s,
  }));
  // ========================== Mapping ticketFlowTypes to statusOptions =========================

  const assigneeOptions = [
    { label: "Unassigned", value: null },
    ...(Array.isArray(projectTeamMembers)
      ? projectTeamMembers.map((m) => ({
          label: m.name || m.username || "Unknown",
          value: m.id || m._id,
          image: m.image || "",
          initials: (m.name || m.username || "U")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
        }))
      : []),
  ];

  const labelOptions = (projectlabels || []).map((l) => ({
    label: l.name,
    value: l.id,
  }));
  console.log(ticketFlowTypes)
  return (
    <div className="ct-overlay" onClick={handleClose}>
      <div className="ct-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ct-header">
          <div className="ct-header__text">
            <h2 className="ct-header__title">Create New Ticket</h2>
            <p className="ct-header__subtitle">
              Fill in the details below to create a new ticket for your project.
            </p>
          </div>
          <button className="ct-header__close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="ct-body">
          {/* Project Selector */}
          {!hasProject && (
            <div className="ct-helper">
              <div className="ct-helper__icon">ℹ️</div>
              <p className="ct-helper__text">
                Please select a project first to configure ticket type and priority options.
              </p>
            </div>
          )}

          <div className="ct-field">
            <label className="ct-label">Project</label>
            <CustomDropDownV3
              value={ticketData.projectId}
              onChange={handleProjectChange}
              options={projectOptions}
              placeholder="Select project"
              disabled={false}
              searchable={true}
            />
          </div>

          {/* Title */}
          <div className="ct-field">
            <label className="ct-label">
              Title <span className="ct-required">*</span>
            </label>
            <input
              type="text"
              className="ct-input"
              placeholder="Enter ticket title"
              value={ticketData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="ct-field">
            <label className="ct-label">Description</label>
            {/* <textarea
              className="ct-textarea"
              placeholder="Describe the ticket in detail..."
              value={ticketData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            /> */}
          <TextEditor initialData={ticketData.description} onSave={(data) => handleChange("description", data)} style={{height:"130px" ,border:"0.5px solid #ccc"}}/>

          </div>

          {/* Type + Priority */}
          <div className="ct-row">
            <div className="ct-field">
              <label className="ct-label">Type</label>
              <CustomDropDownV3
                value={ticketData.type}
                onChange={(val) => handleChange("type", val)}
                options={typeOptions}
                placeholder="Select type"
                disabled={!hasProject || !projectConventions?.length}
                searchable={true}

              />
            </div>

            <div className="ct-field">
              <label className="ct-label">Priority</label>
              <CustomDropDownV3
                value={ticketData.priority}
                onChange={(val) => handleChange("priority", val)}
                options={priorityOptions}
                placeholder="Select priority"
                disabled={!hasProject || !projectsPriorities?.length}
                showIcon={true}
                searchable={true}

              />
            </div>
          </div>

          {/* Status + Assignee */}
          <div className="ct-row">
            <div className="ct-field">
              <label className="ct-label">Status</label>
              <CustomDropDownV3
                value={ticketData.status}
                onChange={(val) => handleChange("status", val)}
                options={statusOptions}
                placeholder="Select status"
                disabled={!hasProject}
                searchable={true}

              />
            </div>

            <div className="ct-field">
              <label className="ct-label">Assignee</label>
              <CustomDropDownV3
              value={ticketData.assignee}
              onChange={(val) => handleChange("assignee", val)}
              options={assigneeOptions}
              placeholder="Unassigned"
              disabled={!hasProject}
              searchable={true}
              showIcon={true}
            />
            </div>
          </div>

          {/* Story Points (full width) */}
          <div className="ct-field">
            <label className="ct-label">Story Points</label>
            <input
              type="number"
              className="ct-input ct-input--number"
              value={ticketData.storyPoints}
              onChange={(e) => handleChange("storyPoints", Number(e.target.value))}
              min="0"
              disabled={!hasProject}
            />
          </div>

          {/* Due Date */}
          <div className="ct-field">
            <label className="ct-label">Due Date</label>
            <div className="ct-date">
              <input
                type="date"
                className="ct-input"
                value={ticketData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                disabled={!hasProject}
              />
              <Calendar size={16} className="ct-date__icon" />
            </div>
          </div>

          {/* Labels */}
          <div className="ct-field">
            <label className="ct-label">Labels</label>
            <CustomDropDownV3
              value={ticketData.labels}
              onChange={(val) => handleChange("labels", val)}
              options={labelOptions}
              placeholder="Select labels"
              disabled={!hasProject}
              searchable={true}
              showIcon={true}
            />

            {/* <div className="ct-labels">
              <input
                type="text"
                className="ct-labels__input"
                placeholder="Add a label..."
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLabel(labelInput);
                  }
                }}
                disabled={!hasProject}
              />
              <button
                className="ct-labels__add"
                onClick={() => handleAddLabel(labelInput)}
                disabled={!hasProject || !labelInput}
              >
                <Plus size={16} />
              </button>
            </div> */}

            {/* Available label pills */}
            

          </div>
        </div>

        {/* Footer */}
        <div className="ct-footer">
          <button className="ct-btn ct-btn--cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="ct-btn ct-btn--primary" onClick={handleCreateTicket}>
            Create Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
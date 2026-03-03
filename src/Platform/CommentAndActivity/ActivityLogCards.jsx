// import React from 'react'
// import {
//   MessageSquare,
//   Activity,
//   Send,
//   Bold,
//   Italic,
//   List,
//   Link,
//   Clock,
//   User,
//   Tag,
//   CheckCircle,
//   AlertCircle
// } from 'lucide-react';
// import { formatCreatedAtDate } from '../../utillity/helper';
// const ActivityLogCards = ({activity}) => {

//     console.log(activity)

// const RenderLogs = (activity,type)=>{

//     switch(type){

//         case "ADD_TIME_LOG" :
//             {
//                 return (
//                       <>
                      
//                         <div
//                     className="activity-icon"
//                     style={{
//                       backgroundColor:"white",
//                       color:'rebeccapurple'
//                     }}
//                   >
//                     <Clock size={23}/>
//                   </div>
//                            <div className="activity-content">
//                     <div className="activity-header">
//                       <div className="avatar-small">{activity?.performedBy?.name[0]}</div>
//                       <span className="user">{activity?.performedBy?.name}</span>
//                       <span className="action">{activity?.actionType}</span>
//                     </div>
//                       <span
//                           className="action"
//                           style={{
//                             background: `${activity.color}15`,
//                             color: activity.color
//                           }}
//                         >
//                           {activity?.performedBy?.name} added the time log of {activity?.changes?.newValue} minutes
//                         </span>
//                     <div className="activity-time">
                        
//                       <Clock size={12} />
//                       <span>{formatCreatedAtDate(activity?.createdAt)}</span>
//                     </div>
//                   </div></>
                    
//                 )
//             }
//         case "TICKET_TRANSITION" :
//             {
//                 return (
//                       <>
                      
//                         <div
//                     className="activity-icon"
//                     style={{
//                       backgroundColor:"white",
//                       color:'rebeccapurple'
//                     }}
//                   >
//                     <Clock size={23}/>
//                   </div>
//                            <div className="activity-content">
//                     <div className="activity-header">
//                       <div className="avatar-small">{activity?.performedBy?.name[0]}</div>
//                       <span className="user">{activity?.performedBy?.name}</span>
//                       <span className="action">{activity?.actionType}</span>

//                       {/* {activity.from && (
//                         <>
//                           <span className="status-badge">{activity.from}</span>
//                           <span className="action">to</span>
//                           <span
//                             className="status-badge"
//                             style={{
//                               background: `${activity.color}15`,
//                               color: activity.color
//                             }}
//                           >
//                             {activity.to}
//                           </span>
//                         </>
//                       )} */}
//                       {/* {activity.assignee && (
//                         <span className="user">{activity.assignee}</span>
//                       )}
//                       {activity.tag && (
//                         <span
//                           className="status-badge"
//                           style={{
//                             background: `${activity.color}15`,
//                             color: activity.color
//                           }}
//                         >
//                           {activity.tag}
//                         </span>
//                       )} */}
                        
//                     </div>
//                       <span
//                           className="action"
//                           style={{
//                             background: `${activity.color}15`,
//                             color: activity.color
//                           }}
//                         >
//                           {activity?.performedBy?.name} changed the ticket status from {activity?.changes?.prevValue} {"->" } {activity?.changes?.newValue}
//                         </span>
//                     <div className="activity-time">
                        
//                       <Clock size={12} />
//                       <span>{formatCreatedAtDate(activity?.createdAt)}</span>
//                     </div>
//                   </div></>
                    
//                 )
//             }
//         case "TICKET_ASSIGN" :
//             {
//                 return (
//                       <>
                      
//                         <div
//                     className="activity-icon"
//                     style={{
//                       backgroundColor:"white",
//                       color:'rebeccapurple'
//                     }}
//                   >
//                     <Clock size={23}/>
//                   </div>
//                            <div className="activity-content">
//                     <div className="activity-header">
//                       <div className="avatar-small">{activity?.performedBy?.name[0]}</div>
//                       <span className="user">{activity?.performedBy?.name}</span>
//                       <span className="action">{activity?.actionType}</span>
//                     </div>
//                       <span
//                           className="action"
//                           style={{
//                             background: `${activity.color}15`,
//                             color: activity.color
//                           }}
//                         >
//                           {activity?.performedBy?.name} has assigned himself to the ticket : {activity?.changes?.newValue}
//                         </span>
//                     <div className="activity-time">
                        
//                       <Clock size={12} />
//                       <span>{formatCreatedAtDate(activity?.createdAt)}</span>
//                     </div>
//                   </div></>
                    
//                 )
//             }
//         case "TICKET_UPDATE" :
//             {
//                 return (
//                       <>
                      
//                         <div
//                     className="activity-icon"
//                     style={{
//                       backgroundColor:"white",
//                       color:'rebeccapurple'
//                     }}
//                   >
//                     <Clock size={23}/>
//                   </div>
//                            <div className="activity-content">
//                     <div className="activity-header">
//                       <div className="avatar-small">{activity?.performedBy?.name[0]}</div>
//                       <span className="user">{activity?.performedBy?.name}</span>
//                       <span className="action">{activity?.actionType}</span>
//                     </div>
//                       <span
//                           className="action"
//                           style={{
//                             background: `${activity.color}15`,
//                             color: activity.color
//                           }}
//                         >
//                           {activity?.performedBy?.name} updated the ticket : {activity?.changes?.newValue}
//                         </span>
//                     <div className="activity-time">
                        
//                       <Clock size={12} />
//                       <span>{formatCreatedAtDate(activity?.createdAt)}</span>
//                     </div>
//                   </div></>
                    
//                 )
//             }
//         case "TICKET_CREATE" :
//             {
//                 return (
//                       <>
                      
//                         <div
//                     className="activity-icon"
//                     style={{
//                       backgroundColor:"white",
//                       color:'rebeccapurple'
//                     }}
//                   >
//                     <Clock size={23}/>
//                   </div>
//                            <div className="activity-content">
//                     <div className="activity-header">
//                       <div className="avatar-small">{activity?.performedBy?.name[0]}</div>
//                       <span className="user">{activity?.performedBy?.name}</span>
//                       <span className="action">{activity?.actionType}</span>
//                     </div>
//                       <span
//                           className="action"
//                           style={{
//                             background: `${activity.color}15`,
//                             color: activity.color
//                           }}
//                         >
//                           {activity?.performedBy?.name} created the task : {activity?.changes?.newValue}
//                         </span>
//                     <div className="activity-time">
                        
//                       <Clock size={12} />
//                       <span>{formatCreatedAtDate(activity?.createdAt)}</span>
//                     </div>
//                   </div></>
                    
//                 )
//             }
//         case "TICKET_STORYPOINT" :
//             {
//                 return (
//                       <>
                      
//                         <div
//                     className="activity-icon"
//                     style={{
//                       backgroundColor:"white",
//                       color:'rebeccapurple'
//                     }}
//                   >
//                     <Clock size={23}/>
//                   </div>
//                            <div className="activity-content">
//                     <div className="activity-header">
//                       <div className="avatar-small">{activity?.performedBy?.name[0]}</div>
//                       <span className="user">{activity?.performedBy?.name}</span>
//                       <span className="action">{activity?.actionType}</span>
//                     </div>
//                       <span
//                           className="action"
//                           style={{
//                             background: `${activity.color}15`,
//                             color: activity.color
//                           }}
//                         >
//                           {activity?.performedBy?.name} added story point {activity?.changes?.newValue} to the ticket :
//                         </span>
//                     <div className="activity-time">
                        
//                       <Clock size={12} />
//                       <span>{formatCreatedAtDate(activity?.createdAt)}</span>
//                     </div>
//                   </div></>
                    
//                 )
//             }
//         case "TICKET_UNASSIGN" :
//             {
//                 return (
//                       <>
                      
//                         <div
//                     className="activity-icon"
//                     style={{
//                       backgroundColor:"white",
//                       color:'rebeccapurple'
//                     }}
//                   >
//                     <Clock size={23}/>
//                   </div>
//                            <div className="activity-content">
//                     <div className="activity-header">
//                       <div className="avatar-small">{activity?.performedBy?.name[0]}</div>
//                       <span className="user">{activity?.performedBy?.name}</span>
//                       <span className="action">{activity?.actionType}</span>
//                     </div>
//                       <span
//                           className="action"
//                           style={{
//                             background: `${activity.color}15`,
//                             color: activity.color
//                           }}
//                         >
//                           {activity?.performedBy?.name} change the assignee of ticket from {activity?.changes?.prevValue} to {activity?.changes?.newValue} :
//                         </span>
//                     <div className="activity-time">
                        
//                       <Clock size={12} />
//                       <span>{formatCreatedAtDate(activity?.createdAt)}</span>
//                     </div>
//                   </div></>
                    
//                 )
//             }
//         case "SPRINT_UPDATE" :
//             {
//                 return (
//                       <>
                      
//                         <div
//                     className="activity-icon"
//                     style={{
//                       backgroundColor:"white",
//                       color:'rebeccapurple'
//                     }}
//                   >
//                     <Clock size={23}/>
//                   </div>
//                            <div className="activity-content">
//                     <div className="activity-header">
//                       <div className="avatar-small">{activity?.performedBy?.name[0]}</div>
//                       <span className="user">{activity?.performedBy?.name}</span>
//                       <span className="action">{activity?.actionType}</span>
//                     </div>
//                       <span
//                           className="action"
//                           style={{
//                             background: `${activity.color}15`,
//                             color: activity.color
//                           }}
//                         >
//                           {activity?.performedBy?.name} changed the sprint to {activity?.changes?.newValue} :
//                         </span>
//                     <div className="activity-time">
                        
//                       <Clock size={12} />
//                       <span>{formatCreatedAtDate(activity?.createdAt)}</span>
//                     </div>
//                   </div></>
                    
//                 )
//             }

//     }


// }

//   return (
//     <div> <div key={activity.id} className="activity-item">
              
               

//                   {RenderLogs(activity,activity.actionType)}
//                 </div></div>
//   )
// }

// export default ActivityLogCards


import React from 'react';
import {
  Clock,
  User,
  Trash2,
  CheckCircle,
  XCircle,
  GitBranch,
  FileText,
  UserPlus,
  UserMinus,
  Flag,
  Mail,
  Phone,
  Shield
} from 'lucide-react';
import { formatCreatedAtDate } from '../../utillity/helper';
import './style/ActivityLogCards.scss';

const ActivityLogCards = ({ activity }) => {
  // Get icon based on action type
  const getActionIcon = (actionType) => {
    const iconMap = {
      'ADD_TIME_LOG': Clock,
      'TICKET_TRANSITION': GitBranch,
      'TICKET_ASSIGN': UserPlus,
      'TICKET_UNASSIGN': UserMinus,
      'TICKET_UPDATE': FileText,
      'TICKET_CREATE': FileText,
      'TICKET_STORYPOINT': Flag,
      'SPRINT_UPDATE': GitBranch,
      'DELETE_PROCESS': Trash2,
      'PASSWORD_CHANGE': Shield,
      'ACCOUNT_ACCESS': User,
    };
    return iconMap[actionType] || FileText;
  };

  // Get icon color based on action type
  const getActionColor = (actionType) => {
    const colorMap = {
      'ADD_TIME_LOG': '#6366f1',      // blue
      'TICKET_TRANSITION': '#10b981',  // green
      'TICKET_ASSIGN': '#3b82f6',      // blue
      'TICKET_UNASSIGN': '#f59e0b',    // amber
      'TICKET_UPDATE': '#8b5cf6',      // purple
      'TICKET_CREATE': '#10b981',      // green
      'TICKET_STORYPOINT': '#f59e0b',  // amber
      'SPRINT_UPDATE': '#6366f1',      // blue
      'DELETE_PROCESS': '#ef4444',     // red
      'PASSWORD_CHANGE': '#3b82f6',    // blue
      'ACCOUNT_ACCESS': '#6366f1',     // blue
    };
    return colorMap[actionType] || '#6b7280';
  };

  // Get message for each action type
  const getMessage = (activity) => {
    const { actionType, performedBy, changes } = activity;
    const name = performedBy?.name || 'User';

    switch (actionType) {
      case 'ADD_TIME_LOG':
        return `${name} logged ${changes?.newValue || 0} minutes`;
      
      case 'TICKET_TRANSITION':
        return `${name} changed status from "${changes?.prevValue || 'None'}" to "${changes?.newValue}"`;
      
      case 'TICKET_ASSIGN':
        if (!changes?.prevValue || changes?.prevValue === '') {
          return `${name} assigned themselves to this ticket`;
        }
        return `${name} assigned this ticket`;
      
      case 'TICKET_UNASSIGN':
        return `${name} changed assignee from "${changes?.prevValue}" to "${changes?.newValue}"`;
      
      case 'TICKET_UPDATE':
        return `${name} updated the ticket`;
      
      case 'TICKET_CREATE':
        return `${name} created ticket "${changes?.newValue}"`;
      
      case 'TICKET_STORYPOINT':
        if (changes?.prevValue === null || changes?.prevValue === undefined) {
          return `${name} set story points to ${changes?.newValue}`;
        }
        return `${name} changed story points from ${changes?.prevValue} to ${changes?.newValue}`;
      
      case 'SPRINT_UPDATE':
        return `${name} moved ticket to sprint "${changes?.newValue}"`;
      
      default:
        return `${name} performed ${actionType.replace(/_/g, ' ').toLowerCase()}`;
    }
  };

  // Get formatted action label
  const getActionLabel = (actionType) => {
    const labelMap = {
      'ADD_TIME_LOG': 'Time Log Added',
      'TICKET_TRANSITION': 'Status Changed',
      'TICKET_ASSIGN': 'Ticket Assigned',
      'TICKET_UNASSIGN': 'Assignee Changed',
      'TICKET_UPDATE': 'Ticket Updated',
      'TICKET_CREATE': 'Ticket Created',
      'TICKET_STORYPOINT': 'Story Points Added',
      'SPRINT_UPDATE': 'Sprint Changed',
      'DELETE_PROCESS': 'Delete Process',
      'PASSWORD_CHANGE': 'Password Change',
      'ACCOUNT_ACCESS': 'Account Access',
    };
    return labelMap[actionType] || actionType.replace(/_/g, ' ');
  };

  const Icon = getActionIcon(activity.actionType);
  const iconColor = getActionColor(activity.actionType);
  const message = getMessage(activity);
  const actionLabel = getActionLabel(activity.actionType);
  
  // Format date (use the helper or create inline)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours() % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';
    return `${month}-${day}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const formattedDate = formatDate(activity.createdAt);

  return (
    <div className="activity-log">
      {/* Timeline line (rendered by parent container) */}
      
      {/* Left: Timestamp */}
      <div className="activity-log__timestamp">
        {formattedDate}
      </div>

      {/* Center: Icon */}
      <div className="activity-log__icon-wrapper">
        <div 
          className="activity-log__icon" 
          style={{ backgroundColor: iconColor }}
        >
          <Icon size={18} />
        </div>
      </div>

      {/* Right: Content */}
      <div className="activity-log__content">
        <h4 className="activity-log__title">{actionLabel}</h4>
        
        {/* Main event message */}
        <div className="activity-log__event">
          <div className="activity-log__event-indicator" />
          <div className="activity-log__event-text">
            {message}
          </div>
        </div>

        {/* Sub-events (if any) */}
        {activity.subEvents && activity.subEvents.length > 0 && (
          <div className="activity-log__sub-events">
            {activity.subEvents.map((subEvent, idx) => (
              <div 
                key={idx} 
                className={`activity-log__sub-event activity-log__sub-event--${subEvent.status}`}
              >
                <div className="activity-log__sub-timestamp">
                  {formatCreatedAtDate(subEvent.createdAt)}
                </div>
                <div className="activity-log__sub-dot">
                  {subEvent.status === 'success' ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                </div>
                <div className="activity-log__sub-text">
                  {subEvent.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogCards;
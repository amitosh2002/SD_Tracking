import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Settings,
  Search,
  Filter,
  Tag,
  BarChart3,
  ChevronDown,
  Ticket,
  MessageSquare,
  Users,
  Settings2,
  MonitorCheckIcon,
  MailCheckIcon,
} from "lucide-react";
import "./styles/Notifications.scss";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotifications, getNotificationAnalytics, markAsReadNotification } from "../../../Redux/Actions/NotificationActions/inAppNotificationAction";
import { formatNotificationTime } from "../../../utillity/helper";
import NotificationAnalytics from "./notficationAnalytics";

// Sample notification data
const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    type: "ticket",
    icon: "ticket",
    iconColor: "#6366f1",
    title: "New Ticket Assigned",
    description: "You have been assigned to ticket #1234 - Website Redesign",
    category: "Ticket",
    time: "5 minutes ago",
    status: "unread",
  },
  {
    id: 2,
    type: "message",
    icon: "message",
    iconColor: "#10b981",
    title: "New Message",
    description: "Sarah Johnson sent you a message in the Website Redesign project",
    category: "Message",
    time: "1 hour ago",
    status: "unread",
  },
  {
    id: 3,
    type: "team",
    icon: "team",
    iconColor: "#8b5cf6",
    title: "Team Update",
    description: "New team member John Smith has joined the project",
    category: "Team",
    time: "2 hours ago",
    status: "read",
  },
  {
    id: 4,
    type: "ticket",
    icon: "ticket",
    iconColor: "#6366f1",
    title: "Ticket Status Update",
    description: "Ticket #1235 - Bug Fix has been marked as completed",
    category: "Ticket",
    time: "3 hours ago",
    status: "read",
  },
  {
    id: 5,
    type: "message",
    icon: "message",
    iconColor: "#10b981",
    title: "New Message",
    description: "Michael Brown mentioned you in a comment on ticket #1236",
    category: "Message",
    time: "5 hours ago",
    status: "read",
  },
  {
    id: 6,
    type: "team",
    icon: "team",
    iconColor: "#8b5cf6",
    title: "Team Update",
    description: "Project deadline has been updated to June 15, 2024",
    category: "Team",
    time: "1 day ago",
    status: "read",
  },
  {
    id: 7,
    type: "ticket",
    icon: "ticket",
    iconColor: "#6366f1",
    title: "New Ticket Created",
    description: "A new ticket has been created: #1237 - API Integration",
    category: "Ticket",
    time: "1 day ago",
    status: "read",
  },
  {
    id: 8,
    type: "message",
    icon: "message",
    iconColor: "#10b981",
    title: "New Message",
    description: "Emily Davis shared a document in the Website Redesign project",
    category: "Message",
    time: "2 days ago",
    status: "read",
  },
];

const InAppNotifications = () => {
  const dispatch=useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const {inAppNotifications,loading}=useSelector((state)=>state.inAppNotification);
  console.log(inAppNotifications);
  useEffect(()=>{
    dispatch(getAllNotifications());
  },[dispatch])

useEffect(() => {
  const closeDropdown = (e) => {
    if (!e.target.closest('.notif-filter-wrapper')) {
      setFilterOpen(false);
    }
  };
  
  if (filterOpen) {
    document.addEventListener('mousedown', closeDropdown);
  }
  
  return () => document.removeEventListener('mousedown', closeDropdown);
}, [filterOpen]);

  const allNotification=useMemo(()=>{
    return inAppNotifications.filter( (notif) =>
      notif?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif?.description?.toLowerCase().includes(searchTerm.toLowerCase())) ??[]
  },[inAppNotifications,searchTerm])


  const handleMarkAllAsRead = () => {
   const notificationIds=allNotification.filter((n)=>n.status===false).map((n)=>n.notificationId);
   dispatch(markAsReadNotification(notificationIds));
   
  };

  const handleMarkAsRead = (id) => {
    dispatch(markAsReadNotification(id));
  };

  const unreadCount = allNotification.filter((n) => n.status === false).length;
  console.log(unreadCount);
  if (loading) {
    return <div className="notifications-page"><div className="loader"></div></div>
  }

  const handleFilter = (filterType) => {
  console.log("Filter clicked:", filterType);
  setFilterOpen(false); // Close dropdown after selection
};


  return (
    <div className="notifications-page">
      {/* Back Button */}
      <button className="notif-back">
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      {/* Header */}
      <div className="notif-header">
        <div className="notif-header__left">
          <h1 className="notif-header__title">Notifications</h1>
          <p className="notif-header__desc">
            Stay updated with your latest activities and messages
          </p>
        </div>
        <div className="notif-header__right">
          <button className="notif-btn notif-btn--primary" onClick={handleMarkAllAsRead}>
            <CheckCircle size={16} />
            <span>Mark All as Read</span>
          </button>
          <button className="notif-btn notif-btn--outline">
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="notif-toolbar">
        <div className="notif-search">
          <Search size={18} className="notif-search__icon" />
          <input
            type="text"
            className="notif-search__input"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="notif-toolbar__actions">
          {/* <button className="notif-action-btn" onClick={() => setFilterOpen(!filterOpen)}>
            <Filter size={16} />
            <span>Filter</span>
            <ChevronDown size={14} />
          </button> */}

            

          
          <div className="notif-filter-wrapper" style={{ position: 'relative' }}>
            <button 
              className={`notif-action-btn ${filterOpen ? 'active' : ''}`} 
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={16} />
              <span>Filter</span>
              <ChevronDown size={14} style={{ transform: filterOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </button>

            {filterOpen && (
              <ul className="notif-filter-dropdown">
                <li onClick={() => handleFilter("all")}>All Notifications</li>
                <li onClick={() => handleFilter("unread")}>Unread</li>
                <li onClick={() => handleFilter("priority")}>High Priority</li>
                <div className="dropdown-divider"></div>
                <li onClick={() => handleFilter("clear")} className="clear-btn">Clear Filters</li>
              </ul>
            )}
          </div>

          <button className="notif-action-btn" onClick={() => setTypeOpen(!typeOpen)}>
            <Tag size={16} />
            <span>Type</span>
            <ChevronDown size={14} />
          </button>
       {  !analyticsOpen? <button className="notif-action-btn" onClick={()=>{setAnalyticsOpen(true),dispatch(getNotificationAnalytics())}}>
            <BarChart3 size={16} />
            <span>Analytics</span>
          </button>:<button className="notif-action-btn" onClick={()=>{setAnalyticsOpen(false)}}>
            <MailCheckIcon size={16} />
            <span>Notification</span>
          </button>}
        </div>
      </div>

      {/* Notifications Table */}
        {!analyticsOpen ? <div className="notif-table">
        {/* Table Header */}
        <div className="notif-table__header">
          <div className="notif-table__col notif-table__col--notification">Notification</div>
          <div className="notif-table__col notif-table__col--type">Type</div>
          <div className="notif-table__col notif-table__col--time">Time</div>
          <div className="notif-table__col notif-table__col--status">Status</div>
        </div>

        {/* Table Body */}
        <div className="notif-table__body">
          {allNotification.map((notif) => (
            <NotificationRow
              key={notif.id}
              notification={notif}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      </div>:<NotificationAnalytics/>
}
      {/* Empty State */}
      {allNotification.length === 0 && (
        <div className="notif-empty">
          <p>No notifications found</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// NOTIFICATION ROW
// ============================================================================


const NotificationType = {
  1: "Ticket",
  2: "Message",
  3: "User",
  4: "Monitor",
  5: "User",
  6: "Ticket",
  7: "User",
};



const TYPE_COLOR_MAP = {
  1: "#6366F1", // Indigo → Ticket / Task
  2: "#10B981", // Emerald → Message / Chat
  3: "#8B5CF6", // Violet → Team / Group
  4: "#F59E0B", // Amber → System / Warning
  5: "#EF4444", // Red → Alert / Critical
  6: "#3B82F6", // Blue → Settings / Config
  7: "#EC4899", // Pink → Activity / Misc
};


const getColorByType = (type) => {
  return TYPE_COLOR_MAP[type] || "#6b7280"; // default grey
};

const NotificationRow = ({ notification, onMarkAsRead }) => {
const getIcon = (type) => {

  switch (type) {
    case 1:
      return <Ticket size={18} />;
    case 2:
      return <MessageSquare size={18} />;
    case 3:
      return <Users size={18} />;
    case 4:
      return <Ticket size={18} />; 
    case 5:
      return <Users size={18} />;
    case 6:
      return <MonitorCheckIcon size={18} />;

    case 7:
      return <Users size={18} />;
    default:
      return <Ticket size={18} />;
  }
};



  return (
    <div
      className={`notif-row ${notification.status === false ? "notif-row--unread" : ""}`}
      onClick={() => notification.status === false && onMarkAsRead(notification.notificationId)}
    >
      <div className="notif-row__notification">
        <div className="notif-row__icon" style={{ backgroundColor: getColorByType(notification.type) }}>
          {getIcon(notification.type)}
        </div>
        <div className="notif-row__content">
          <h3 className="notif-row__title">{notification?.title}</h3>
          <p className="notif-row__desc">{notification?.message}</p>
        </div>
      </div>

      <div className="notif-row__type">
        <span className="notif-type-badge">{NotificationType[notification?.type]}</span>
      </div>

      <div className="notif-row__time">
        <span>{formatNotificationTime(notification?.createdAt)}</span>
      </div>

      <div className="notif-row__status">
        <span className={`notif-status notif-status--${notification?.status? "read" : "unread"}`}>
          {notification?.status  ? "Read" : "Unread"}
        </span>
      </div>
    </div>
  );
};

export default InAppNotifications;
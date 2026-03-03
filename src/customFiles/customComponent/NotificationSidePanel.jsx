import React, { useState, useMemo,  } from 'react';
// import PropTypes from 'prop-types';
import './styles/NotificationContent.scss';
import SidePanel from './utilityComponenet/sidePanel';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotifications, markAsReadNotification } from '../../Redux/Actions/NotificationActions/inAppNotificationAction';
import { MessageSquare, MonitorCheckIcon, Ticket, Users } from 'lucide-react';

const NotificationPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('all');
  const { inAppNotifications, loading } = useSelector((state) => state.inAppNotification);
    const dispatch = useDispatch();
    // useEffect(()=>{
    //   dispatch(getAllNotifications());
    // },[dispatch])

  // Helper function to format time relative to now
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffInMs = now - notificationDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // For today (less than 24 hours)
    if (diffInDays === 0) {
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // For yesterday
    if (diffInDays === 1) {
      return 'Yesterday';
    }
    
    // For 2 days ago
    if (diffInDays === 2) {
      return '2 days ago';
    }
    
    // For older dates, show the actual date
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return notificationDate.toLocaleDateString('en-US', options);
  };

  // Group notifications by time period
  const groupedNotifications = useMemo(() => {
    if (!inAppNotifications || inAppNotifications.length === 0) {
      return { today: [], yesterday: [], twoDaysAgo: [], older: [] };
    }

    const now = new Date();
    const groups = {
      today: [],
      yesterday: [],
      twoDaysAgo: [],
      older: []
    };

    // Filter notifications based on active tab
    const filteredNotifications = activeTab === 'unread' 
      ? inAppNotifications.filter(notification => !notification.status)
      : inAppNotifications;

    filteredNotifications.forEach((notification) => {
      const notificationDate = new Date(notification.createdAt || notification.timestamp);
      const diffInMs = now - notificationDate;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) {
        groups.today.push(notification);
      } else if (diffInDays === 1) {
        groups.yesterday.push(notification);
      } else if (diffInDays === 2) {
        groups.twoDaysAgo.push(notification);
      } else {
        groups.older.push(notification);
      }
    });

    return groups;
  }, [inAppNotifications, activeTab]);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    if (!inAppNotifications || inAppNotifications.length === 0) return 0;
    return inAppNotifications.filter(notification => !notification.status).length;
  }, [inAppNotifications]);


    const handleMarkAllRead = () => {
     const notificationIds=inAppNotifications.filter((n)=>n.status===false).map((n)=>n.notificationId);
     dispatch(markAsReadNotification(notificationIds));
    };
  
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
    <SidePanel 
      isOpen={isOpen} 
      onClose={onClose}
      width="570px"
      position="right"
    >
      <div className="notification-content-wrapper">
        <div className="notification-header">
          <div className="header-top">
            <h1 className="panel-title">Notification</h1>
            <div className="header-actions">
              <button className="icon-btn" aria-label="Refresh"onClick={()=>{dispatch(getAllNotifications());}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                </svg>
              </button>
              <button className="icon-btn" onClick={onClose} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <p className="panel-subtitle">Stay Update With Your Latest Notifications</p>
        </div>

        <div className="notification-tabs">
          <div className="tabs-container">
            <button
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All {inAppNotifications && inAppNotifications.length > 0 && (
                <span className="tab-badge">{inAppNotifications.length}</span>
              )}
            </button>
            <button
              className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
              onClick={() => setActiveTab('unread')}
            >
              Unread {unreadCount > 0 && (
                <span className="tab-badge">{unreadCount}</span>
              )}
            </button>
          </div>
          <button className="mark-read-btn" onClick={handleMarkAllRead}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Mark all as read
          </button>
        </div>

        <div className="notification-body">
          {loading ? (
            <div className="loading-state">Loading notifications...</div>
          ) : inAppNotifications && inAppNotifications.length > 0 ? (
            <>
              {groupedNotifications.today.length > 0 && (
                <div className="notification-section">
                  <div className="section-label">Today</div>
                  {groupedNotifications.today.map((notification) => (
                    <div key={notification._id || notification.id} className="notification-item">
                      <div className="notification-avatar">
                        {notification.avatar || notification.sender?.avatar ? (
                          <img 
                            src={notification.avatar || notification.sender?.avatar} 
                            alt={notification.sender?.name || 'User'} 
                          />
                        ) : (
                          <div className="default-avatar">
                            {(notification.sender?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="notification-content">
                        <p className="notification-title">{notification.message || notification.title}</p>
                        <div className="notification-meta">
                          <span className="meta-badge">{getIcon(notification.type)} </span>
                          <span className="meta-dot">●</span>
                          <span className="meta-text">{formatTimeAgo(notification.createdAt || notification.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {groupedNotifications.yesterday.length > 0 && (
                <div className="notification-section">
                  <div className="section-label">Yesterday</div>
                  {groupedNotifications.yesterday.map((notification) => (
                    <div key={notification._id || notification.id} className="notification-item">
                      <div className="notification-avatar">
                        {notification.avatar || notification.sender?.avatar ? (
                          <img 
                            src={notification.avatar || notification.sender?.avatar} 
                            alt={notification.sender?.name || 'User'} 
                          />
                        ) : (
                          <div className="default-avatar">
                            {(notification.sender?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="notification-content">
                        <p className="notification-title">{notification.message || notification.title}</p>
                        <div className="notification-meta">
                          <span className="meta-badge">{getIcon(notification.type)}</span>
                          <span className="meta-dot">●</span>
                          <span className="meta-text">{formatTimeAgo(notification.createdAt || notification.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {groupedNotifications.twoDaysAgo.length > 0 && (
                <div className="notification-section">
                  <div className="section-label">2 Days Ago</div>
                  {groupedNotifications.twoDaysAgo.map((notification) => (
                    <div key={notification._id || notification.id} className="notification-item">
                      <div className="notification-avatar">
                        {notification.avatar || notification.sender?.avatar ? (
                          <img 
                            src={notification.avatar || notification.sender?.avatar} 
                            alt={notification.sender?.name || 'User'} 
                          />
                        ) : (
                          <div className="default-avatar">
                            {(notification.sender?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="notification-content">
                        <p className="notification-title">{notification.message || notification.title}</p>
                        <div className="notification-meta">
                          <span className="meta-badge">{getIcon(notification.type)}</span>
                          <span className="meta-dot">●</span>
                          <span className="meta-text">{formatTimeAgo(notification.createdAt || notification.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {groupedNotifications.older.length > 0 && (
                <div className="notification-section">
                  <div className="section-label">Older</div>
                  {groupedNotifications.older.map((notification) => (
                    <div key={notification._id || notification.id} className="notification-item">
                      <div className="notification-avatar">
                        {notification.avatar || notification.sender?.avatar ? (
                          <img 
                            src={notification.avatar || notification.sender?.avatar} 
                            alt={notification.sender?.name || 'User'} 
                          />
                        ) : (
                          <div className="default-avatar">
                            {(notification.sender?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="notification-content">
                        <p className="notification-title">{notification.message || notification.title}</p>
                        <div className="notification-meta">
                          <span className="meta-badge">{getIcon(notification.type)}</span>
                          <span className="meta-dot">●</span>
                          <span className="meta-text">{formatTimeAgo(notification.createdAt || notification.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">No notifications yet</div>
          )}
        </div>
      </div>
    </SidePanel>
  );
};

// NotificationPanel.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
// };

export default NotificationPanel;
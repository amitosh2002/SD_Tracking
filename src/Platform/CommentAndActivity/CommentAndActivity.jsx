import React, { useState } from 'react';
import {
  MessageSquare,
  Activity,
  Send,
  Bold,
  Italic,
  List,
  Link,
  Clock,
  User,
  Tag,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import './style/commentActivitySection.scss';
import { useEffect } from 'react';
import { getActivityLogs } from '../../Redux/Actions/TicketActions/ticketAction';
import { useDispatch, useSelector } from 'react-redux';
import ActivityLogCards from './ActivityLogCards';
import NoLogsEmptyState from './NoLogState';

const CommentActivitySection = ({ task }) => {
  const dispatch= useDispatch();
  useEffect(()=>{
    dispatch(getActivityLogs(task?._id))
  },[dispatch,task])



  // ====================== Reducer calls ================
      const {activityLogLoading,activityLogs}=useSelector((state)=>state.worksTicket)
    console.log(activityLogLoading,activityLogs)

  const [activeTab, setActiveTab] = useState('comments');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Amitosh',
      avatar: 'A',
      text: 'This looks good! Can we add validation for the email field?',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      author: 'John Doe',
      avatar: 'J',
      text: 'Updated the design as per the feedback. Please review.',
      timestamp: '1 hour ago'
    }
  ]);

  const activities = [
    {
      id: 1,
      type: 'status_change',
      user: 'Amitosh',
      avatar: 'A',
      action: 'changed status from',
      from: 'IN_PROGRESS',
      to: 'IN_REVIEW',
      timestamp: '3 hours ago',
      icon: CheckCircle,
      color: '#10b981'
    },
    {
      id: 2,
      type: 'assignment',
      user: 'John Doe',
      avatar: 'J',
      action: 'assigned this task to',
      assignee: 'Amitosh',
      timestamp: '5 hours ago',
      icon: User,
      color: '#6366f1'
    },
    {
      id: 3,
      type: 'priority_change',
      user: 'Amitosh',
      avatar: 'A',
      action: 'changed priority from',
      from: 'LOW',
      to: 'HIGH',
      timestamp: '1 day ago',
      icon: AlertCircle,
      color: '#f59e0b'
    },
    {
      id: 4,
      type: 'comment',
      user: 'Sarah Smith',
      avatar: 'S',
      action: 'added a comment',
      timestamp: '2 days ago',
      icon: MessageSquare,
      color: '#8b5cf6'
    },
    {
      id: 5,
      type: 'tag_added',
      user: 'Amitosh',
      avatar: 'A',
      action: 'added tag',
      tag: 'urgent',
      timestamp: '2 days ago',
      icon: Tag,
      color: '#06b6d4'
    }
  ];

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: comments.length + 1,
      author: 'Amitosh',
      avatar: 'A',
      text: commentText,
      timestamp: 'Just now'
    };

    setComments([...comments, newComment]);
    setCommentText('');
  };

  return (
    <div className="comment-section-container">
      <div className="tabs-container">
        <button
          className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          <MessageSquare size={18} />
          <span>Comments</span>
          <span className="badge">{comments.length}</span>
        </button>

        <button
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <Activity size={18} />
          <span>Activity</span>
          <span className="badge">{activities.length}</span>
        </button>
      </div>

      <div className="content">
        {activeTab === 'comments' ? (
          <div className="comments-section">
            <div className="comment-form">
              <div className="avatar">A</div>
              <div className="input-container">
                <div className="toolbar">
                  <button title="Bold"><Bold size={16} /></button>
                  <button title="Italic"><Italic size={16} /></button>
                  <button title="List"><List size={16} /></button>
                  <button title="Link"><Link size={16} /></button>
                </div>
                <textarea
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                />
                <div className="submit-container">
                  <button
                    className="submit-btn"
                    disabled={!commentText.trim()}
                    onClick={handleSubmitComment}
                  >
                    <Send size={16} />
                    <span>Comment</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="avatar">{comment.avatar}</div>
                  <div className="comment-content">
                    <div className="header">
                      <span className="author">{comment.author}</span>
                      <span className="time">{comment.timestamp}</span>
                    </div>
                    <div className="text">{comment.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
        <div className="activity-section">
              {activityLogs && activityLogs.length > 0 ? (
                activityLogs.map((activity) => (
                  <div className="log_container_fill" key={activity._id}>
                    <ActivityLogCards activity={activity} />
                  </div>
                ))
              ) : (
                <NoLogsEmptyState
                  title="Start Tracking Activity"
                  message="Create your first task to see activity logs"
                  showAction={true}
                  actionText="Create Task"
                  // onActionClick={() => navigate('/create-task')}
                />
              )}
            </div>

        )}
      </div>
    </div>
  );
};

export default CommentActivitySection;

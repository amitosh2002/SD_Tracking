import React, { useState, useEffect } from 'react';
import { Clock, Calendar, TrendingUp, Award, BarChart3, Mail, MapPin, Phone, Edit2, Save, X } from 'lucide-react';
import "./styles/profile.scss"
import {  getRescentUserTimeLog, getRescentUserWork } from '../Redux/Actions/PlatformActions.js/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { SHOW_SNACKBAR } from '../Redux/Constants/PlatformConstatnt/platformConstant';
import { formatCreatedAtDate, transformWeeklyAggregates } from '../utillity/helper';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();
  
  const { userDetails, sucessFetch,rescentWork ,suceessFetchUserLog, totalWorkHours,currentWeek,currentMonthtotalWorkHours,currentWeektotalWorkHours} = useSelector((state) => state.user);
  const [loading, setLoading] = useState(!sucessFetch); // Changed to true initially
  
  const [userData, setUserData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    avatar: '',
    joinDate: '',
    totalHours: 0,
    thisWeek: 0,
    thisMonth: 0,
    efficiency: 0,
    projects: 0,
    achievements: 0
  });
  
  const [editedData, setEditedData] = useState({});
  const navigate= useNavigate();

  // const weeklyData = [
  //   { day: 'Mon', hours: 8.5 },
  //   { day: 'Tue', hours: 7.2 },
  //   { day: 'Wed', hours: 9.0 },
  //   { day: 'Thu', hours: 8.1 },
  //   { day: 'Fri', hours: 5.7 },
  // ];

  // const recentActivity = [
  //   { project: 'Dashboard Redesign', hours: 4.5, date: 'Today' },
  //   { project: 'Mobile App UI', hours: 6.2, date: 'Yesterday' },
  //   { project: 'Client Meeting', hours: 2.0, date: 'Oct 1' },
  //   { project: 'Design System', hours: 5.5, date: 'Sep 30' },
  // ];

  // Fetch user data from backend
  useEffect(() => {
    console.log('Dispatching fetchUserDetails...');
    // dispatch(fetchUserDetails());
    dispatch(getRescentUserWork(userDetails?.id));
    dispatch(getRescentUserTimeLog(userDetails?.id));
   

  }, [dispatch,userDetails?.id]);

  // Process user details when they arrive
  useEffect(() => {
    
    if (sucessFetch) {
      const user = userDetails;
      // Generate avatar initials
      const getInitials = () => {
        if (user?.profile?.firstName && user?.profile?.lastName) {
          return `${user?.profile.firstName[0]}${user?.profile.lastName[0]}`.toUpperCase();
        }
        if (user?.username) {
          return user?.username?.substring(0, 2).toUpperCase();
        }
        return 'U';
      };

      // Format join date
      const formatJoinDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch (e) {
          console.error('Date formatting error:', e);
          return 'N/A';
        }
      };

      // Merge API data with mock data for missing fields
      const processedData = {
        // Real data from API
        name: user?.profile?.firstName && user?.profile?.lastName 
          ? `${user.profile.firstName} ${user.profile.lastName}` 
          : user?.username || 'User Name',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role === 'user' ? 'Team Member' : user?.role.charAt(0).toUpperCase() + user?.role.slice(1),
        avatar: getInitials(),
        joinDate: formatJoinDate(user?.createdAt),
        
        // Mock data for fields not in API (you can replace these with real data later)
        location: user?.location || 'Not specified',
        totalHours: user?.totalHours || 1847,
        thisWeek: user?.thisWeek || 38.5,
        thisMonth: user?.thisMonth || 156,
        efficiency: user?.efficiency || 94,
        projects: user?.projects || 12,
        achievements: user?.achievements || 28
      };

      
      setUserData(processedData);
      setEditedData(processedData);
      setLoading(false);
    }
  }, [userDetails,sucessFetch]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
    //   // Prepare data for backend - only send fields that can be updated
    //   const updatePayload = {
    //     profile: {
    //       firstName: editedData.name.split(' ')[0] || editedData.name,
    //       lastName: editedData.name.split(' ').slice(1).join(' ') || ''
    //     },
    //     phone: editedData.phone,
    //     location: editedData.location
    //   };

      // Replace this with your actual backend endpoint
      // const response = await fetch('https://api.yourbackend.com/user/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(updatePayload)
      // });
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserData(editedData);
      setIsEditing(false);
      
      // Optionally refresh user details from backend
      // dispatch(fetchUserDetails());
    } catch (error) {
      console.error('Error saving user data:', error);
      alert('Failed to save profile. Please try again.');
        dispatch({
              type: SHOW_SNACKBAR,
              payload: {
                message: `Failed to save profile. Please try again.`,
                type: "error"
              }
            });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

//   Show loading state
  if (loading) {
    return (
      <div className="user-profile">
        <div className="user-profile__loading">Loading user profile...</div>
      </div>
    );
  }

  console.log('Rendering with userData:', userData);
  
  const displayData = isEditing ? editedData : userData;

  return (
    <div className="user-profile">
      <div className="user-profile__container">
        {/* Header Card */}
        <div className="user-profile__header">
          <div className="user-profile__edit-buttons">
            {!isEditing ? (
              <button className="user-profile__btn user-profile__btn--edit" onClick={handleEdit}>
                <Edit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  className="user-profile__btn user-profile__btn--save" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  className="user-profile__btn user-profile__btn--cancel" 
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            )}
          </div>

          <div className="user-profile__header-content">
            <div className="user-profile__avatar-wrapper">
              <div className="user-profile__avatar">{displayData.avatar || 'U'}</div>
              <div className="user-profile__status-badge"></div>
            </div>
            
            <div className="user-profile__info">
              {isEditing ? (
                <input
                  type="text"
                  className="user-profile__input"
                  value={editedData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Full Name"
                />
              ) : (
                <h1 className="user-profile__name">{displayData.name || 'User Name'}</h1>
              )}
              
              {isEditing ? (
                <input
                  type="text"
                  className="user-profile__input--role"
                  value={editedData.role || ''}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="Role"
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              ) : (
                <p className="user-profile__role">{displayData.role || 'Team Member'}</p>
              )}
              
              <div className="user-profile__contact-grid">
                <div className="user-profile__contact-item">
                  <Mail />
                  {isEditing ? (
                    <input
                      type="email"
                      className="user-profile__contact-input"
                      value={editedData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Email"
                      disabled
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                  ) : (
                    <span>{displayData.email || 'No email'}</span>
                  )}
                </div>
                <div className="user-profile__contact-item">
                  <Phone />
                  {isEditing ? (
                    <input
                      type="tel"
                      className="user-profile__contact-input"
                      value={editedData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Phone"
                    />
                  ) : (
                    <span>{displayData.phone || 'No phone'}</span>
                  )}
                </div>
                <div className="user-profile__contact-item">
                  <MapPin />
                  {isEditing ? (
                    <input
                      type="text"
                      className="user-profile__contact-input"
                      value={editedData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Location"
                    />
                  ) : (
                    <span>{displayData.location || 'Not specified'}</span>
                  )}
                </div>
                <div className="user-profile__contact-item">
                  <Calendar />
                  <span>Joined {displayData.joinDate || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="user-profile__stats-grid">
          <div className="user-profile__stat-card">
            <div className="user-profile__stat-header">
              <div className="user-profile__stat-icon user-profile__stat-icon--blue">
                <Clock />
              </div>
              <span className="user-profile__stat-badge user-profile__stat-badge--blue">
                This Week
              </span>
            </div>
            <h3 className="user-profile__stat-value">{currentWeektotalWorkHours || 0}h</h3>
            <p className="user-profile__stat-label">Logged hours</p>
          </div>

          <div className="user-profile__stat-card">
            <div className="user-profile__stat-header">
              <div className="user-profile__stat-icon user-profile__stat-icon--purple">
                <Calendar />
              </div>
              <span className="user-profile__stat-badge user-profile__stat-badge--purple">
                This Month
              </span>
            </div>
            <h3 className="user-profile__stat-value">{currentMonthtotalWorkHours || 0}h</h3>
            <p className="user-profile__stat-label">Total tracked</p>
          </div>

          <div className="user-profile__stat-card">
            <div className="user-profile__stat-header">
              <div className="user-profile__stat-icon user-profile__stat-icon--green">
                <TrendingUp />
              </div>
              <span className="user-profile__stat-badge user-profile__stat-badge--green">
                Efficiency
              </span>
            </div>
            <h3 className="user-profile__stat-value">{displayData.efficiency || 0}%</h3>
            <p className="user-profile__stat-label">Performance</p>
          </div>

          <div className="user-profile__stat-card">
            <div className="user-profile__stat-header">
              <div className="user-profile__stat-icon user-profile__stat-icon--orange">
                <Award />
              </div>
              <span className="user-profile__stat-badge user-profile__stat-badge--orange">
                All Time
              </span>
            </div>
            <h3 className="user-profile__stat-value">{Math.ceil(totalWorkHours/60) || 0}h</h3>
            <p className="user-profile__stat-label">Total hours</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="user-profile__content-grid">
          {/* Weekly Chart */}
          <div className="user-profile__chart-card">
            <h2 className="user-profile__card-title">
              <BarChart3 />
              Weekly Time Log
            </h2>
            <div className="user-profile__chart">
                {suceessFetchUserLog ? (
                    transformWeeklyAggregates(currentWeek)?.map((day, index) => (
                       <div key={index} className="user-profile__bar">
                            <div
                              className="user-profile__bar-fill"
                              style={{ height: `${day.hours * 10}%` }}
                            >
                              <span className="user-profile__bar-value">{day?.hours}h</span>
                            </div>
                            <span className="user-profile__bar-label">{day?.day}</span>
                          </div>
                    ))
                ) : (
                    <p>Loading </p> 
                )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="user-profile__activity-card">
            <h2 className="user-profile__card-title">Recent Activity</h2>
            <div className="user-profile__activity-list">
              {Array.isArray(rescentWork) && rescentWork?.map((activity, index) => (
                <div key={index} className="user-profile__activity-item" onClick={()=>navigate(`/tickets/${activity?.ticketID}`)}>
                  <div className="user-profile__activity-header">
                    <span className="user-profile__activity-project">{activity?.ticketKey}</span>
                    <span className="user-profile__activity-hours">{activity.ticketPriority}</span>
                  </div>
                  <div className="user-profile__activity-date">{
                  formatCreatedAtDate( activity.createdAt, 'en-US')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
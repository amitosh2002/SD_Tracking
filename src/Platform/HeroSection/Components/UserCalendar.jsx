import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, List, Info, Clock, AlertCircle, CalendarDays } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../styles/UserCalendar.scss';

const UserCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [projectsData, setProjectsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const fetchCalendarData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
            const res = await axios.post(
                `${backendUrl}/api/sprint/allsprint`,
                {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setProjectsData(res.data.projects || []);
            }
        } catch (err) {
            console.error("Fetch calendar data error:", err);
            setError("Failed to load project timelines.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCalendarData();
    }, []);

    // NEW: Auto-select today when data is loaded
    useEffect(() => {
        if (projectsData.length > 0 && !selectedDate) {
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0];
            const allSprints = projectsData.flatMap(p => p.sprints || []);
            
            const activeSprints = allSprints.filter(s => {
                const sDate = s.startDate ? new Date(s.startDate).toISOString().split('T')[0] : null;
                const eDate = s.endDate ? new Date(s.endDate).toISOString().split('T')[0] : null;
                return dateStr >= sDate && dateStr <= eDate;
            });

            const dayTickets = allSprints.flatMap(s => s.tickets || []).filter(t => {
                return t.eta ? new Date(t.eta).toISOString().split('T')[0] === dateStr : false;
            });

            setSelectedDate({ 
                day: today.getDate(), 
                date: dateStr, 
                sprints: activeSprints, 
                tickets: dayTickets 
            });
        }
    }, [projectsData]);

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        
        const dateStr = today.toISOString().split('T')[0];
        const allSprints = projectsData.flatMap(p => p.sprints || []);
        
        const activeSprints = allSprints.filter(s => {
            const sDate = s.startDate ? new Date(s.startDate).toISOString().split('T')[0] : null;
            const eDate = s.endDate ? new Date(s.endDate).toISOString().split('T')[0] : null;
            return dateStr >= sDate && dateStr <= eDate;
        });

        const dayTickets = allSprints.flatMap(s => s.tickets || []).filter(t => {
            return t.eta ? new Date(t.eta).toISOString().split('T')[0] === dateStr : false;
        });

        setSelectedDate({ 
            day: today.getDate(), 
            date: dateStr, 
            sprints: activeSprints, 
            tickets: dayTickets 
        });
    };

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const renderHeader = () => (
        <div className="calendar-header">
            <div className="title-group">
                <h2>{monthNames[currentDate.getMonth()]} <span>{currentDate.getFullYear()}</span></h2>
                <p>Track sprints and task deadlines effortlessly</p>
            </div>
            <div className="nav-group">
                <button onClick={prevMonth}><ChevronLeft size={20} /></button>
                <button onClick={goToToday} className="btn-today">Today</button>
                <button onClick={nextMonth}><ChevronRight size={20} /></button>
            </div>
        </div>
    );

    const renderGrid = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const days = [];

        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const headers = weekDays.map(d => <div key={d} className="weekday-header">{d}</div>);

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-cell empty" />);
        }

        const allSprints = projectsData.flatMap(p => p.sprints || []);

        for (let d = 1; d <= totalDays; d++) {
            const dateStr = new Date(year, month, d).toISOString().split('T')[0];
            const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

            const activeSprints = allSprints.filter(s => {
                const sDate = s.startDate ? new Date(s.startDate).toISOString().split('T')[0] : null;
                const eDate = s.endDate ? new Date(s.endDate).toISOString().split('T')[0] : null;
                return dateStr >= sDate && dateStr <= eDate;
            });

            const dayTickets = allSprints.flatMap(s => s.tickets || []).filter(t => {
                return t.eta ? new Date(t.eta).toISOString().split('T')[0] === dateStr : false;
            });

            days.push(
                <div 
                    key={d} 
                    className={`calendar-cell ${isToday ? 'today' : ''}`}
                    onClick={() => setSelectedDate({ day: d, date: dateStr, sprints: activeSprints, tickets: dayTickets })}
                >
                    <span className="day-number">{d}</span>
                    <div className="activity-container">
                        {activeSprints.map((s, idx) => (
                            <div key={idx} className={`sprint-bar ${s.isActive ? 'active' : 'planned'}`} title={`${s.projectName} | ${s.sprintName}`} />
                        ))}
                        {dayTickets.map((t, idx) => (
                            <div key={idx} className="task-marker">{t.title}</div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="calendar-grid">
                {headers}
                {days}
            </div>
        );
    };

    const renderDetails = () => {
        if (!selectedDate) return (
            <div className="details-panel">
                <div className="empty-state">
                    <CalendarDays size={64} style={{ opacity: 0.1 }} />
                    <p>Select a date to explore <br/> scheduled activities</p>
                </div>
            </div>
        );

        return (
            <div className="details-panel">
                <h3>{selectedDate.day} {monthNames[currentDate.getMonth()]}</h3>

                {selectedDate.sprints.length > 0 && (
                    <>
                        <p className="section-label">Active Sprints</p>
                        {selectedDate.sprints.map((s, i) => (
                            <div key={i} className="activity-item">
                                <div className="item-icon" style={{ color: s.isActive ? '#667eea' : '#cbd5e1', background: 'currentColor' }} />
                                <div className="item-info">
                                    <p className="name"><span style={{ color: '#6366f1', fontSize: '0.8rem', fontWeight: '800' }}>{s.projectName}</span> <br/> {s.sprintName}</p>
                                    <p className="meta">{s.status} • Sprint #{s.sprintNumber}</p>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                <p className="section-label">Task Deadlines (ETAs)</p>
                {selectedDate.tickets.length > 0 ? (
                    selectedDate.tickets.map((t, i) => (
                        <div key={i} className="activity-item">
                            <Clock size={16} color="#6366f1" />
                            <div className="item-info">
                                <p className="name">{t.title}</p>
                                <p className="meta">{t.ticketKey} • <span style={{ color: '#6366f1' }}>{t.status}</span></p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '0 10px', fontWeight: '500' }}>No task deadlines for this day.</p>
                )}
            </div>
        );
    };

    if (loading && projectsData.length === 0) return (
        <div className="calendar-container" style={{ alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
            <div className="animate-pulse" style={{ color: '#6366f1', fontWeight: '700' }}>Synchronizing Project Timelines...</div>
        </div>
    );

    return (
        <div className="calendar-container">
            {renderHeader()}
            <div className="calendar-layout">
                {renderGrid()}
                {renderDetails()}
            </div>
            {error && (
                <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: '500' }}>
                    <AlertCircle size={18} /> {error}
                </div>
            )}
        </div>
    );
};

export default UserCalendar;

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { useSelector } from 'react-redux';
import { HelpCircle, X } from 'lucide-react';
import "./styles/NotificationsAnalytics.scss";

const NotificationAnalytics = () => {
    const { notificationAnalytics, totalNotifications, unreadNotifications, readNotifications } = useSelector((state) => state.inAppNotification);
    const { barData, lineData, pieData } = notificationAnalytics;
    const [showEducation, setShowEducation] = useState(false);

    // Logic to find the highest category for the report text
    const topCategory = [...(barData || [])].sort((a, b) => b.count - a.count)[0];
    const latestCount = lineData?.[lineData.length - 1]?.count || 0;

    const educationContent = {
        title: "Understanding Your Notification Analytics",
        sections: [
            {
                heading: "Volume by Category",
                text: "Shows which notification categories generate the most alerts. Use this to identify which areas need attention or configuration adjustments."
            },
            {
                heading: "Activity Timeline",
                text: "Tracks notification volume over time. Helps you spot unusual spikes or patterns in your notification flow."
            },
            {
                heading: "Read Status",
                text: "Displays the ratio of read vs unread notifications. A high unread percentage might indicate notification overload."
            }
        ],
        tips: [
            "Review categories with high volumes regularly",
            "Configure notification preferences to reduce noise",
            "Maintain a healthy read rate to stay on top of important updates"
        ]
    };

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <div className="header-content">
                    <div>
                        <h2>Notification Analysis</h2>
                        <p>Total processed notifications: <strong>{totalNotifications}</strong></p>
                        <p>Total Read notifications: <strong>{readNotifications}</strong></p>
                        <p>Total Unread notifications: <strong>{unreadNotifications}</strong></p>
                    </div>
                    <button 
                        className="help-button" 
                        onClick={() => setShowEducation(true)}
                        aria-label="Learn about analytics"
                    >
                        <HelpCircle size={20} />
                    </button>
                </div>
            </div>

            <div className="analytics-grid">
                {/* BAR CHART */}
                <div className="chart-card">
                    <div className="chart-info">
                        <h3>Volume by Category</h3>
                        <p className="report-text">
                            {topCategory 
                                ? `Most alerts are coming from ${topCategory.name}. Consider reviewing these modules to reduce noise.` 
                                : "Awaiting category distribution data..."}
                        </p>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                            <XAxis 
                                dataKey="name" 
                                stroke="#9ca3af" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                tick={{ fill: '#6b7280' }}
                            />
                            <YAxis 
                                stroke="#9ca3af" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                tick={{ fill: '#6b7280' }}
                            />
                            <Tooltip 
                                cursor={{fill: 'rgba(59, 130, 246, 0.1)'}} 
                                contentStyle={{ 
                                    backgroundColor: '#ffffff', 
                                    border: '1px solid #e5e7eb', 
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }} 
                            />
                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* LINE CHART */}
                <div className="chart-card">
                    <div className="chart-info">
                        <h3>Activity Timeline</h3>
                        <p className="report-text">
                            Current activity is at <strong>{latestCount}</strong> hits today. 
                            {latestCount > 50 ? " High frequency detected." : " Stability maintained."}
                        </p>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={lineData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                            <XAxis 
                                dataKey="date" 
                                stroke="#9ca3af" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                tick={{ fill: '#6b7280' }}
                            />
                            <YAxis 
                                stroke="#9ca3af" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                tick={{ fill: '#6b7280' }}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#ffffff', 
                                    border: '1px solid #e5e7eb', 
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }} 
                            />
                            <Line 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#3b82f6" 
                                strokeWidth={2.5} 
                                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                                activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* CIRCULAR CHART */}
                <div className="chart-card">
                    <div className="chart-info">
                        <h3>Read Status</h3>
                        <p className="report-text">
                            <strong>{unreadNotifications}</strong> unread items. 
                            That's {Math.round((unreadNotifications / totalNotifications) * 100)}% of your total inbox.
                        </p>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie 
                                data={pieData} 
                                innerRadius={65} 
                                outerRadius={90} 
                                paddingAngle={5} 
                                dataKey="value" 
                                stroke="#fff"
                                strokeWidth={2}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                labelLine={{stroke: '#9ca3af', strokeWidth: 1}}
                            >
                                {pieData?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#ffffff', 
                                    border: '1px solid #e5e7eb', 
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                iconType="circle"
                                formatter={(value) => <span style={{ color: '#6b7280', fontSize: '13px' }}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Education Popup */}
            {showEducation && (
                <div className="education-overlay" onClick={() => setShowEducation(false)}>
                    <div className="education-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="education-header">
                            <h3>{educationContent.title}</h3>
                            <button 
                                className="close-button" 
                                onClick={() => setShowEducation(false)}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="education-content">
                            {educationContent.sections.map((section, index) => (
                                <div key={index} className="education-section">
                                    <h4>{section.heading}</h4>
                                    <p>{section.text}</p>
                                </div>
                            ))}

                            <div className="education-tips">
                                <h4>Best Practices</h4>
                                <ul>
                                    {educationContent.tips.map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationAnalytics;
import React from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  Target,
  Zap,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import './styles/AnalyticsChartPage.scss';

const ChartReportForSprint = ({ analyticsData }) => {
  if (!analyticsData) {
    return <div className="analytics-loading">Loading analytics...</div>;
  }

  const { summary, metrics, charts, forecast, warnings } = analyticsData || {};

  // Transform data for charts
  const lineChartData = (charts?.line?.labels || []).map((label, index) => ({
    name: label.replace('Sprint ', ''),
    velocity: charts?.line?.datasets?.[0]?.data?.[index] || 0,
    completion: charts?.line?.datasets?.[1]?.data?.[index] || 0
  }));

  const radarData = (charts?.radar?.labels || []).map((label, index) => ({
    metric: label,
    current: charts?.radar?.current?.[index] || 0,
    average: charts?.radar?.average?.[index] || 0
  }));

  // Pie chart data for task distribution
  const taskDistributionData = [
    { name: 'Completed', value: metrics?.completionRate?.current || 0, color: '#10b981' },
    { name: 'In Progress', value: 30, color: '#3b82f6' },
    { name: 'Remaining', value: 100 - (metrics?.completionRate?.current || 0) - 30, color: '#e5e7eb' }
  ];

  // Get status styling
  const getStatusColor = (status) => {
    const colors = {
      'CRITICAL': '#ef4444',
      'WARNING': '#f59e0b',
      'GOOD': '#10b981',
      'EXCELLENT': '#3b82f6'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CRITICAL':
        return <XCircle size={20} />;
      case 'GOOD':
      case 'EXCELLENT':
        return <CheckCircle2 size={20} />;
      default:
        return <AlertTriangle size={20} />;
    }
  };

  const getTrendIcon = (current, average) => {
    if (current > average) return <TrendingUp size={16} />;
    return <TrendingDown size={16} />;
  };

  const getTrendColor = (current, average) => {
    if (current > average) return '#10b981';
    return '#ef4444';
  };

  const formatPercentage = (value) => {
    return value > 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">{summary?.title || "Sprint Analytics"}</h1>
          <p className="dashboard-subtitle">{summary?.description || "Loading description..."}</p>
        </div>
        <div className="header-right">
          <div 
            className="status-indicator"
            style={{ 
              backgroundColor: `${getStatusColor(summary?.status)}15`,
              color: getStatusColor(summary?.status),
              borderColor: getStatusColor(summary?.status)
            }}
          >
            {getStatusIcon(summary?.status)}
            <span>{summary?.status || "UNKNOWN"}</span>
          </div>
        </div>
      </div>

      {/* Warnings Section */}
      {warnings && warnings.length > 0 && (
        <div className="warnings-container">
          {warnings.map((warning, index) => (
            <div 
              key={index} 
              className={`warning-card warning-${warning.level}`}
            >
              <AlertTriangle size={18} />
              <div className="warning-content">
                <span className="warning-code">{(warning.code || "").replace(/_/g, ' ')}</span>
                <p className="warning-message">{warning.message || "Potential issue detected"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card metric-card--primary">
          <div className="metric-header">
            <div className="metric-icon">
              <Zap size={20} />
            </div>
            <span className="metric-label">Velocity</span>
          </div>
          <div className="metric-value">{metrics?.velocity?.current || 0}</div>
          <div className="metric-footer">
            <span className="metric-subtitle">Story Points</span>
            <div 
              className="metric-trend"
              style={{ color: getTrendColor(metrics?.velocity?.current, metrics?.velocity?.average) }}
            >
              {getTrendIcon(metrics?.velocity?.current, metrics?.velocity?.average)}
              <span>vs avg {metrics?.velocity?.average || 0}</span>
            </div>
          </div>
        </div>

        <div className="metric-card metric-card--success">
          <div className="metric-header">
            <div className="metric-icon">
              <Target size={20} />
            </div>
            <span className="metric-label">Completion Rate</span>
          </div>
          <div className="metric-value">{metrics?.completionRate?.current || 0}%</div>
          <div className="metric-footer">
            <span className="metric-subtitle">Tasks Completed</span>
            <div 
              className="metric-trend"
              style={{ color: getTrendColor(metrics?.completionRate?.current, metrics?.completionRate?.average) }}
            >
              {getTrendIcon(metrics?.completionRate?.current, metrics?.completionRate?.average)}
              <span>vs avg {metrics?.completionRate?.average || 0}%</span>
            </div>
          </div>
        </div>

        <div className="metric-card metric-card--warning">
          <div className="metric-header">
            <div className="metric-icon">
              <Activity size={20} />
            </div>
            <span className="metric-label">Task Density</span>
          </div>
          <div className="metric-value">{(metrics?.taskDensity?.current || 0).toFixed(2)}</div>
          <div className="metric-footer">
            <span className="metric-subtitle">Tasks per Day</span>
            <div className="metric-trend">
              <span>avg {(metrics?.taskDensity?.average || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="metric-card metric-card--info">
          <div className="metric-header">
            <div className="metric-icon">
              <Clock size={20} />
            </div>
            <span className="metric-label">Efficiency</span>
          </div>
          <div className="metric-value">{((metrics?.efficiency?.current || 0) * 100).toFixed(1)}%</div>
          <div className="metric-footer">
            <span className="metric-subtitle">Work Completion</span>
            <div 
              className="metric-trend"
              style={{ color: getTrendColor(metrics?.efficiency?.current, metrics?.efficiency?.average) }}
            >
              {getTrendIcon(metrics?.efficiency?.current, metrics?.efficiency?.average)}
              <span>vs avg {((metrics?.efficiency?.average || 0) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Line Chart - Velocity & Completion Trend */}
        <div className="chart-card chart-card--large">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Sprint Velocity Trend</h3>
              <p className="chart-subtitle">Velocity and completion rate over time</p>
            </div>
            <button className="chart-action">View Detail</button>
          </div>
          <div className="chart-body">
            <div className="chart-stats">
              <div className="stat-item">
                <span className="stat-label">This Sprint</span>
                <span className="stat-value">{metrics?.velocity?.current || 0} SP</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Average</span>
                <span className="stat-value">{metrics?.velocity?.average || 0} SP</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="velocity" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6' }}
                  name="Velocity"
                />
                <Line 
                  type="monotone" 
                  dataKey="completion" 
                  stroke="#93c5fd" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#93c5fd' }}
                  name="Completion %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Task Distribution</h3>
              <p className="chart-subtitle">Current sprint breakdown</p>
            </div>
          </div>
          <div className="chart-body chart-body--center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={taskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                >
                  {taskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {taskDistributionData.map((item, index) => (
                <div key={index} className="legend-item">
                  <span 
                    className="legend-dot" 
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Radar */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Performance Metrics</h3>
              <p className="chart-subtitle">Multi-dimensional analysis</p>
            </div>
            <button className="chart-action">View Detail</button>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="metric" 
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <PolarRadiusAxis stroke="#9ca3af" />
                <Radar 
                  name="Current" 
                  dataKey="current" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.5}
                />
                <Radar 
                  name="Average" 
                  dataKey="average" 
                  stroke="#94a3b8" 
                  fill="#94a3b8" 
                  fillOpacity={0.3}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forecast Card */}
        <div className="chart-card chart-card--highlight">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Capacity Forecast</h3>
              <p className="chart-subtitle">Next sprint prediction</p>
            </div>
          </div>
          <div className="chart-body chart-body--forecast">
            <div className="forecast-main">
              <div className="forecast-value">{forecast?.predictedCapacity || 0}</div>
              <div className="forecast-label">Story Points</div>
            </div>
            <div className="forecast-confidence">
              <div 
                className={`confidence-badge confidence-${(forecast?.confidenceLevel || "unknown").toLowerCase()}`}
              >
                {(forecast?.confidenceLevel || "UNKNOWN").replace('_', ' ')}
              </div>
              <p className="forecast-text">{forecast?.confidenceText || "No forecast available"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="insights-section">
        <h3 className="section-title">Key Insights</h3>
        <div className="insights-grid">
          {(summary?.insights || []).map((insight, index) => (
            <div key={index} className="insight-card">
              <div className="insight-icon">
                <Activity size={16} />
              </div>
              <p className="insight-text">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartReportForSprint;

import React, { useEffect } from 'react';
// import AnalyticsDashboard from './AnalyticsDashboard';
import './AnalyticsDashboard.scss';
import ChartReportForSprint from './SprintAnalytics/Components/ChartReportForSprint';
import TeamAnalytics from './SprintAnalytics/Components/TeamAnalytics';
import { useDispatch, useSelector } from 'react-redux';
import { getSprintVelocityAction } from '../../Redux/Actions/AnalyticsActions/doraActions';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  MoveLeftIcon, 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Code2, 
  Network, 
  Shield 
} from 'lucide-react';

// Mock data for fallback testing
const goodAnalyticsData = {
  "summary": {
    "title": "Sprint Performance Overview",
    "description": "The current sprint demonstrates strong performance with 42 story points completed and 85% task completion rate. The team is on track to meet sprint goals with 2 days remaining.",
    "status": "EXCELLENT",
    "insights": [
      "Current sprint has 42 story points completed with 85% task completion rate.",
      "Velocity increased by 12% compared to the previous sprint average of 38 story points.",
      "Team is ahead of schedule with 2 days remaining in the sprint cycle."
    ]
  },
  "metrics": {
    "velocity": {
      "current": 42,
      "average": 38
    },
    "completionRate": {
      "current": 85,
      "average": 78
    },
    "planningAccuracy": {
      "current": 92,
      "average": 85
    },
    "taskDensity": {
      "current": 2.1,
      "average": 2.4
    },
    "efficiency": {
      "current": 0.94,
      "average": 0.87
    }
  },
  "charts": {
    "line": {
      "labels": ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5"],
      "datasets": [
        {
          "label": "Velocity",
          "data": [32, 35, 38, 40, 42]
        },
        {
          "label": "Completion Rate",
          "data": [70, 75, 78, 82, 85]
        }
      ]
    },
    "radar": {
      "labels": [
        "Velocity",
        "Planning Accuracy",
        "Task Density",
        "Completion Rate",
        "Efficiency"
      ],
      "current": [42, 92, 2.1, 85, 0.94],
      "average": [38, 85, 2.4, 78, 0.87]
    },
    "gantt": [
      {
        "id": "development",
        "label": "Development",
        "start": 0,
        "duration": 7,
        "status": "completed"
      },
      {
        "id": "testing",
        "label": "Testing",
        "start": 7,
        "duration": 4,
        "status": "in-progress"
      },
      {
        "id": "deployment",
        "label": "Deployment",
        "start": 11,
        "duration": 2,
        "status": "planned"
      }
    ],
    "quadrant": [
      {
        "label": "Sprint Features",
        "effort": 75,
        "value": 88,
        "quadrant": "High Effort High Value"
      }
    ]
  },
  "forecast": {
    "predictedCapacity": 44,
    "confidenceLevel": "HIGH",
    "confidenceText": "Based on consistent performance over the last 5 sprints, the team is predicted to deliver approximately 44 story points in the next sprint."
  },
  "warnings": [
    {
      "code": "MINOR_SCOPE_CREEP",
      "level": "warning",
      "message": "2 unplanned tasks were added mid-sprint. Consider improving sprint planning processes."
    }
  ]
};
const menuItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Team Matrix", icon: Users },
  { label: "Performance", icon: TrendingUp }, 
  { label: "Developers", icon: Code2 },
  { label: "Infrastructure", icon: Network },
  { label: "Governance", icon: Shield }
];
function AnalyticsDashBoardV2() {
  // const [showGoodData, setShowGoodData] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState(0);
    const projectId= useParams().projectId
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sprintAnalyticsData, sprintVelocityData, loading } = useSelector((state) => state.doraV1);

    useEffect(() => {
        dispatch(getSprintVelocityAction(projectId));
      }, [dispatch,projectId]);

  const childrens = {
    0: <ChartReportForSprint analyticsData={sprintAnalyticsData ?? goodAnalyticsData} />,
    1: <TeamAnalytics data={sprintVelocityData} />,
    2: <div className="placeholder-tab"><h3>Performance Trends</h3><p>Coming soon: Advanced historical performance comparisons.</p></div>,
    3: <div className="placeholder-tab"><h3>Developer Productivity</h3><p>Coming soon: Individual contribution and code quality metrics.</p></div>,
    4: <div className="placeholder-tab"><h3>Infrastructure Health</h3><p>Coming soon: CI/CD pipeline and system uptime analytics.</p></div>,
    5: <div className="placeholder-tab"><h3>Governance & Compliance</h3><p>Coming soon: Project standards and security audit overview.</p></div>,
  }

  if (loading) {
    return (
      <div className="dashboard-wrapper dashboard-wrapper--loading">
        <div className="status-badge">Analyzing Sprint Data...</div>
      </div>
    );
  }

  return (
  <div className="dashboard-wrapper">
      {/* LEFT SIDEBAR */}
      <aside className="analytics-sidebar">
        <div className="go-back-link" onClick={() => navigate(`/work-space/confrigurator`)}> 
          <MoveLeftIcon size={18} />
          <span>Back to Configurator</span>
        </div>

        <nav className="nav-list">
          {menuItems.map((item, index) => (
            <div 
              key={item.label} 
              className={`nav-item ${activeTab === index ? 'active' : ''}`}
              onClick={()=>setActiveTab(index)}
            >
              <item.icon size={18} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <main className="main-content-analytics">
        <header className="top-bar">
          <div>
            <h1>{menuItems[activeTab].label}</h1>
            <p className="md_body_light" style={{color: '#64748b', marginTop: '4px'}}>
              {activeTab === 0 ? "Real-time sprint progress and velocity insights" : "Detailed team performance and work distribution"}
            </p>
          </div>
          <div className="status-badge">Live Analytics</div>
        </header>

        {/* This is where your mapped route components will go */}
        <div className="dashboard-grid">
          {childrens[activeTab]}
        </div>
      </main>
    </div>
  );
}

export default AnalyticsDashBoardV2;
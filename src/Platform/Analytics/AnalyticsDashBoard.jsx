
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
const teamData= [
    {
      "userId": "68a9f7f1eda6ac5064a5d87e",
      "totalTodo": 0,
      "todoTickets": [],
      "totalInProgress": 1,
      "inProgressTickets": [
        {
          "ticketKey": "TASK-2-hora-sprint-analytics-integration-suite",
          "timeLogs": [
            {
              "minutes": 360,
              "note": "",
              "_id": "697ae011ac83532745b0c746",
              "at": "2026-01-29T04:20:33.556Z"
            }
          ],
          "tags": [
            "1768384386137"
          ],
          "priority": [
            "3"
          ],
          "sprintName": "Sprint-1",
          "status": "In Progress",
          "storyPoint": 22,
          "title": "Hora Sprint Analytics & Integration Suite"
        }
      ],
      "totalTesting": 0,
      "testingTickets": [],
      "totalCompleted": 2,
      "completedTickets": [
        {
          "ticketKey": "ARCH-17-replace-hardcoded-ticket-metadata-with-a-dynamic-p",
          "timeLogs": [],
          "tags": [
            "1768384386137"
          ],
          "priority": [
            "3"
          ],
          "sprintName": "Sprint-1",
          "status": "Done",
          "storyPoint": 0,
          "title": "Replace hardcoded ticket metadata with a dynamic \"Project Configuration\" system."
        },
        {
          "ticketKey": "TASK-1-m1-release-18-jan",
          "timeLogs": [
            {
              "minutes": 480,
              "note": "",
              "_id": "696daa80adc2f0457f35edd4",
              "at": "2026-01-19T03:52:32.647Z"
            }
          ],
          "tags": [
            "1768384386137"
          ],
          "priority": [
            "2"
          ],
          "sprintName": "Sprint-1",
          "status": "Done",
          "storyPoint": 0,
          "title": "M1 Release -18 jan"
        }
      ],
      "totalMinutes": 840,
      "totalStoryPoints": 22,
      "allTickets": [
        {
          "ticketKey": "ARCH-17-replace-hardcoded-ticket-metadata-with-a-dynamic-p",
          "timeLogs": [],
          "tags": [
            "1768384386137"
          ],
          "priority": [
            "3"
          ],
          "sprintName": "Sprint-1",
          "status": "Done",
          "storyPoint": 0,
          "title": "Replace hardcoded ticket metadata with a dynamic \"Project Configuration\" system."
        },
        {
          "ticketKey": "TASK-1-m1-release-18-jan",
          "timeLogs": [
            {
              "minutes": 480,
              "note": "",
              "_id": "696daa80adc2f0457f35edd4",
              "at": "2026-01-19T03:52:32.647Z"
            }
          ],
          "tags": [
            "1768384386137"
          ],
          "priority": [
            "2"
          ],
          "sprintName": "Sprint-1",
          "status": "Done",
          "storyPoint": 0,
          "title": "M1 Release -18 jan"
        },
        {
          "ticketKey": "TASK-2-hora-sprint-analytics-integration-suite",
          "timeLogs": [
            {
              "minutes": 360,
              "note": "",
              "_id": "697ae011ac83532745b0c746",
              "at": "2026-01-29T04:20:33.556Z"
            }
          ],
          "tags": [
            "1768384386137"
          ],
          "priority": [
            "3"
          ],
          "sprintName": "Sprint-1",
          "status": "In Progress",
          "storyPoint": 22,
          "title": "Hora Sprint Analytics & Integration Suite"
        }
      ],
      "isTopContributor": true
    }
  ]

// Your actual response data
const analyticsResponse = {
  "success": true,
  "analytics": {
    "summary": {
      "title": "Sprint Performance Overview",
      "description": "The current sprint (ID: 2ef11e63...) shows critical performance with zero velocity and task completion. With only one day remaining, significant intervention is required to deliver any planned work. This report lacks historical context for comparative analysis.",
      "status": "CRITICAL",
      "insights": [
        "Current sprint has 0 story points completed and 0% task completion with 1 day remaining.",
        "Only 3 out of 27 tasks have been resolved, with none marked as truly 'completed' or 'closed'.",
        "The lack of historical data prevents meaningful trend analysis and accurate future forecasting."
      ]
    },
    "metrics": {
      "velocity": {
        "current": 0,
        "average": 0
      },
      "completionRate": {
        "current": 0,
        "average": 0
      },
      "planningAccuracy": {
        "current": 0,
        "average": 0
      },
      "taskDensity": {
        "current": 3.67,
        "average": 0
      },
      "efficiency": {
        "current": 0.11,
        "average": 0
      }
    },
    "charts": {
      "line": {
        "labels": [
          "Sprint 2ef11e63"
        ],
        "datasets": [
          {
            "label": "Velocity",
            "data": [0]
          },
          {
            "label": "Completion Rate",
            "data": [0]
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
        "current": [0, 0, 3.67, 0, 0.11],
        "average": [0, 0, 0, 0, 0]
      },
      "gantt": [
        {
          "id": "development",
          "label": "Development",
          "start": 0,
          "duration": 9,
          "status": "stalled"
        },
        {
          "id": "testing",
          "label": "Testing",
          "start": 7,
          "duration": 2,
          "status": "stalled"
        },
        {
          "id": "deployment",
          "label": "Deployment",
          "start": 9,
          "duration": 1,
          "status": "planned"
        }
      ],
      "quadrant": [
        {
          "label": "Sprint Backlog",
          "effort": 99,
          "value": 0,
          "quadrant": "High Effort Low Value"
        }
      ]
    },
    "forecast": {
      "predictedCapacity": 0,
      "confidenceLevel": "VERY_LOW",
      "confidenceText": "Future capacity prediction is unreliable due to insufficient historical data and zero completion in the current sprint."
    },
    "warnings": [
      {
        "code": "NO_HISTORICAL_DATA",
        "level": "info",
        "message": "No historical sprint data available for comparison. All average metrics are set to 0."
      },
      {
        "code": "CRITICAL_SPRINT_PERFORMANCE",
        "level": "critical",
        "message": "Current sprint has 0 story points completed and 0% task completion with only 1 day remaining."
      },
      {
        "code": "STALLED_PROGRESS",
        "level": "critical",
        "message": "Despite 3 tasks being marked as 'resolved', no tasks have reached 'completed' or 'closed' status, indicating significant workflow blockage."
      }
    ]
  }
};

// Example with better data
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
  }

  if (loading) {
    return (
      <div className="dashboard-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="status-badge">Analyzing Sprint Data...</div>
      </div>
    );
  }

  return (
  <div className="dashboard-wrapper">
      {/* LEFT SIDEBAR */}
      <aside className="analytics-sidebar">
        <div className="go-back-link" onClick={() => navigate(`/work-space/confrigurator`)}> 
          <MoveLeftIcon size={20} />
          <span>Go Back</span>
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
          <h1>Algorand Metrics Dashboard</h1>
          <div className="status-badge">Connected</div>
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
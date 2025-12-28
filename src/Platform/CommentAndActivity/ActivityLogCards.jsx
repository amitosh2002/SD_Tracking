import React from 'react'
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
import { formatCreatedAtDate } from '../../utillity/helper';
const ActivityLogCards = ({activity}) => {

    console.log(activity)

const RenderLogs = (activity,type)=>{

    switch(type){

        case "ADD_TIME_LOG" :
            {
                return (
                      <>
                      
                        <div
                    className="activity-icon"
                    style={{
                      backgroundColor:"white",
                      color:'rebeccapurple'
                    }}
                  >
                    <Clock size={23}/>
                  </div>
                           <div className="activity-content">
                    <div className="activity-header">
                      <div className="avatar-small">{activity?.performedBy?.name[0]}</div>
                      <span className="user">{activity?.performedBy?.name}</span>
                      <span className="action">{activity?.actionType}</span>

                      {/* {activity.from && (
                        <>
                          <span className="status-badge">{activity.from}</span>
                          <span className="action">to</span>
                          <span
                            className="status-badge"
                            style={{
                              background: `${activity.color}15`,
                              color: activity.color
                            }}
                          >
                            {activity.to}
                          </span>
                        </>
                      )} */}
                      {/* {activity.assignee && (
                        <span className="user">{activity.assignee}</span>
                      )}
                      {activity.tag && (
                        <span
                          className="status-badge"
                          style={{
                            background: `${activity.color}15`,
                            color: activity.color
                          }}
                        >
                          {activity.tag}
                        </span>
                      )} */}
                        
                    </div>
                      <span
                          className="action"
                          style={{
                            background: `${activity.color}15`,
                            color: activity.color
                          }}
                        >
                          {activity?.performedBy?.name} added the time log of {activity?.changes?.newValue} minutes
                        </span>
                    <div className="activity-time">
                        
                      <Clock size={12} />
                      <span>{formatCreatedAtDate(activity?.createdAt)}</span>
                    </div>
                  </div></>
                    
                )
            }

    }


}

  return (
    <div> <div key={activity.id} className="activity-item">
              
               

                  {RenderLogs(activity,activity.actionType)}
                </div></div>
  )
}

export default ActivityLogCards
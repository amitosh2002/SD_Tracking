import React, { useEffect } from 'react';
import { Play, Pause, Activity } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectServicesByIdAction, updateServiceStatusAction } from '../../Redux/Actions/PlatformActions.js/projectsActions';
import CircularLoader from '../../customFiles/customComponent/Loader/circularLoader';
import lampSvg from "../../assets/platformIcons/Hora/lamp.svg"
function RunningJobs({projectId}) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getProjectServicesByIdAction(projectId));
    return () => {
      dispatch({ type: 'RESET_PROJECT_SERVICES' });
    };
  }, [projectId, dispatch]);

  // ========================= Fetching Reducer Data=============
  const { currentProjectService, loading } = useSelector((state) => state.serviceV1);

  // Handle toggle for a specific service
  const handleToggle = (serviceId, currentStatus) => {
    // Dispatch action with current status - backend will toggle it
    dispatch(updateServiceStatusAction(projectId, serviceId, currentStatus));
  };
  
  return (
    <div className="section-container">
      {loading ? (
        <div className="">
          <CircularLoader/>
        </div>
      ) : (
        <div className="jobs-list">
          {Array.isArray(currentProjectService) && currentProjectService.length > 0 ? (
            currentProjectService.map((service) => (
              <div key={service._id} className="job-card professional-card">
                <div className="job-info">
                  <div className={`job-icon-container ${service.isActive ? 'active' : ''}`}>
                    <Activity size={20} className={service.isActive ? "anim-pulse" : ""} />
                  </div>
                  <div className="job-details">
                    <div className="job-header">
                      <span className="job-name">{service?.service?.name}</span>
                      <span className={`status-badge ${service?.isActive ? 'running' : 'paused'}`}>
                        {service?.status?.toUpperCase()}
                      </span>
                    </div>
                    <p className="job-desc">
                      {service?.service?.description}
                    </p>
                  </div>
                </div>
                <div className="job-actions">
                  <button 
                    className={`toggle-button ${service?.isActive ? 'active' : ''}`}
                    onClick={() => handleToggle(service?.service?.serviceId, !service?.isActive)}
                    title={service?.isActive ? "Pause Job" : "Start Job"}
                  >
                    <div className="toggle-track">
                      <div className="toggle-thumb">
                        {service.isActive ? <Pause size={10} /> : <Play size={10} />}
                      </div>
                    </div>
                    <span className="toggle-text">{service.isActive ? 'Running' : 'Paused'}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="" style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",width:"100%",flexDirection:"column"}}> 
            <img src={lampSvg} alt="" />
              <p style={{color:"#08293cff",fontSize:"24px",fontWeight:"500",marginTop:"10px"}}>No services found for this project.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RunningJobs;
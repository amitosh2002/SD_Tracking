import React, { useEffect } from 'react';
import { Zap, Plus, Settings2, StopCircleIcon, PlayCircle, HelpCircleIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import CircularLoader from '../../customFiles/customComponent/Loader/circularLoader';
import { associateServiceToProjectAction, getAllHoraServiceAction } from '../../Redux/Actions/PlatformActions.js/projectsActions';
import { SHOW_SNACKBAR } from '../../Redux/Constants/PlatformConstatnt/platformConstant';

function Automations({projectId}) {

  const{allHoraService,loading,error}= useSelector((state)=>state.serviceV1)  
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(getAllHoraServiceAction(projectId))
  },[dispatch,projectId])

  if (loading) {
    return <div><CircularLoader/></div>
  }
  console.log(allHoraService)

  const handleAddService=(serviceId)=>{
    if (!serviceId) {
      dispatch({
        type:SHOW_SNACKBAR,
        payload:{
          type:error,
          msg:"Invalid service !"
        }
      })
    }
    dispatch(associateServiceToProjectAction(projectId,serviceId))
  }

  return (
    <div className="section-container">
      <div className="jobs-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {allHoraService && allHoraService.length > 0 ? (
          allHoraService.map((service) => (
            <div key={service.serviceId} className="job-card professional-card">
              <div className="job-info">
                <div className={`job-icon-container ${service.status === 'ACTIVE' ? 'active' : ''}`}>
                  <Zap size={20} />
                </div>
                <div className="job-details">
                  <div className="job-header">
                    <span className="job-name">{service.name}</span>
                    {service.planType !== 'FREE' && (
                      <span className="paid-tag">Paid</span>
                    )}
                  </div>
                  <p className="job-desc">
                    {service.description || "No description available for this service."}
                  </p>
                </div>
              </div>
              
              <div className="job-actions">
                <button className="icon-button" title="Service Settings">
                  <Settings2 size={16} />
                </button>
                {
                  service?.isRunning ? (
                    <div className='service-card-btn'>
                    <p className='running_text' >Running</p>

                    <button className="icon-button" title="Stop Service">
                      <HelpCircleIcon size={16} />
                    </button>
                    </div>
                  ) : (
                    <button className={`service-card-btn ${service.planType === 'FREE' ? 'free' : 'paid'}`} onClick={()=>handleAddService(service?.serviceId)}>
                     <Plus size={16} />
                     {service.planType === 'FREE' ? 'Activate' : 'Sumbit Req'}
                   </button>
                  )
                }
             
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No automation services found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Automations;
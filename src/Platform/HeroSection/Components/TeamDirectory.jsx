import { Users, Briefcase, Mail, ShieldCheck, ExternalLink, MoreVertical } from 'lucide-react';
import './styles/TeamDirectory.scss';
import { useNavigate } from 'react-router-dom';

const TeamDirectory = ({ projects }) => {
  const navigate = useNavigate();
 
  return (
    <div className="team-container">
         <div className="projects-flex-wrapper">
        {projects?.map((project) => (
          <div key={project.projectId} className="project-group-card">
            <div className="project-card-header">
              <div className="title-box">
                <div className="icon-wrap"><Briefcase size={18} /></div>
                <h3>{project.projectName}</h3>
              </div>
              <div className="header-right">
                <span className="member-pill">{project.members.length} Members</span>
                <button className="menu-btn"><MoreVertical size={16} /></button>
              </div>
            </div>

            <div className="members-flex-list">
              {project.members.map((member) => (
                <div key={member._id} className="member-flex-item">
                  <div className="avatar-section">
                    {member.profile?.avatar ? (
                      <img src={member.profile.avatar} alt={member.username} />
                    ) : (
                      <div className="initials">{member.username?.[0] || 'U'}</div>
                    )}
                    <span className="online-indicator"></span>
                  </div>
                  
                  <div className="info-section">
                    <p className="name">{member.username}</p>
                    <p className="email">{member.email}</p>
                  </div>

                  <button className="verify-btn" title="Verified Member">
                    <ShieldCheck size={16} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="project-card-footer">
               <button className="footer-action-btn" onClick={()=>navigate(`/projects/${project?.projectId}/tasks`)}>
                 View Workspace <ExternalLink size={14} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>  
  );
};

export default TeamDirectory;
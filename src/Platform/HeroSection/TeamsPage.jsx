// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Users, Search } from 'lucide-react';
// import { getUserTeamMembers } from '../../Redux/Actions/PlatformActions.js/userActions';
// import TeamDirectory from './Components/TeamDirectory';
// import './styles/TeamsPage.scss';

// const TeamsPage = () => {
//     const dispatch = useDispatch();
//     const { teamMembers } = useSelector((state) => state.user);
//     const [searchTerm, setSearchTerm] = useState('');

//     useEffect(() => {
//         dispatch(getUserTeamMembers());
//     }, [dispatch]);

//     const filteredProjects = teamMembers?.filter(project => 
//         project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         project.members.some(member => 
//             member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             member.email.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//     ) || [];

//     return (
//         <div className="teams-page-container">
//             <header className="teams-page-header">
//                 <div className="header-content">
//                     <div className="title-section">
//                         <h1><Users size={28} /> Workspace Teams</h1>
//                         <p>Access and browse all project team members and their assignments.</p>
//                     </div>
//                     <div className="header-actions">
//                         <div className="search-box">
//                             <Search size={18} />
//                             <input 
//                                 type="text" 
//                                 placeholder="Search projects or members..." 
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             {teamMembers && teamMembers.length > 0 ? (
//                 <TeamDirectory projects={filteredProjects} />
//             ) : (
//                 <div className="teams-page-empty">
//                     <Users size={64} />
//                     <h2>No Teams Found</h2>
//                     <p>You are not assigned to any project teams yet.</p>
//                 </div>
//             )}

//             {filteredProjects.length === 0 && teamMembers?.length > 0 && (
//                 <div className="no-results">
//                     <p>No projects or members match your search "{searchTerm}"</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TeamsPage;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Users, Filter, ChevronDown } from 'lucide-react';
import { getUserTeamMembers } from '../../Redux/Actions/PlatformActions.js/userActions';
import TeamDirectory from './Components/TeamDirectory';
import './styles/TeamsPage.scss';

const TeamsPage = () => {
    const dispatch = useDispatch();
    const { teamMembers } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        dispatch(getUserTeamMembers());
    }, [dispatch]);

    // Filter projects and members
    const filteredProjects = teamMembers?.filter(project => {
        const matchesSearch = 
            project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.members.some(member => 
                member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${member.profile?.firstName} ${member.profile?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        
        const matchesStatus = statusFilter === 'All' || project.status === statusFilter.toLowerCase();
        
        return matchesSearch && matchesStatus;
    }) || [];

    return (
        <div className="teams-page">
            {/* Header */}
            <div className="teams-header">
                <div className="teams-header__left">
                    <h1 className="teams-header__title">
                        <Users size={28} />
                        Team Directory
                    </h1>
                    <p className="teams-header__subtitle">
                        View and manage all team members across projects
                    </p>
                </div>
                <button className="teams-btn teams-btn--primary">
                    <Users size={16} />
                    Invite Member
                </button>
            </div>

            {/* Toolbar */}
            <div className="teams-toolbar">
                <div className="teams-search">
                    <Search size={18} className="teams-search__icon" />
                    <input
                        type="text"
                        className="teams-search__input"
                        placeholder="Search members or projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="teams-filters">
                    <button className="teams-filter-btn">
                        <span>Role</span>
                        <ChevronDown size={14} />
                    </button>
                    <button className="teams-filter-btn">
                        <span>Status</span>
                        <ChevronDown size={14} />
                    </button>
                    <button className="teams-filter-btn">
                        <span>Member</span>
                        <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {teamMembers && teamMembers.length > 0 ? (
                <TeamDirectory projects={filteredProjects} searchTerm={searchTerm} />
            ) : (
                <div className="teams-empty">
                    <div className="teams-empty__icon">
                        <Users size={48} />
                    </div>
                    <h2 className="teams-empty__title">No Teams Found</h2>
                    <p className="teams-empty__desc">You are not assigned to any project teams yet.</p>
                </div>
            )}

            {filteredProjects.length === 0 && teamMembers?.length > 0 && (
                <div className="teams-no-results">
                    <p>No projects or members match your search "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
};

export default TeamsPage;
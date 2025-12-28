import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Search } from 'lucide-react';
import { getUserTeamMembers } from '../../Redux/Actions/PlatformActions.js/userActions';
import TeamDirectory from './Components/TeamDirectory';
import './styles/TeamsPage.scss';

const TeamsPage = () => {
    const dispatch = useDispatch();
    const { teamMembers } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getUserTeamMembers());
    }, [dispatch]);

    const filteredProjects = teamMembers?.filter(project => 
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.members.some(member => 
            member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) || [];

    return (
        <div className="teams-page-container">
            <header className="teams-page-header">
                <div className="header-content">
                    <div className="title-section">
                        <h1><Users size={28} /> Workspace Teams</h1>
                        <p>Access and browse all project team members and their assignments.</p>
                    </div>
                    <div className="header-actions">
                        <div className="search-box">
                            <Search size={18} />
                            <input 
                                type="text" 
                                placeholder="Search projects or members..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {teamMembers && teamMembers.length > 0 ? (
                <TeamDirectory projects={filteredProjects} />
            ) : (
                <div className="teams-page-empty">
                    <Users size={64} />
                    <h2>No Teams Found</h2>
                    <p>You are not assigned to any project teams yet.</p>
                </div>
            )}

            {filteredProjects.length === 0 && teamMembers?.length > 0 && (
                <div className="no-results">
                    <p>No projects or members match your search "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
};

export default TeamsPage;

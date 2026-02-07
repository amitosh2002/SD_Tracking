import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, MoreVertical } from 'lucide-react';
import './styles/TeamDirectory.scss';

const TeamDirectory = ({ projects }) => {
    const [expandedProjects, setExpandedProjects] = useState(
        projects.reduce((acc, project) => ({ ...acc, [project.projectId]: true }), {})
    );

    const toggleProject = (projectId) => {
        setExpandedProjects(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }));
    };

    // Get initials from name
    const getInitials = (firstName, lastName) => {
        const first = firstName?.charAt(0) || '';
        const last = lastName?.charAt(0) || '';
        return (first + last).toUpperCase() || '?';
    };

    // Generate avatar color based on name
    const getAvatarColor = (name) => {
        const colors = [
            '#6366f1', // indigo
            '#10b981', // green
            '#f59e0b', // amber
            '#ef4444', // red
            '#8b5cf6', // purple
            '#3b82f6', // blue
            '#ec4899', // pink
            '#14b8a6', // teal
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    // Get collaborator initials/avatars (small circles)
    const getCollaboratorAvatars = (members, excludeId) => {
        return members
            .filter(m => m._id !== excludeId)
            .slice(0, 3)
            .map((member, idx) => {
                const initials = getInitials(member.profile?.firstName, member.profile?.lastName);
                const color = getAvatarColor(member.username);
                
                if (member.profile?.avatar) {
                    return (
                        <img
                            key={member._id}
                            src={member.profile.avatar}
                            alt={member.username}
                            className="collab-avatar"
                            style={{ zIndex: 3 - idx }}
                        />
                    );
                }
                
                return (
                    <div
                        key={member._id}
                        className="collab-avatar collab-avatar--initials"
                        style={{ backgroundColor: color, zIndex: 3 - idx }}
                    >
                        {initials}
                    </div>
                );
            });
    };

    const getAccessType = (accessType) => {
        switch (accessType) {
            case 400:
                return 'Owner';
            case 300:
                return 'Manager';
            case 200:
                return 'Team Lead';
            case 100:
                return 'Employee';
            default:
                return 'Member';
        }
    };

    return (
        <div className="team-directory">
            {projects.map((project) => {
                const isExpanded = expandedProjects[project.projectId];
                
                return (
                    <div key={project.projectId} className="team-section">
                        {/* Section Header */}
                        <div className="team-section__header" onClick={() => toggleProject(project.projectId)}>
                            <div className="team-section__title">
                                {project.projectName.toUpperCase()}
                            </div>
                            <button className="team-section__toggle">
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                        </div>

                        {/* Members Grid */}
                        {isExpanded && (
                            <div className="team-grid">
                                {project.members.map((member) => {
                                    const fullName = `${member.profile?.firstName || ''} ${member.profile?.lastName || ''}`.trim();
                                    const initials = getInitials(member.profile?.firstName, member.profile?.lastName);
                                    const avatarColor = getAvatarColor(member.username);
                                    const collaborators = getCollaboratorAvatars(project.members, member._id);

                                    return (
                                        <div key={member._id} className="member-card">
                                            {/* Collaborators */}
                                            {collaborators.length > 0 && (
                                                <div className="member-card__collabs">
                                                    {collaborators}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="member-card__actions">
                                                <button className="member-card__action">
                                                    <MessageSquare size={16} />
                                                </button>
                                                <button className="member-card__action">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>

                                            {/* Avatar */}
                                            <div className="member-card__avatar-wrapper">
                                                {member.profile?.avatar ? (
                                                    <img
                                                        src={member.profile.avatar}
                                                        alt={fullName || member.username}
                                                        className="member-card__avatar"
                                                    />
                                                ) : (
                                                    <div
                                                        className="member-card__avatar member-card__avatar--initials"
                                                        style={{ backgroundColor: avatarColor }}
                                                    >
                                                        {initials}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="member-card__info">
                                                <h3 className="member-card__name">
                                                    {fullName || member.username}
                                                </h3>
                                                <p className="member-card__role">
                                                    {getAccessType(member.accessType)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TeamDirectory;
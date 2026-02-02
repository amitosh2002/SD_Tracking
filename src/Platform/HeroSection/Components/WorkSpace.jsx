import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProjectCreationFlow from "../../GenerailForms/projectCreationFlow";
import ProjectCard from "./projectCard";
import { getAllProjects } from "../../../Redux/Actions/PlatformActions.js/projectsActions";

const WorkSpace = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Better selectors
  const userDetails = useSelector((state) => state.user.userDetails);
  const projects = useSelector((state) => state.projects.projects);
  const projectCreateSucess = useSelector((state) => state.projects.projectCreateSucess);
    const [createProject, setCreateProject] = useState(false);
  
  // Track if we've fetched projects
  const hasFetchedProjects = useRef(false);
  // Fetch Projects - Only once when user is available
  useEffect(() => {
    if (userDetails?.id && !hasFetchedProjects.current) {
      hasFetchedProjects.current = true;
      dispatch(getAllProjects(userDetails.id));
    }
  }, [userDetails?.id, dispatch]);

  return (
     <section className="projects">
            <div className="projects__header">
              <h2 className="projects__title">My Recent Projects</h2>
            </div>

            {projects && !createProject && projects.length > 0 ? (
              <div className="projects__grid">
                {projects.map((project) => (
                  <div 
                    key={project._id} 
                    onClick={() => {
                      navigate(`/projects/${project?.projectId}/tasks`);
                    }}
                  >
              
                    <ProjectCard project={project}/>
                  
                  </div>
                ))}
              </div>
            ) : (
              !createProject && <ProjectCreationFlow />
            )}

            {createProject && <ProjectCreationFlow createNew={createProject} />}
          </section>
  )
}

export default WorkSpace
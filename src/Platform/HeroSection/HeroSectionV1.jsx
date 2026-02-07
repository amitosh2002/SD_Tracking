import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProjects } from '../../Redux/Actions/PlatformActions.js/projectsActions';
import UserDashboard from './Components/userDashboard';
import "./styles/herosection.scss";

const HoraDashboard = () => {
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.user.userDetails);
  const projectCreateSucess = useSelector((state) => state.projects.projectCreateSucess);

  const hasFetchedProjects = useRef(false);

  /* ---------- fetch projects ---------- */
  useEffect(() => {
    if (userDetails?.id && !hasFetchedProjects.current) {
      hasFetchedProjects.current = true;
      dispatch(getAllProjects(userDetails.id));
    }
  }, [userDetails?.id, dispatch]);

  useEffect(() => {
    if (projectCreateSucess && userDetails?.id) {
      dispatch(getAllProjects(userDetails.id));
    }
  }, [projectCreateSucess, userDetails?.id, dispatch]);

  return <UserDashboard />;
};

export default HoraDashboard;


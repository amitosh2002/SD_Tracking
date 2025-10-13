import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getTicketById } from '../../Redux/Actions/TicketActions/ticketAction';
import TaskDetails from './TaskDetails';
// import { useCallback } from 'react';
import { useEffect } from 'react';
import HoraLoader from '../../customFiles/customComponent/Loader/loaderV1';
import CircularLoader from '../../customFiles/customComponent/Loader/circularLoader';

const TicketPage = () => {
  const taskId=useParams().id;
  const dispatch = useDispatch();
  const { selectedTicket } = useSelector((state) => state.worksTicket);

   useEffect(()=>{

        if(taskId){
            dispatch(getTicketById(taskId));
            // setLoading(false);
        }
        // setLoading(true);
    },[taskId,dispatch])
  if (!selectedTicket) {
    return (
      <div style={{ padding: '16px' }}>Loading ticket...</div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <TaskDetails task={selectedTicket} />
      {/* <CircularLoader/> */}
    </div>
  );
};

export default TicketPage;



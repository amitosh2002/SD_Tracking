import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getTicketById } from '../../Redux/Actions/TicketActions/ticketAction';
import TaskDetails from './TaskDetails';

const TicketPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedTicket } = useSelector((state) => state.worksTicket);

  useEffect(() => {
    if (id) {
      dispatch(getTicketById(id));
    }
  }, [id, dispatch]);

  if (!selectedTicket) {
    return (
      <div style={{ padding: '16px' }}>Loading ticket...</div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <TaskDetails task={selectedTicket} />
    </div>
  );
};

export default TicketPage;



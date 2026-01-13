import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './TaskManager.scss';
import TaskItem from './TaskItem';
import TaskDetails from './TaskDetails';
import { useDispatch, useSelector } from 'react-redux';
import { getAllWorkTicket, getSortKeyValues } from '../../Redux/Actions/TicketActions/ticketAction';
import { Loader2 } from 'lucide-react';
import FilterBar from './Components/filterBar';

const TaskManager = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  const { tickets,users,status,projects,sprints } = useSelector((state) => state.worksTicket);
  const { projectId } = useParams();
  console.log(users,projects,sprints,status)
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observerLoader = useRef();
  
  // Sentinel-based observer
  const sentinelRef = useCallback(node => {
    if (loadingMore || !hasMore) return;
    if (observerLoader.current) observerLoader.current.disconnect();
    
    observerLoader.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        console.log("Sentinel intersected, incrementing limit...");
        setCurrentLimit(prev => prev + 10);
      }
    }, { 
      threshold: 0,
      rootMargin: '100px'
    });
    
    if (node) observerLoader.current.observe(node);
  }, [loadingMore, hasMore]);


  
const [filters, setFilters] = useState({
  status: [],
  sprint: [],
  assignee: [],
  project: [],
  sort: "updatedAt",
});
console.log(filters)

  // Reset on Project/User/Filter Switch
  useEffect(() => {
    console.log("Project, user, or filters changed, resetting limit...");
    setCurrentLimit(10);
    setHasMore(true);
  }, [projectId, userDetails?.id, filters]);

  // Initial data fetch for dropdowns
  useEffect(() => {
    if (userDetails?.id) {
       dispatch(getSortKeyValues());
    }
  }, [dispatch, userDetails?.id]);

  // Fetch Logic


  useEffect(() => {
    if (!userDetails?.id) return;
    const fetchTickets = async () => {
      const isInitial = currentLimit === 10;
      if (!isInitial) setLoadingMore(true);
      
      console.log(`Fetching tickets with limit: ${currentLimit}, isInitial: ${isInitial}`);
      
      const fetchParams = projectId 
        ? { projectId, userId: userDetails.id, page: 1, limit: currentLimit } 
        : { userId: userDetails.id, page: 1, limit: currentLimit };

      try {
        const res = await dispatch(getAllWorkTicket({ 
            ...fetchParams, 
            ...filters,
            type: isInitial ? 'refresh' : 'append' 
        }));
        
        console.log("API Response:", res);
        
        const totalItems = res?.total || 0;
        const currentItemsCount = res?.items?.length || 0;

        // Correct hasMore logic for cumulative limits
        // We have more if the total in backend is greater than what we currently requested
        if (totalItems > currentLimit && currentItemsCount >= currentLimit) {
            setHasMore(true);
        } else {
            setHasMore(false);
        }
        
      } catch (err) {
        console.error("Fetch failed:", err);
        setHasMore(false);
      } finally {
        if (!isInitial) setLoadingMore(false);
      }
    };

    fetchTickets();
  }, [dispatch, currentLimit, projectId, userDetails?.id,filters]);

  // Auto-select first task only when the initial list loads
  useEffect(() => {
    if (tickets?.items?.length > 0 && !selectedTaskId && currentLimit === 10) {
      setSelectedTaskId(tickets.items[0]?._id);
    }
  }, [tickets?.items, selectedTaskId, currentLimit]);

  const selectedTask = tickets?.items?.find((task) => task?._id === selectedTaskId);


  const sortOptions = [
    { label: "Updated", value: "updatedAt" },
    { label: "Created", value: "createdAt" },
  ];
const onFilterChange = (key, value) => {
  setFilters(prev => ({
    ...prev,
    [key]: value,
  }));
};


const [search, setSearch] = useState("");


  return (
    <>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFilterChange={onFilterChange}
        statusOptions={status}
        sprintOptions={sprints}
        assigneeOptions={users}
        projectOptions={projects}
        sortOptions={sortOptions}
      />

    <div className="task-manager-container">
      <div className="task-list-panel">
        <div className="task-list-header">
            <h2>Tasks <span>({tickets?.items?.length || 0} / {tickets?.total || 0})</span></h2>
        </div>
        
        <div className="task-items-scroll">

            {Array.isArray(tickets?.items) &&
              tickets.items.map((task) => (
                <div key={task._id} className="task-item-wrapper">
                  <TaskItem
                    task={task}
                    isSelected={selectedTaskId === task?._id}
                    onClick={setSelectedTaskId}
                  />
                </div>
              ))}
            
            {/* Infinite Scroll Sentinel */}
            {hasMore && (
                <div ref={sentinelRef} className="sentinel" style={{ padding: '10px 0', minHeight: '40px' }}>
                    {loadingMore ? (
                        <div className="loading-more-container">
                            <Loader2 className="animate-spin" size={20} />
                            <span>Loading more...</span>
                        </div>
                    ) : (
                        <div style={{ height: '40px' }} /> 
                    )}
                </div>
            )}
            
            {!hasMore && (tickets?.total || 0) > 0 && (
                <div className="end-of-list">
                    <p>No more tasks</p>
                </div>
            )}
            
            {(!tickets?.items || tickets.items.length === 0) && !loadingMore && (
                <div className="placeholder">
                    <p>No tasks found</p>
                </div>
            )}
        </div>
      </div>
      <div className="task-details-panel">
        <TaskDetails task={selectedTask} />
      </div>
    </div>
    </>

  );
};

export default TaskManager;
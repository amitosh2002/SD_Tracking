import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SprintAnalyticsMapping from './SprintAnalyticsMapping';
import AnalyticsControls from './AnalyticsControls';
import { fetchAnalyticsMapping } from '../../Redux/Actions/AnalyticsActions/analyticsMappingActions';
import { Loader2 } from 'lucide-react';


const AnalyticsPage = ({projectId}) => {
  const dispatch = useDispatch();
  const { mapping, loading, isDefault } = useSelector((state) => state.analyticsMapping);
  const [showMapping, setShowMapping] = useState(false);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchAnalyticsMapping(projectId));
    }
  }, [projectId, dispatch]);

  useEffect(() => {
    if (isDefault) {
      setShowMapping(true);
    } else {
      setShowMapping(false);
    }
  }, [isDefault]);

  if (loading && !mapping) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Loader2 className="animate-spin" size={32} color="#667eea" />
      </div>
    );
  }

  return (
    <div className="analytics-page">
      {showMapping ? (
        <SprintAnalyticsMapping 
          projectId={projectId} 
          onCompleted={() => setShowMapping(false)} 
        />
      ) : (
        <AnalyticsControls 
          projectId={projectId} 
          mapping={mapping} 
          onReset={() => setShowMapping(true)}
        />
      )}
    </div>
  );
};

export default AnalyticsPage;
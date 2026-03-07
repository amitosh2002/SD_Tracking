import { useParams, useSearchParams } from "react-router-dom";
import SprintFlowBoardV2 from "../Board/sprintFlowBoardV2";
import SprintFLowBoardV1 from "../Board/sprintFlowBoard";
import ColumnStatusManager from "./BoardConfigration";
import { useState } from "react";

const SprintBoardManager = () => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'FLOW'; // FLOW | BOARD

  // Version toggle state (V1 = Classic, V2 = Visual Designer)
  const [flowVersion, setFlowVersion] = useState(() => {
    return localStorage.getItem('sprint_flow_version') || 'v2';
  });

  const handleToggleVersion = (ver) => {
    setFlowVersion(ver);
    localStorage.setItem('sprint_flow_version', ver);
  };

  /* ================= RENDER ================= */
  return (
    <div className="sprint-board-manager" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Version Toggle Header (Only for FLOW type) */}
      {type === 'FLOW' && (
        <div style={{ 
          padding: '12px 24px', 
          background: '#fff', 
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Sprint Flow Designer</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>Configure how tasks move between columns and statuses</p>
          </div>
          
          <div style={{ 
            display: 'flex', 
            background: '#f1f5f9', 
            padding: '4px', 
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <button 
              onClick={() => handleToggleVersion('v1')}
              style={{
                padding: '6px 14px',
                borderRadius: '7px',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: '0.2s',
                backgroundColor: flowVersion === 'v1' ? '#4F8EF7' : 'transparent',
                color: flowVersion === 'v1' ? '#fff' : '#64748b',
                boxShadow: flowVersion === 'v1' ? '0 2px 4px rgba(79, 142, 247, 0.2)' : 'none'
              }}
            >
              CLASSIC
            </button>
            <button 
              onClick={() => handleToggleVersion('v2')}
              style={{
                padding: '6px 14px',
                borderRadius: '7px',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: '0.2s',
                backgroundColor: flowVersion === 'v2' ? '#4F8EF7' : 'transparent',
                color: flowVersion === 'v2' ? '#fff' : '#64748b',
                boxShadow: flowVersion === 'v2' ? '0 2px 4px rgba(79, 142, 247, 0.2)' : 'none'
              }}
            >
              VISUAL (BETA)
            </button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {type === 'FLOW' ? (
          flowVersion === 'v1' ? (
            <SprintFLowBoardV1 projectId={projectId} />
          ) : (
            <SprintFlowBoardV2 projectId={projectId} />
          )
        ) : (
          <ColumnStatusManager projectId={projectId} />
        )}
      </div>
    </div>
  );
};

export default SprintBoardManager;

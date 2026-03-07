import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectScrumFlow, updateProjectScrumFlow } from '../../../Redux/Actions/SprintActions/sprintActionsV1';

// ─── Palette ───
const P = {
  bg:          "#F8FAFC",
  bgCard:      "#FFFFFF",
  bgPanel:     "#F1F5F9",
  border:      "#E2E8F0",
  borderBright:"#CBD5E1",
  text:        "#1E293B",
  textSub:     "#64748B",
  textMuted:   "#94A3B8",
  accent:      "#3B82F6",
  green:       "#10B981",
  red:         "#EF4444",
  redDim:      "#FEF2F2",
};

const NODE_W = 180;
const NODE_H = 64;

function bezier(x1, y1, x2, y2) {
  const dx = Math.abs(x1 - x2) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

function getBezierMidpoint(x1, y1, x2, y2) {
  const dx = Math.abs(x1 - x2) * 0.5;
  const t = 0.5;
  const cx1 = x1 + dx, cy1 = y1, cx2 = x2 - dx, cy2 = y2;
  const nx = Math.pow(1-t, 3)*x1 + 3*Math.pow(1-t, 2)*t*cx1 + 3*(1-t)*Math.pow(t, 2)*cx2 + Math.pow(t, 3)*x2;
  const ny = Math.pow(1-t, 3)*y1 + 3*Math.pow(1-t, 2)*t*cy1 + 3*(1-t)*Math.pow(t, 2)*cy2 + Math.pow(t, 3)*y2;
  return { x: nx, y: ny };
}

const MappingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m13 18 6-6-6-6" /><circle cx="5" cy="12" r="1" />
  </svg>
);

const Defs = () => (
  <defs>
    {["accent","textSub","green","red"].map(k => (
      <React.Fragment key={k}>
        <marker id={`arrow-end-${k}`} markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,2 L12,6 L0,10 Z" fill={P[k] || P.accent} /></marker>
        <marker id={`arrow-start-${k}`} markerWidth="12" markerHeight="12" refX="2" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M12,2 L0,6 L12,10 Z" fill={P[k] || P.accent} /></marker>
      </React.Fragment>
    ))}
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" /><feOffset dx="0" dy="1" result="offsetblur" /><feComponentTransfer><feFuncA type="linear" slope="0.08" /></feComponentTransfer><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

const SprintFlowBoardV2 = ({ projectId, Flow }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || Flow || "FLOW";

  const { scrumLoading, flowName, statusWorkFlow, boardColumn, ticketFlowTypes = [] } = useSelector((state) => state.sprint);

  const [pan, setPan] = useState({ x: 50, y: 100 });
  const [zoom, setZoom] = useState(1);
  const [draggingNode, setDraggingNode] = useState(null);
  const [panDragging, setPanDragging] = useState(null);
  const [drawing, setDrawing] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [addingStatus, setAddingStatus] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const svgRef = useRef(null);

  useEffect(() => { if (projectId && type === 'FLOW') dispatch(fetchProjectScrumFlow(projectId)); }, [projectId, type, dispatch]);

  const [localConfig, setLocalConfig] = useState({ nodes: [], workflow: {} });
  const originalRef = useRef(null);
  const normalize = (str) => (str || "").toUpperCase().trim().replace(/\s+/g, '_');

  useEffect(() => {
    if (type === 'FLOW' && (boardColumn?.length > 0 || ticketFlowTypes?.length > 0) && !originalRef.current) {
        const initialWorkflow = {};
        if (statusWorkFlow?.workflow) {
          Object.entries(statusWorkFlow.workflow).forEach(([from, targets]) => {
            const key = normalize(from);
            initialWorkflow[key] = (targets || []).map(t => normalize(t));
          });
        }
        const allStatusKeys = new Set();
        boardColumn.forEach(c => (c.statusKeys || []).forEach(k => allStatusKeys.add(normalize(k))));
        ticketFlowTypes.forEach(k => allStatusKeys.add(normalize(k)));

        const nodes = Array.from(allStatusKeys).map((sk, index) => {
          const statusMeta = statusWorkFlow?.statuses?.find(s => normalize(s.key) === sk);
          const rawColor = statusMeta?.color || P.accent;
          const resolvedColor = typeof rawColor === 'object' ? (rawColor.text || rawColor.bg || P.accent) : (rawColor || P.accent);
          return { id: sk, label: statusMeta?.label || sk.replace(/_/g, ' '), color: resolvedColor, x: 50 + index * 240, y: 100 };
        });
        const config = { nodes, workflow: initialWorkflow };
        setLocalConfig(config);
        originalRef.current = JSON.stringify(config);
    }
  }, [statusWorkFlow, boardColumn, ticketFlowTypes, type]);

  const hasChanges = useMemo(() => localConfig && originalRef.current && JSON.stringify(localConfig) !== originalRef.current, [localConfig]);

  const svgPoint = useCallback((e) => {
    const rect = svgRef.current.getBoundingClientRect();
    return { x: (e.clientX - rect.left - pan.x) / zoom, y: (e.clientY - rect.top - pan.y) / zoom };
  }, [pan, zoom]);

  const onSvgMouseMove = (e) => {
    const pt = svgPoint(e);
    if (draggingNode) setLocalConfig(prev => ({ ...prev, nodes: prev.nodes.map(n => n.id === draggingNode.id ? { ...n, x: pt.x - draggingNode.ox, y: pt.y - draggingNode.oy } : n) }));
    if (drawing) setDrawing(d => ({ ...d, curX: pt.x, curY: pt.y }));
    if (panDragging) setPan({ x: e.clientX - panDragging.ox, y: e.clientY - panDragging.oy });
  };

  const completeConnection = useCallback((toId) => {
    setDrawing(currentDrawing => {
      if (!currentDrawing || currentDrawing.fromId === toId) return null;
      const fromId = currentDrawing.fromId;
      setLocalConfig(prev => {
        const next = { ...prev.workflow };
        next[fromId] = [...new Set([...(next[fromId] || []), toId])];
        next[toId] = [...new Set([...(next[toId] || []), fromId])];
        return { ...prev, workflow: next };
      });
      return null;
    });
    setDropTarget(null);
  }, []);

  const removeTransition = (from, to) => {
    setLocalConfig(prev => {
      const next = { ...prev.workflow };
      if (next[from]) next[from] = next[from].filter(x => x !== to);
      if (next[to]) next[to] = next[to].filter(x => x !== from);
      return { ...prev, workflow: next };
    });
  };

  const deleteNode = (nodeId) => {
    setLocalConfig(prev => {
      const nextNodes = prev.nodes.filter(n => n.id !== nodeId);
      const nextWorkflow = { ...prev.workflow };
      delete nextWorkflow[nodeId];
      Object.keys(nextWorkflow).forEach(k => { nextWorkflow[k] = nextWorkflow[k].filter(t => t !== nodeId); });
      return { nodes: nextNodes, workflow: nextWorkflow };
    });
  };

  const isStatusUnmapped = useCallback((nodeId) => {
    const hasFrom = (localConfig.workflow[nodeId] || []).length > 0;
    const hasTo = Object.values(localConfig.workflow).some(targets => targets.includes(nodeId));
    return !hasFrom && !hasTo;
  }, [localConfig]);

  const renderedPairs = useMemo(() => {
    const pairs = [];
    const processed = new Set();
    Object.entries(localConfig.workflow).forEach(([from, targets]) => {
      (targets || []).forEach(to => {
        const key = [from, to].sort().join("<>");
        if (!processed.has(key)) {
          const isBi = localConfig.workflow[to]?.includes(from);
          pairs.push({ from, to, isBi });
          processed.add(key);
        }
      });
    });
    return pairs;
  }, [localConfig.workflow]);

  if (scrumLoading && !localConfig.nodes.length) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <div style={{ width: "100%", height: "100vh", background: P.bg, display: "flex", flexDirection: "column", overflow: 'hidden' }}>
      <div style={{ height: 60, background: 'white', borderBottom: `1px solid ${P.border}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, zIndex: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: P.text }}>{flowName || "Workflow Designer"}</h3>
        <button onClick={() => setAddingStatus(true)} style={{ background: P.accent, color: 'white', border: 'none', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontWeight: 800 }}>+ Add Status</button>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', background: P.bgPanel, borderRadius: 10, padding: '4px 8px', gap: 8 }}>
          <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} style={{ border: 'none', background: 'white', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontWeight: 900 }}>-</button>
          <span style={{ fontSize: 11, fontWeight: 900, minWidth: 34, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} style={{ border: 'none', background: 'white', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontWeight: 900 }}>+</button>
        </div>
        <button onClick={() => {
            const payloadColumns = localConfig.nodes.map((n, i) => {
              const c = typeof n.color === 'object' ? (n.color.text || n.color.bg || P.accent) : (n.color || P.accent);
              return { name: normalize(n.label), statusKeys: [n.id], color: c, order: i };
            });
            dispatch(updateProjectScrumFlow(projectId, { name: normalize(flowName || "PROJECT_FLOW"), columns: payloadColumns, workflow: localConfig.workflow }));
            originalRef.current = JSON.stringify(localConfig);
          }} disabled={!hasChanges} style={{ background: hasChanges ? P.green : P.bgPanel, color: hasChanges ? 'white' : P.textSub, border: 'none', padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontWeight: 800 }}>{hasChanges ? "Save Workflow" : "Saved"}</button>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'auto', background: P.bg }}>
          <svg 
            ref={svgRef} width="3000" height="2000"
            onMouseMove={onSvgMouseMove} 
            onMouseUp={() => { setDrawing(null); setDraggingNode(null); setPanDragging(null); setDropTarget(null); }} 
            onMouseDown={(e) => { if (e.button === 0 && e.ctrlKey || e.button === 1 || e.button === 2) setPanDragging({ ox: e.clientX - pan.x, oy: e.clientY - pan.y }); }} 
            onContextMenu={e => e.preventDefault()}
            style={{ cursor: panDragging ? 'grabbing' : 'default' }}
          >
            <Defs />
            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#E2E8F0"/></pattern>
              <rect x="-10000" y="-10000" width="20000" height="20000" fill="url(#grid)" />
              
              {renderedPairs.map(({from, to, isBi}) => {
                const nFrom = localConfig.nodes.find(n => n.id === from), nTo = localConfig.nodes.find(n => n.id === to);
                if (!nFrom || !nTo) return null;
                const fX = nFrom.x + NODE_W, fY = nFrom.y + NODE_H/2, tX = nTo.x, tY = nTo.y + NODE_H/2, mid = getBezierMidpoint(fX, fY, tX, tY);
                return (
                  <g key={`${from}-${to}`}>
                    <path d={bezier(fX, fY, tX, tY)} fill="none" stroke={P.accent} strokeWidth={3} markerEnd="url(#arrow-end-accent)" markerStart={isBi ? "url(#arrow-start-accent)" : ""} style={{ pointerEvents: 'none' }} />
                    <g transform={`translate(${mid.x}, ${mid.y})`} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); removeTransition(from, to); }}>
                       <circle r={10} fill="white" stroke={P.red} strokeWidth={1.5} /><text x="-4" y={4} fill={P.red} fontSize={12} fontWeight={900}>×</text>
                    </g>
                  </g>
                );
              })}

              {drawing && <path d={bezier(drawing.startX, drawing.startY, drawing.curX, drawing.curY)} fill="none" stroke={P.accent} strokeWidth={2} strokeDasharray="4,2" markerEnd="url(#arrow-end-accent)" />}
              
              {localConfig.nodes.map(node => {
                const unmapped = isStatusUnmapped(node.id);
                return (
                  <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                    {/* Main Card Rect - The primary hit zone for mapping */}
                    <rect 
                      width={NODE_W} height={NODE_H} rx={16} fill="white" filter="url(#cardShadow)" 
                      stroke={dropTarget === node.id ? P.accent : unmapped ? P.borderBright : P.border} 
                      strokeWidth={dropTarget === node.id ? 2.5 : 1}
                      onMouseUp={(e) => { e.stopPropagation(); completeConnection(node.id); }}
                      onMouseEnter={() => drawing && setDropTarget(node.id)}
                      onMouseLeave={() => setDropTarget(null)}
                      style={{ transition: 'stroke 0.2s', cursor: drawing ? 'pointer' : 'default' }}
                    />
                    
                    {/* Inner content - All with pointerEvents: 'none' to not block the 'rect' below */}
                    <g style={{ pointerEvents: 'none' }}>
                       <rect width={5} height={NODE_H - 24} x={10} y={12} rx={2.5} fill={node.color} />
                       <text x={30} y={NODE_H / 2 + 5} fontSize={13} fontWeight={800} fill={P.text}>{node.label}</text>
                       {unmapped && (
                          <g transform={`translate(${NODE_W/2 - 30}, ${-22})`}>
                              <rect width={60} height={16} rx={4} fill={P.bgPanel} stroke={P.border} strokeWidth={0.5} />
                              <text x={30} y={12} fontSize={8} fontWeight={900} fill={P.textMuted} textAnchor="middle">GLOBAL STATUS</text>
                          </g>
                       )}
                    </g>

                    <g onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }} style={{ cursor: 'pointer', pointerEvents: drawing ? 'none' : 'auto' }}>
                      <circle cx={NODE_W - 12} cy={12} r={8} fill={P.redDim} /><text x={NODE_W - 16} y={16} fontSize={12} fontWeight={900} fill={P.red}>×</text>
                    </g>

                    {/* Drag Handle - Only active if NOT drawing a line */}
                    {!drawing && (
                       <g onMouseDown={(e) => { e.stopPropagation(); const pt = svgPoint(e); setDraggingNode({ id: node.id, ox: pt.x - node.x, oy: pt.y - node.y }); }}  style={{ cursor: 'move' }}>
                         <rect width={NODE_W - 20} height={NODE_H} fill="transparent" rx={16} />
                       </g>
                    )}

                    {/* Connection Port */}
                    <circle cx={NODE_W} cy={NODE_H / 2} r={10} fill={node.color} 
                      onMouseDown={(e) => { 
                        e.stopPropagation(); 
                        setDrawing({ 
                          fromId: node.id, 
                          startX: node.x + NODE_W, 
                          startY: node.y + NODE_H / 2, 
                          curX: node.x + NODE_W, 
                          curY: node.y + NODE_H / 2 
                        }); 
                      }} 
                      style={{ cursor: 'crosshair', pointerEvents: drawing ? 'none' : 'auto' }} stroke="white" strokeWidth={2.5} 
                    />
                    <circle cx={0} cy={NODE_H / 2} r={6} fill={P.bgPanel} stroke={P.border} strokeWidth={1} style={{ pointerEvents: 'none' }} />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        <div style={{ width: sidebarOpen ? 300 : 70, background: "white", borderLeft: `1px solid ${P.border}`, display: "flex", flexDirection: "column", transition: "0.4s cubic-bezier(0.16, 1, 0.3, 1)", position: "relative" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ position: "absolute", left: -14, top: 20, width: 28, height: 28, borderRadius: "50%", background: "white", border: `1px solid ${P.border}`, cursor: "pointer", zIndex: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>{sidebarOpen ? "›" : "‹"}</button>
          
          {sidebarOpen ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${P.border}`, background: P.bgPanel }}>
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 900, color: P.text }}>TRANSITION MAP</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: 10, color: P.textSub, fontWeight: 800 }}>{renderedPairs.length} Active Rules</p>
                <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <div style={{ fontSize: 9, fontWeight: 900, color: P.accent, marginBottom: 4, letterSpacing: '0.8px' }}>ARROWS & FLOW</div>
                  <p style={{ margin: 0, fontSize: 10, color: P.textSub, lineHeight: 1.4, fontWeight: 700 }}>Unmapped statuses (marked Global) permit movement to/from any other status. Draw arrows to restrict the flow.</p>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                {renderedPairs.map(({from, to, isBi}) => (
                  <div key={`${from}-${to}`} style={{ padding: "12px", borderRadius: 12, background: P.bg, marginBottom: 8, border: "1px solid rgba(0,0,0,0.03)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: P.text }}>{from.slice(0, 10)} <span style={{ color: P.accent }}>{isBi ? '↔' : '→'}</span> {to.slice(0, 10)}</div>
                    <button onClick={() => removeTransition(from, to)} style={{ border: "none", background: "transparent", color: P.red, fontSize: 18, cursor: "pointer" }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div onClick={() => setSidebarOpen(true)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 80, cursor: "pointer" }}>
              <div style={{ color: P.accent, marginBottom: 40 }}><MappingIcon /></div>
              <div style={{ fontSize: 10, fontWeight: 900, transform: 'rotate(90deg)', whiteSpace: 'nowrap', color: P.textSub, letterSpacing: "3px" }}>MAPPING</div>
            </div>
          )}
        </div>
      </div>

      {addingStatus && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: 32, borderRadius: 24, width: 360, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: 18, fontWeight: 800 }}>Create New Status</h3>
            <input autoFocus style={{ width: '100%', padding: '16px', borderRadius: 12, border: `1px solid ${P.border}`, background: P.bgPanel, marginBottom: 24, outline: 'none', fontWeight: 700, fontSize: 14 }} placeholder="e.g. READY_TO_CODE" value={newStatusName} onChange={e => setNewStatusName(e.target.value)} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setAddingStatus(false)} style={{ border: 'none', background: 'transparent', fontWeight: 800, cursor: 'pointer', color: P.textSub }}>Cancel</button>
              <button onClick={() => {
                const sk = normalize(newStatusName);
                const firstX = localConfig.nodes.length > 0 ? Math.max(...localConfig.nodes.map(n => n.x)) + 240 : 50;
                setLocalConfig(prev => ({ ...prev, nodes: [...prev.nodes, { id: sk, label: newStatusName, color: P.accent, x: firstX, y: 120 }] }));
                setAddingStatus(false);
                setNewStatusName("");
              }} style={{ background: P.accent, color: 'white', border: 'none', padding: '10px 24px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>ADD STATUS</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintFlowBoardV2;

import { useParams, useSearchParams } from "react-router-dom";
import SprintFLowBoard from "../Board/sprintFlowBoard";
import ColumnStatusManager from "./BoardConfigration";

const SprintBoardManager = () => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type'); // FLOW | BOARD

  /* ================= RENDER ================= */
  return (
    <div className="sprint-board-manager">
      {type === 'FLOW' ? (
        <SprintFLowBoard projectId={projectId} />
      ) : (
        <ColumnStatusManager projectId={projectId} />
      )}
    </div>
  );
};

export default SprintBoardManager;

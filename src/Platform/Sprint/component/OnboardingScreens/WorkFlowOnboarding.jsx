import React, { useState } from "react";
import "./SprintFlowUserEducation.css";

/**
 * HOW TO USE:
 * 1. Import <SprintFlowUserEducation />
 * 2. Render it once inside Sprint Flow Manager page
 * 3. Control visibility via localStorage or state
 */

const STEPS = [
  {
    id: 1,
    title: "Flow Preview",
    description:
      "This is the live preview of your sprint board. Each column represents how issues move across statuses.",
    targetStyle: {
      top: "110px",
      left: "40px",
      width: "92%",
      height: "260px",
    },
    arrow: "down",
  },
  {
    id: 2,
    title: "Status → Column Mapping",
    description:
      "Here you decide which statuses belong to each column. A status can exist in multiple columns.",
    targetStyle: {
      top: "420px",
      left: "40px",
      width: "92%",
      height: "320px",
    },
    arrow: "down",
  },
  {
    id: 3,
    title: "Flow Configuration",
    description:
      "Manage columns here. Reorder, edit colors, set WIP limits, or delete columns.",
    targetStyle: {
      top: "780px",
      left: "40px",
      width: "92%",
      height: "320px",
    },
    arrow: "down",
  },
];

export default function SprintFlowUserEducation() {
  const [step, setStep] = useState(0);

  if (step >= STEPS.length) return null;

  const current = STEPS[step];

  return (
    <div className="edu-overlay">
      {/* Highlight Box */}
      <div
        className="edu-highlight"
        style={current.targetStyle}
      />

      {/* Tooltip */}
      <div
        className="edu-tooltip"
        style={{
          top: `calc(${current.targetStyle.top} + ${current.targetStyle.height} + 16px)`,
          left: current.targetStyle.left,
        }}
      >
        <h4>{current.title}</h4>
        <p>{current.description}</p>

        <div className="edu-actions">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
          >
            Back
          </button>

          <button
            className="primary"
            onClick={() => setStep(step + 1)}
          >
            {step === STEPS.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>

      {/* SVG Arrow */}
      <svg className="edu-arrow" width="120" height="80">
        <path
          d="M10 10 C 60 60, 80 60, 110 10"
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

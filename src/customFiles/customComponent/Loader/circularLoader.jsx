
export default function CircularLoader() {
  return (
    <>
      <style>{`
        /* Styles for the container to center the loader */
        .simple-loader-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh; /* Takes full viewport height */
          background-color: #f0f2f5; /* Light background for contrast */
          position: fixed; /* Fixed position to overlay content */
          top: 0;
          left: 0;
          width: 100%;
          z-index: 9999; /* Ensure it's on top of other content */
        }

        /* The spinning circle loader itself */
        .circular-loader {
          border: 4px solid #e0e0e0; /* Light gray border */
          border-top: 4px solid #2196f3; /* Blue spinning part */
          border-radius: 50%;
          width: 40px; /* Size of the loader */
          height: 40px;
          animation: spin 1s linear infinite; /* Spin animation */
        }

        /* Keyframes for the spin animation */
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="simple-loader-container">
        <div className="circular-loader"></div>
      </div>
    </>
  );
}
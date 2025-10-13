import "./styles/Loaderv1.scss"

export default function HoraLoader() {
  return (
    <>
     

      <div className="loader-container">
        <div className="loader-wrapper">
          <div className="ring-outer"></div>
          <div className="ring-middle"></div>
          <div className="inner-glow"></div>
          
          <div className="letter-container">
            <div className="letter-h">
              H
              <div className="scan-line"></div>
            </div>
          </div>
          
          <div className="loading-text">
            <p>
              LOADING
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
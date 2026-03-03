import "./popups.scss"; 
import crossBtn from "../../assets/platformIcons/crossIcon.svg"

export const PopupV1 = ({ title, children, onClose }) => {
    // Handle background click to close
    const handleOverlayClick = (e) => {
        if (e.target.className === "popup-container") {
            onClose();
        }
    };

    return (
        <div className="popup-container" onClick={handleOverlayClick}>
            <div className="popup-content">
                <div className="popup-header">
                    <h2>{title}</h2>
                    <img src={crossBtn} alt="X" className="close-button" onClick={onClose}/>
                </div>
                <div className="popup-body">
                    {children}
                </div>
            </div>
        </div>
    );
}
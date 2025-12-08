import "./popups.scss"; // Import the SCSS file
import crossBtn from "../../assets/platformIcons/crossIcon.svg"

export const PopupV1 = ({ title, children, onClose }) => {
    return (
        <div className="popup-container">
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
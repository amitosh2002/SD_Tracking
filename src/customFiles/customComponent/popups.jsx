import "./popups.scss"; // Import the SCSS file


export const PopupV1 = ({ title, children, onClose }) => {
    return (
        <div className="popup-container">
            <div className="popup-content">
                <div className="popup-header">
                    <h2>{title}</h2>
                    <button className="close-button" onClick={onClose}>X</button>
                </div>
                <div className="popup-body">
                    {children}
                </div>
            </div>
        </div>
    );
}
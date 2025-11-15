import "./buttonStyle.scss"


export const ButtonV1 = ({ onClick, children, icon,tailIcon, type = 'button', disabled , className = '',text }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={type ==="primary" ? `custom-button   ${className}` : `custom-button secondary ${className}`} 
    >
      {/* Conditionally render the icon if the prop is provided */}
      {icon && <img src={icon} className="button-icon"/>}
      {/* Render the text or other content passed as children */}
      <p className="Lg_body_bold-">{text}</p>
      {children}
      {tailIcon &&<img src={tailIcon} className="button-icon"/>}

    </button>
  );
};

export const ButtonUD =({ onClick, children, icon,tailIcon, type = 'button', disabled , style,text }) => {
  return(
     <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={  `underline_button`} 
      style={style}
    >
      {/* Conditionally render the icon if the prop is provided */}
      {icon && <img src={icon} className="button-icon"/>}
      {/* Render the text or other content passed as children */}
      <span className="">{text}</span>
      {children}
      {tailIcon &&<img src={tailIcon} className="button-icon"/>}

    </button>
  )
}
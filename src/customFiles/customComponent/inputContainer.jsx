export const IIV1 = ({
  placeholder,
  onchange,
  tailIcon,
  headIcon,
}) => {
  return (
    <div className="input-container">
      {headIcon && <span className="head-icon">{headIcon}</span>}
      <input
        type="text"
        className="input-field"
        placeholder={placeholder || "Enter text..."}
        onChange={onchange}
      />
      {tailIcon && <span className="tail-icon">{tailIcon}</span>}
    </div>
  );
}

import "./styles/inputContainers.scss"
export const IIV2Icon =({
  placeholder,
  value,
  onChange,
  isDisabled,
  tailIcon,
  headIcon
})=>{
  return(
    <div class="custom-input">
  <span class="head-icon">
    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg> */}
      {
        headIcon && <img src={headIcon} alt="" />
      }

  </span>

  <input type="text" placeholder={placeholder} value={value}  onChange={onChange} disabled={isDisabled}/>

  <span class="tail-icon">
    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg> */}
      {
        tailIcon && <img src={tailIcon} alt="" />
      }
  </span>
</div>
  )
}


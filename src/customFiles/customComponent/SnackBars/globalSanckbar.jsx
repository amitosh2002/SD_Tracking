import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from './snackBars';
import { HIDE_SNACKBAR } from '../../../Redux/Constants/PlatformConstatnt/platformConstant';

const GlobalSnackbar = () => {
  // 1. Get state from the Redux store
  const { message, type, isVisible } = useSelector(state => state.platform);
  const dispatch = useDispatch();

  // 2. Define the closing handler to dispatch HIDE_SNACKBAR
  const handleClose = () => {
    dispatch({type:HIDE_SNACKBAR});
  };

  // Only render when Redux state says it's visible
  if (!isVisible) return null;

  return (
    <Snackbar
      message={message}
      type={type}
      onClose={handleClose}
      duration={4000} // Custom duration for auto-close logic
    />
  );
};

export default GlobalSnackbar;
// Place this component inside <Provider> in your root file (index.js or App.js).
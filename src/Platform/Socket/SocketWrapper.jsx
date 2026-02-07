import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../../utils/socketConfig';
import { FETCH_NEW_NOTIFICATION } from '../../Redux/Constants/NotificationConstants/inAppNotificationConstant';

const SocketWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userDetails?._id) return;

    console.log("Socket: Checking connection status...");

    const handleOnline = () => {
      console.log("Socket: Emitting user:online for", userDetails._id);
      socket.emit("user:online", userDetails._id);
    };

    if (!socket.connected) {
      console.log("Socket: Connecting...");
      socket.connect();
    } else {
      console.log("Socket: Already connected, ensuring online status...");
      handleOnline();
    }

    const onConnect = () => {
      console.log("Socket: Connected successfully with ID:", socket.id);
      handleOnline();
    };

    socket.on("connect", onConnect);

    socket.on("connect_error", (err) => {
      console.error("Socket: Connection Error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket: Disconnected:", reason);
    });

    // Listen for incoming notifications
    socket.on("notification", (data) => {
      console.log("Socket: Notification received:", data);
      dispatch({ type: FETCH_NEW_NOTIFICATION, payload: data });
      // dispatch(getAllNotifications()); // Optional: if you want full refresh
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("notification");
      socket.disconnect();
    };
  }, [userDetails?._id, dispatch]);

  return <>{children}</>;
};

export default SocketWrapper;

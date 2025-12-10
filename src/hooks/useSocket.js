import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  gameEnded,
  gameEventAdded,
  gameUpdated,
  scoreUpdated,
  userJoinedGame,
  userLeftGame,
  wsConnected,
  wsDisconnected,
} from "../redux/slices/gameSlice";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth?.accessToken) {
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

    const newSocket = io(API_URL, {
      auth: {
        token: auth.accessToken,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    setSocket(newSocket);

    const handleConnect= () => {
      setIsConnected(true);
      setReconnectAttempts(0);
      dispatch(wsConnected());
    };

    const handleDisconnect = (reason) => {
         console.log('❌ Socket.IO disconnected:', reason);
      setIsConnected(false);
      dispatch(wsDisconnected());
    };

    const handleConnectError = (error) => {
         console.error('❌ Socket.IO connection error:', error);
      setIsConnected(false);
    };

    const handleReconnectAttempt = (attempt) => {
          console.log(`🔄 Socket.IO reconnection attempt ${attempt}`);
      setReconnectAttempts(attempt);
    };

    const handleReconnectFailed = () => {
      setIsConnected(false);
    };

    const handleScoreUpdate = (data) => {
      dispatch(scoreUpdated(data));

      // if(data.gameId){

      // }
    };

    const handleGameUpdate = (data) => {
      dispatch(gameUpdated(data));

      // if(data.type === "event_added" || data.scores){

      // }
    };

    const handleGameEvent = (data) => {
      dispatch(gameEventAdded(data));
    };

    const handleGameEnded = (data) => {
      dispatch(gameEnded(data));
    };

    const handleUserJoined=(data)=>{
        dispatch(userJoinedGame(data))
    }


    const handleUserLeft=(data)=>{
        dispatch(userLeftGame(data))
    }


    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('connect_error', handleConnectError);
    newSocket.on('reconnect_attempt', handleReconnectAttempt);
    newSocket.on('reconnect_failed', handleReconnectFailed);

    newSocket.on('score-update', handleScoreUpdate);
    newSocket.on('game-update', handleGameUpdate);
    newSocket.on('game-event', handleGameEvent);
    newSocket.on('game-ended', handleGameEnded);
    newSocket.on('user-joined', handleUserJoined);
    newSocket.on('user-left', handleUserLeft);


    return()=>{
         newSocket.off('connect', handleConnect);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.off('connect_error', handleConnectError);
      newSocket.off('reconnect_attempt', handleReconnectAttempt);
      newSocket.off('reconnect_failed', handleReconnectFailed);
      newSocket.off('score-update', handleScoreUpdate);
      newSocket.off('game-update', handleGameUpdate);
      newSocket.off('game-event', handleGameEvent);
      newSocket.off('game-ended', handleGameEnded);
      newSocket.off('user-joined', handleUserJoined);
      newSocket.off('user-left', handleUserLeft);

        newSocket.disconnect();
    }
  },[auth?.accessToken,dispatch]);


    const joinRoom = useCallback((gameId) => {
    if (socket && gameId && isConnected) {
      try {
        socket.emit('join-game', gameId);
      } catch (error) {
        console.error('❌ Failed to join room:', error);
      }
    } else {
      console.warn('⚠️ Cannot join room - socket not ready');
    }
  }, [socket, isConnected]);

  const leaveRoom = useCallback((gameId) => {
    if (socket && gameId) {
      try {
        socket.emit('leave-game', gameId);
      } catch (error) {
        console.error('❌ Failed to leave room:', error);
      }
    }
  }, [socket]);


    return {
    socket,
    isConnected,
    reconnectAttempts,
    joinRoom,
    leaveRoom
  };
};

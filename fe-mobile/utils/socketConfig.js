import { io } from 'socket.io-client';

const connectSocket = () => {
  const socket = io(`${process.env.EXPO_PUBLIC_SOCKET_URL}`);
  return socket;
};

export default connectSocket;

import { io } from "socket.io-client";

const socket = io(
  "https://chatverse-backend-c441.onrender.com"
);

export default socket;
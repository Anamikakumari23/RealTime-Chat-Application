import { io } from "socket.io-client";

const URL = "https://chatverse-backend-c441.onrender.com";

const socket = io(URL, {
  transports: ["websocket"],
});

export default socket;
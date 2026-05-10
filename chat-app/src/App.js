import React, { useState } from "react";
import axios from "axios";

import Login from "./pages/Login";
import JoinRoom from "./pages/JoinRoom";
import ChatBox from "./components/ChatBox";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [room, setRoom] = useState("");

  const [isAuth, setIsAuth] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);

  const BACKEND_URL =
    "https://chatverse-backend-c441.onrender.com";

  // LOGIN
  const login = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/auth/login`,
        {
          username,
          password,
        }
      );

      if (res.data.error) {
        alert(res.data.error);
        return;
      }

      alert("Login successful ✅");

      setIsAuth(true);

    } catch (err) {
      console.log(err);

      alert("Server error ❌");
    }
  };

  // REGISTER
  const register = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/auth/register`,
        {
          username,
          password,
        }
      );

      if (res.data.error) {
        alert(res.data.error);
        return;
      }

      alert("Registered successfully ✅");

    } catch (err) {
      console.log(err);

      alert("Server error ❌");
    }
  };

  // JOIN ROOM
  const joinRoom = () => {
    if (!room) {
      alert("Enter room ID");
      return;
    }

    setJoinedRoom(true);
  };

  return (
    <div>
      {!isAuth ? (
        <Login
          setUsername={setUsername}
          setPassword={setPassword}
          login={login}
          register={register}
        />
      ) : !joinedRoom ? (
        <JoinRoom
          setRoom={setRoom}
          joinRoom={joinRoom}
        />
      ) : (
        <ChatBox
          username={username}
          room={room}
        />
      )}
    </div>
  );
}

export default App;
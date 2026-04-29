import React, { useState } from "react";
import axios from "axios";
import Login from "./pages/Login";
import ChatBox from "./components/ChatBox";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showChat, setShowChat] = useState(false);

  const BACKEND_URL = "https://chatverse-backend-c441.onrender.com";

  // LOGIN
  const login = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, {
        username,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data); // 🔍 DEBUG

      // ❗ IMPORTANT CHECK
      if (res.data.error) {
        alert(res.data.error);
        return;
      }

      // ✅ SUCCESS
      alert("Login successful ✅");

      // 🔥 FORCE UI UPDATE
      setShowChat(true);

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert("Server not responding ❌");
    }
  };

  // REGISTER
  const register = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/auth/register`, {
        username,
        password,
      });

      console.log("REGISTER RESPONSE:", res.data);

      if (res.data.error) {
        alert(res.data.error);
        return;
      }

      alert("Registered successfully ✅");
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      alert("Register failed ❌");
    }
  };

  return (
    <div>
      {!showChat ? (
        <Login
          setUsername={setUsername}
          setPassword={setPassword}
          login={login}
          register={register}
        />
      ) : (
        <ChatBox username={username} room="general" />
      )}
    </div>
  );
}

export default App;
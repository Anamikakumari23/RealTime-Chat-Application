import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "./socket";

import Header from "./components/Header";
import ChatBox from "./components/ChatBox";
import Input from "./components/Input";
import Login from "./pages/Login";
import JoinRoom from "./pages/JoinRoom";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  const [users, setUsers] = useState([]); // 🟢 users

  // LOGIN
  const login = async () => {
    const res = await axios.post("http://localhost:5000/auth/login", {
      username,
      password,
    });

    if (res.data.error) alert(res.data.error);
    else setLoggedIn(true);
  };

  // REGISTER
  const register = async () => {
    await axios.post("http://localhost:5000/auth/register", {
      username,
      password,
    });
    alert("Registered");
  };

  // JOIN ROOM
  const joinRoom = () => {
    if (!room) return alert("Enter room ID");

    socket.emit("join_room", { room, username }); // 🔥 important
    setJoined(true);
  };

  // SEND MESSAGE
  const sendMessage = () => {
    if (!message) return;

    const data = {
      id: Date.now(),
      room,
      author: username,
      message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      delivered: false,
      seen: false,
    };

    socket.emit("send_message", data);
    setMessage("");
  };

  // SOCKET
  useEffect(() => {
    socket.off("receive_message");

    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);

      // ✔ delivered
      socket.emit("message_delivered", {
        id: data.id,
        room: data.room,
      });

      // ✔✔ seen (only if not sender)
      if (data.author !== username) {
        socket.emit("message_seen", {
          id: data.id,
          room: data.room,
        });
      }
    });

    socket.on("message_delivered_update", (id) => {
      setMessageList((list) =>
        list.map((msg) =>
          msg.id === id ? { ...msg, delivered: true } : msg
        )
      );
    });

    socket.on("message_seen_update", (id) => {
      setMessageList((list) =>
        list.map((msg) =>
          msg.id === id ? { ...msg, seen: true } : msg
        )
      );
    });

    socket.on("show_typing", (data) => setTypingUser(data.author));
    socket.on("hide_typing", () => setTypingUser(""));

    // 🟢 ONLINE USERS
    socket.on("user_status", (data) => {
      setUsers(data);
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_delivered_update");
      socket.off("message_seen_update");
      socket.off("show_typing");
      socket.off("hide_typing");
      socket.off("user_status");
    };
  }, [username]);

  // UI
  if (!loggedIn)
    return <Login {...{ setUsername, setPassword, login, register }} />;

  if (!joined)
    return <JoinRoom {...{ setRoom, joinRoom }} />;

  return (
    <div style={styles.bg}>
      <div style={styles.chatCard}>
        
        <Header
          username={username}
          typingUser={typingUser}
          users={users} // 🟢
          setMessageList={setMessageList}
          setJoined={setJoined}
        />

        <ChatBox
          messageList={messageList}
          username={username}
          typingUser={typingUser}
        />

        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          socket={socket}
          room={room}
          username={username}
        />
      </div>
    </div>
  );
}

const styles = {
  bg: {
    height: "100vh",
    background: "#F2F3F7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  chatCard: {
    width: "100%",
    maxWidth: 420,
    height: "90vh",
    background: "white",
    borderRadius: 15,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
};

export default App;
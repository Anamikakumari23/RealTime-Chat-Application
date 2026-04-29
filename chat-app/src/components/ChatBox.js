import React, { useState, useEffect } from "react";
import socket from "../socket";

function ChatBox({ username, room }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.emit("join_room", { username, room });
  }, [username, room]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      room,
      author: username,
      message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("send_message", msgData);
    setMessageList((list) => [...list, msgData]);
    setMessage("");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.chatBox}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.avatar}>{username[0].toUpperCase()}</div>
          <div>
            <b>{username}</b>
            <div style={{ fontSize: 12 }}>Online</div>
          </div>
        </div>

        {/* Messages */}
        <div style={styles.messages}>
          {messageList.map((msg, index) => (
            <div
              key={index}
              style={
                msg.author === username
                  ? styles.myMsg
                  : styles.otherMsg
              }
            >
              <b>{msg.author}</b>
              <p>{msg.message}</p>
              <span style={styles.time}>{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={styles.inputArea}>
          <input
            style={styles.input}
            value={message}
            placeholder="Type message..."
            onChange={(e) => setMessage(e.target.value)}
          />

          <button style={styles.sendBtn} onClick={sendMessage}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    background: "#e5e7eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  chatBox: {
    width: 400,
    height: 600,
    background: "#d1d5db",
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 15,
    background: "white",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#818cf8",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  messages: {
    flex: 1,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
  },

  myMsg: {
    alignSelf: "flex-end",
    background: "#fbcfe8",
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },

  otherMsg: {
    alignSelf: "flex-start",
    background: "#bfdbfe",
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },

  time: {
    fontSize: 10,
    marginTop: 5,
    display: "block",
  },

  inputArea: {
    display: "flex",
    padding: 10,
    background: "white",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "none",
    background: "#e5e7eb",
  },

  sendBtn: {
    marginLeft: 10,
    padding: "10px 15px",
    borderRadius: "50%",
    border: "none",
    background: "#818cf8",
    color: "white",
    cursor: "pointer",
  },
};

export default ChatBox;
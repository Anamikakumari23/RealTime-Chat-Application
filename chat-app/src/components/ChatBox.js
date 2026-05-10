import React, { useState, useEffect } from "react";
import socket from "../socket";

function ChatBox({ username, room }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    if (!username || !room) return;

    socket.emit("join_room", {
      username,
      room,
    });

  }, [username, room]);

  useEffect(() => {
    const receiveHandler = (data) => {
      setMessageList((list) => [
        ...list,
        data,
      ]);
    };

    socket.on(
      "receive_message",
      receiveHandler
    );

    return () => {
      socket.off(
        "receive_message",
        receiveHandler
      );
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const msgData = {
      room,
      author: username,
      message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", msgData);

    setMessageList((list) => [
      ...list,
      msgData,
    ]);

    setMessage("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>
            Live Chat 💬
          </h2>

          <p style={{ margin: 0 }}>
            Room: {room}
          </p>
        </div>
      </div>

      <div style={styles.chatBox}>
        {messageList.map((msg, index) => (
          <div
            key={index}
            style={
              msg.author === username
                ? styles.myMessage
                : styles.otherMessage
            }
          >
            <b>{msg.author}</b>

            <p>{msg.message}</p>

            <span style={styles.time}>
              {msg.time}
            </span>
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <span style={styles.emoji}>
          😊
        </span>

        <input
          style={styles.input}
          value={message}
          placeholder="Type message..."
          onChange={(e) =>
            setMessage(e.target.value)
          }
        />

        <button
          style={styles.sendBtn}
          onClick={sendMessage}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: 500,
    margin: "20px auto",
    background: "#EDE9FE",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.1)",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    background: "white",
    padding: 20,
    borderBottom: "1px solid #ddd",
  },

  chatBox: {
    flex: 1,
    padding: 20,
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },

  myMessage: {
    alignSelf: "flex-end",
    background: "#FBCFE8",
    padding: 15,
    borderRadius: 15,
    maxWidth: "70%",
  },

  otherMessage: {
    alignSelf: "flex-start",
    background: "#BFDBFE",
    padding: 15,
    borderRadius: 15,
    maxWidth: "70%",
  },

  time: {
    fontSize: 12,
  },

  inputArea: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 15,
    background: "white",
  },

  emoji: {
    fontSize: 24,
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    border: "none",
    background: "#F1F5F9",
    outline: "none",
  },

  sendBtn: {
    width: 45,
    height: 45,
    borderRadius: "50%",
    border: "none",
    background: "#818CF8",
    color: "white",
    fontSize: 18,
    cursor: "pointer",
  },
};

export default ChatBox;
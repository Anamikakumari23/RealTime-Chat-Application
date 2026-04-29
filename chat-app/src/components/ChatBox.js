import React, { useState, useEffect } from "react";
import socket from "../socket";

function ChatBox({ username, room }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  // Join room
  useEffect(() => {
    socket.emit("join_room", { username, room });
  }, []);

  // Receive messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  // Send message
  const sendMessage = () => {
    if (message !== "") {
      const msgData = {
        room,
        author: username,
        message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("send_message", msgData);
      setMessageList((list) => [...list, msgData]);
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <h3>Live Chat 💬</h3>

      <div style={styles.chatBox}>
        {messageList.map((msg, index) => (
          <div key={index}>
            <b>{msg.author}:</b> {msg.message}
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          value={message}
          placeholder="Type message..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
  },
  chatBox: {
    height: 300,
    overflowY: "scroll",
    border: "1px solid #ddd",
    marginBottom: 10,
    padding: 10,
  },
  inputArea: {
    display: "flex",
    gap: 10,
  },
};

export default ChatBox;
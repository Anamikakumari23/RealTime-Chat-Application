import React, { useState, useEffect } from "react";
import socket from "../socket";
import EmojiPicker from "emoji-picker-react";

function ChatBox({ username, room }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // JOIN ROOM
  useEffect(() => {
    if (!username || !room) return;

    socket.emit("join_room", {
      username,
      room,
    });

  }, [username, room]);

  // RECEIVE MESSAGES
  useEffect(() => {
    const receiveHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };

    // USER JOINED
    const joinedHandler = (data) => {
      setMessageList((list) => [
        ...list,
        {
          author: "System",
          message: `${data.username} joined the room 🎉`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    };

    socket.on("receive_message", receiveHandler);

    socket.on("user_joined", joinedHandler);

    return () => {
      socket.off("receive_message", receiveHandler);

      socket.off("user_joined", joinedHandler);
    };
  }, []);

  // SEND MESSAGE
  const sendMessage = () => {
    if (message.trim() === "") return;

    const msgData = {
      room,
      author: username,
      message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", msgData);

    setMessageList((list) => [...list, msgData]);

    setMessage("");
  };

  // EMOJI
  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  // CLEAR CHAT
  const clearChat = () => {
    setMessageList([]);
    setShowMenu(false);
  };

  // LOGOUT
  const logout = () => {
    window.location.reload();
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>

        <div>
          <h2 style={{ margin: 0 }}>
            {room}
          </h2>

          <p style={{ margin: 0 }}>
            Online
          </p>
        </div>

        {/* 3 DOT */}
        <div style={{ position: "relative" }}>

          <button
            style={styles.menuBtn}
            onClick={() =>
              setShowMenu(!showMenu)
            }
          >
            ⋮
          </button>

          {showMenu && (
            <div style={styles.dropdown}>
              <p
                style={styles.dropdownItem}
                onClick={clearChat}
              >
                Clear Chat
              </p>

              <p
                style={styles.dropdownItem}
                onClick={logout}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div style={styles.chatBox}>
        {messageList.map((msg, index) => (
          <div
            key={index}
            style={
              msg.author === username
                ? styles.myMessage
                : msg.author === "System"
                ? styles.systemMessage
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

      {/* EMOJI PICKER */}
      {showEmoji && (
        <div style={styles.emojiPicker}>
          <EmojiPicker
            onEmojiClick={onEmojiClick}
          />
        </div>
      )}

      {/* INPUT AREA */}
      <div style={styles.inputArea}>

        <button
          style={styles.emojiBtn}
          onClick={() =>
            setShowEmoji(!showEmoji)
          }
        >
          😊
        </button>

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
    position: "relative",
  },

  header: {
    background: "white",
    padding: 20,
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  menuBtn: {
    border: "none",
    background: "transparent",
    fontSize: 22,
    cursor: "pointer",
  },

  dropdown: {
    position: "absolute",
    right: 0,
    top: 30,
    background: "white",
    borderRadius: 10,
    boxShadow:
      "0 4px 10px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },

  dropdownItem: {
    padding: 10,
    cursor: "pointer",
    margin: 0,
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

  systemMessage: {
    alignSelf: "center",
    background: "#DDD6FE",
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
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

  emojiBtn: {
    border: "none",
    background: "transparent",
    fontSize: 24,
    cursor: "pointer",
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

  emojiPicker: {
    position: "absolute",
    bottom: 80,
    left: 10,
  },
};

export default ChatBox;
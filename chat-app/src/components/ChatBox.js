import React, { useState, useEffect } from "react";
import socket from "../socket";
import EmojiPicker from "emoji-picker-react";

function ChatBox({ username, room }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  // ✅ Join room
  useEffect(() => {
    if (!username || !room) return;
    socket.emit("join_room", { username, room });
  }, [username, room]);

  // ✅ Receive messages
  useEffect(() => {
    const receiveHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", receiveHandler);

    return () => {
      socket.off("receive_message", receiveHandler);
    };
  }, []);

  // ✅ Send message
  const sendMessage = () => {
    if (message.trim() === "") return;

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

  // ✅ Emoji click
  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  // ✅ Clear chat
  const clearChat = () => {
    setMessageList([]);
    setShowMenu(false);
  };

  // ✅ Logout
  const logout = () => {
    window.location.reload();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.chatBox}>

        {/* 🔥 HEADER */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.avatar}>
              {username?.[0]?.toUpperCase()}
            </div>

            <div>
              <b>{username}</b>
              <div style={styles.online}>Online</div>
            </div>
          </div>

          {/* 3-dot menu */}
          <div style={{ position: "relative" }}>
            <button
              style={styles.menuBtn}
              onClick={() => setShowMenu(!showMenu)}
            >
              ⋮
            </button>

            {showMenu && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownItem} onClick={clearChat}>
                  Clear Chat
                </div>
                <div style={styles.dropdownItem} onClick={logout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 💬 MESSAGES */}
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

        {/* ✍️ INPUT */}
        <div style={styles.inputArea}>

          {/* 😊 Emoji button */}
          <button
            style={styles.emojiBtn}
            onClick={() => setShowEmoji(!showEmoji)}
          >
            😊
          </button>

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

        {/* 😍 Emoji Picker */}
        {showEmoji && (
          <div style={styles.emojiPicker}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

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
    position: "relative",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    background: "white",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
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

  online: {
    fontSize: 12,
    color: "green",
  },

  menuBtn: {
    background: "none",
    border: "none",
    fontSize: 20,
    cursor: "pointer",
  },

  dropdown: {
    position: "absolute",
    right: 0,
    top: 30,
    background: "white",
    borderRadius: 8,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },

  dropdownItem: {
    padding: "10px 15px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
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
    alignItems: "center",
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

  emojiBtn: {
    background: "none",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    marginRight: 5,
  },

  emojiPicker: {
    position: "absolute",
    bottom: 70,
    left: 10,
    zIndex: 10,
  },
};

export default ChatBox;
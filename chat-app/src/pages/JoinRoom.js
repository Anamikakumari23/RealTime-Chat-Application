import React, { useState } from "react";

export default function JoinRoom({ setRoom, joinRoom }) {
  const [roomInput, setRoomInput] = useState("");

  const handleJoin = () => {
    if (!roomInput.trim()) {
      alert("Please enter a room ID");
      return;
    }

    setRoom(roomInput); // ✅ set room only when clicking
    joinRoom();         // ✅ go to chat
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>Join Chat Room 💬</h2>

        <input
          style={styles.input}
          placeholder="Enter Room ID"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
        />

        <button style={styles.joinBtn} onClick={handleJoin}>
          Join Room
        </button>
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

  card: {
    width: "100%",
    maxWidth: 350,
    padding: 25,
    borderRadius: 15,
    background: "white",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  title: {
    textAlign: "center",
    marginBottom: 10,
  },

  input: {
    padding: 12,
    borderRadius: 25,
    border: "none",
    background: "#f1f5f9",
    outline: "none",
    fontSize: 14,
  },

  joinBtn: {
    padding: 12,
    borderRadius: 25,
    border: "none",
    background: "#6366f1",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
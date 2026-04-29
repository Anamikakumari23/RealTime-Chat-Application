import { useState, useRef } from "react";

export default function Input({ message, setMessage, sendMessage, socket, room, username }) {
  const [showEmoji, setShowEmoji] = useState(false);
  const typingTimeout = useRef(null);

  return (
    <>
      {showEmoji && (
        <div style={styles.emojiPanel}>
          {["😀","😂","😍","😎","😭","👍","🔥","❤️"].map((e,i)=>(
            <span key={i} style={styles.emoji} onClick={()=>setMessage(message+e)}>{e}</span>
          ))}
        </div>
      )}

      <div style={styles.container}>
        <button style={styles.emojiBtn} onClick={()=>setShowEmoji(!showEmoji)}>😊</button>

        <input
          style={styles.input}
          value={message}
          placeholder="Type message..."
          onChange={(e)=>{
            setMessage(e.target.value);

            socket.emit("typing", { room, author: username });

            clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(()=>{
              socket.emit("stop_typing", { room });
            },1500);
          }}
        />

        <button style={styles.sendBtn} onClick={sendMessage}>➤</button>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    padding: 10,
    borderTop: "1px solid #eee",
    background: "white",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "none",
    background: "#f1f5f9",
  },

  sendBtn: {
    marginLeft: 8,
    width: 35,
    height: 35,
    borderRadius: "50%",
    background: "#818cf8",
    color: "white",
    border: "none",
  },

  emojiBtn: {
    border: "none",
    background: "transparent",
    fontSize: 20,
    marginRight: 5,
  },

  emojiPanel: {
    display: "flex",
    gap: 10,
    padding: 10,
    borderTop: "1px solid #eee",
  },

  emoji: { cursor: "pointer" },
};
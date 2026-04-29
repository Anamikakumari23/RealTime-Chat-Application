export default function Message({ msg, username }) {
  const isMe = msg.author === username;

  return (
    <div style={isMe ? styles.myMsg : styles.otherMsg}>
      <span style={styles.author}>{msg.author}</span>
      <p>{msg.message}</p>

      <div style={styles.time}>
        {msg.time} {isMe && (msg.seen ? "✔✔" : "✔")}
      </div>
    </div>
  );
}

const styles = {
  myMsg: {
    background: "#FBCFE8",
    padding: 10,
    borderRadius: "15px 15px 0 15px",
    margin: "6px 0",
    maxWidth: "75%",
    marginLeft: "auto",
  },
  otherMsg: {
    background: "#BFDBFE",
    padding: 10,
    borderRadius: "15px 15px 15px 0",
    margin: "6px 0",
    maxWidth: "75%",
  },
  author: { fontSize: 12, fontWeight: "bold" },
  time: { fontSize: 10, color: "#444" },
};
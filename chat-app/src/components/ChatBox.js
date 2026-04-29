import Message from "./Message";

export default function ChatBox({ messageList, username, typingUser }) {
  return (
    <div style={styles.chatBox}>
      {messageList.map((msg, i) => (
        <Message key={i} msg={msg} username={username} />
      ))}

      {typingUser && <div style={styles.typing}>{typingUser} is typing...</div>}
    </div>
  );
}


const styles = {
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: 10,
    background: "#E6E6FA",
  },

  typing: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
};
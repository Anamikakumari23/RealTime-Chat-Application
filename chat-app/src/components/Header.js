import { useState, useRef, useEffect } from "react";

export default function Header({
  username,
  typingUser,
  users,
  setMessageList,
  setJoined,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef();

  // close on outside click
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // 🟢 current user
  const currentUser = users?.find((u) => u.username === username);

  return (
    <div style={styles.header}>
      <div style={styles.left}>
        <div style={styles.avatar}>
          {username[0].toUpperCase()}
        </div>

        <div>
          <div style={styles.name}>{username}</div>

          <div style={styles.status}>
            {typingUser
              ? `${typingUser} is typing...`
              : currentUser?.online
              ? " Online"
              : `Last seen at ${currentUser?.lastSeen || ""}`}
          </div>
        </div>
      </div>

      <div ref={ref} style={styles.menuWrapper}>
        <span style={styles.dots} onClick={() => setShowMenu(!showMenu)}>
          ⋮
        </span>

        {showMenu && (
          <div style={styles.menu}>
            <div
              style={styles.item}
              onClick={() => {
                setMessageList([]);
                setShowMenu(false);
              }}
            >
              🗑️ Clear Chat
            </div>

            <div style={styles.div}></div>

            <div
              style={styles.item}
              onClick={() => {
                setJoined(false);
                setShowMenu(false);
              }}
            >
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    borderBottom: "1px solid #eee",
  },
  left: { display: "flex", gap: 10, alignItems: "center" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#818cf8",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontWeight: "bold" },
  status: { fontSize: 12, color: "gray" },

  dots: { cursor: "pointer", fontSize: 20 },

  menuWrapper: { position: "relative" },

  menu: {
    position: "absolute",
    right: 0,
    top: 25,
    background: "white",
    borderRadius: 8,
    padding: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  item: {
    padding: 5,
    cursor: "pointer",
  },

  div: {
    height: 1,
    background: "#eee",
    margin: "5px 0",
  },
};
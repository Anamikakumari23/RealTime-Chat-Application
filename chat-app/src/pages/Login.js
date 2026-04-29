export default function Login({ setUsername, setPassword, login, register }) {
  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome ChatVerse 🌐</h2>

        <input
          style={styles.input}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.loginBtn} onClick={login}>
          Login
        </button>

        <button style={styles.registerBtn} onClick={register}>
          Register
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
  },
  input: {
    padding: 12,
    borderRadius: 25,
    border: "none",
    background: "#f1f5f9",
    outline: "none",
  },
  loginBtn: {
    padding: 12,
    borderRadius: 25,
    border: "none",
    background: "#818cf8",
    color: "white",
    cursor: "pointer",
  },
  registerBtn: {
    padding: 12,
    borderRadius: 25,
    border: "none",
    background: "#FBCFE8",
    color: "#831843",
    cursor: "pointer",
  },
};
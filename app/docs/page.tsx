import Navbar from "../components/Navbar";

export default function DocsPage() {
  return (
    <div style={{ paddingTop: "64px", minHeight: "100vh", background: "#212129" }}>
      <Navbar />
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#ffffff" }}>Documentation</h1>
        <p style={{ color: "#94a3b8" }}>Coming soon...</p>
      </div>
    </div>
  );
}

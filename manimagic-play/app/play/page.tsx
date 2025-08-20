import Navbar from "../components/Navbar";
import ManiMagicPlayClientWrapper from "../ManiMagicPlayClientWrapper";

export default function PlayPage() {
  return (
    <div className="play-dark">
      <Navbar />
      <div style={{ 
        minHeight: "calc(100vh - 64px)", 
        background: "#212129", 
        padding: 0, 
        margin: 0 
      }}>
        <ManiMagicPlayClientWrapper />
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px" }}>
      <MdDashboard
        size={70}
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      />
    </div>
  );
}

export default Home;

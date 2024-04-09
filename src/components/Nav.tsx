import { useNavigate } from "react-router-dom";

const Nav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="nav">
      <button onClick={() => navigate("/")}>На главную</button>
    </div>
  );
};

export default Nav;

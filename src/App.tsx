import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Users from "./pages/Users";
import User from "./pages/User";
import CreateUser from "./pages/CreateUser";
import "./App.css";
import Nav from "./components/Nav";

const App: React.FC = () => {
  return (
    <Router>
      <Nav />
        <Routes>
          <Route path="/" element={<Users />}></Route>
          <Route path="/WatchUser/:id" element={<User />}></Route>
          <Route path="/CreateUser" element={<CreateUser />}></Route>
          <Route path="/EditUser/:id" element={<CreateUser />}></Route>
        </Routes>
    </Router>
  );
};

export default App;

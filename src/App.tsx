import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import './index.css';
import axios from 'axios';
import { Signup } from "./components/Signup";

axios.defaults.baseURL = process.env.REACT_APP_CHESS_SERVER_HTTP;
axios.defaults.withCredentials = true;

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path='/:boardid?' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;

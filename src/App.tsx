import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import './index.css';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_CHESS_SERVER_HTTP;
axios.defaults.withCredentials = true;

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path='/:boardid?' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

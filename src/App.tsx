import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import './index.css';
import axios from 'axios';

axios.defaults.baseURL = 'https://34.86.105.30:8080';
axios.defaults.withCredentials = true;

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path='/chess_2/:boardid?' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

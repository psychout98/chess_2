import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import './index.css';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

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

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import './index.css';
import axios from 'axios';

axios.defaults.baseURL = 'https://pacific-refuge-56148-96967b0a6dc5.herokuapp.com';
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

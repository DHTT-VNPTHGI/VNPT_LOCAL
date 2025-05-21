import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Component/Home";


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
           
            <Route path="/" element={<Home />} />
          </Routes>{" "}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </header>{" "}
      </div>{" "}
    </Router>
  );
}

export default App;

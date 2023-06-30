import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import Navbar from "./Components/Navbar.jsx";
import Admin from "./Pages/Admin.jsx";
import Signup from "./Pages/Signup.jsx";
import Signin from "./Pages/Signin.jsx";
import RequireAuth from "./Components/RequireAuth.jsx";
import { AuthProvider } from "./Context/Context.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <Router className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/todos" element={<RequireAuth element={<Admin />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

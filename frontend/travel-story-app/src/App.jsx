import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" exact element={<Root />} />
        <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
};

// define the Root componenet to handle the initial redirect
const Root = () => {
  //check if the token in the localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // redirect to dashboard if authenticated , otherwide to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

export default App;

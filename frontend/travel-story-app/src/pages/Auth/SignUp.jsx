import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import { useState } from "react";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your full name .");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a validate email adress .");
      return;
    }
    if (!password) {
      setError("Please enter the password  .");
      return;
    }
    setError("");
    // Sign up API call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      //handle successfull login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/login");
      }
    } catch (error) {
      //handle signup error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } 
      else {
        setError("an unexpected error ");
      }
    }
  };

  return (
    <div className="h-screen bg-transparent overflow-hidden relative">
    

      <div className="container h-screen flex items-center justify-center px-20 mx-auto ">
        <div className="w-2/4 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50 shadow-[0_4px_10px_rgba(0,0,0,0.2),0_1px_3px_rgba(0,0,0,0.1)]">
          <div>
            <h4 className="text-5xl text-white font-semibold leading-[58px]">
              Join <br/> the adventure
            </h4>
            <p className="text-[15px] text-white leading-6 pr-7 mt-4">
              Create an account to start documenting your travels and preserving your memories in your personal travel journal .
            </p>
          </div>
        </div>

        <div className="w-2/4 h-[75vh]   bg-gradient-to-br from-white-to-gray-50 rounded-r-lg relative p-16 shadow-[0_4px_10px_rgba(0,0,0,0.2),0_1px_3px_rgba(0,0,0,0.1)] ">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold mb-7">Sign Up</h4>
            <input
              type="text"
              placeholder="Full Name"
              className="input-box"
              value={name}
              onChange={({ target }) => {
                setName(target.value);
              }}
            />
              <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={({ target }) => {
                setEmail(target.value);
              }}
            />
            <PasswordInput
              value={password}
              onChange={({ target }) => {
                setPassword(target.value);
              }}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
            Create account
              
            </button>

            <p className="text-xs text-slate-500 text-center my-4 ">Or</p>

            <button
              type="submit"
              className="btn-primary btn-light"
              onClick={() => {
                navigate("/login");
              }}
            >
             Login 
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

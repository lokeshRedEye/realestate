import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error , setError] = useState("");
  const navigate = useNavigate();
  const [isLoading , setIsLoading] = useState(false);

  const handleSubmit =  async (e) => {
    e.preventDefault();
    setIsLoading(true); // ✅ Corrected here
    setError("");

    const formdata = new FormData(e.target);
    const username = formdata.get('username');
    const email = formdata.get('email');
    const password = formdata.get('password');

    try {
      const res = await apiRequest.post('/auth/register', {username, email, password});
      console.log(res);
      navigate('/login');
    } catch (error) {
      console.log(error.response?.data?.error);
      setError(error.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button disabled={isLoading}>{isLoading ? "Registering..." : "Register"}</button>
          {error && <span>{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;

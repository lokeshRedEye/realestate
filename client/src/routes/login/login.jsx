import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {

  const [error , setError] = useState();
  const [isLoading , setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {updateUser} = useContext(AuthContext)

  const handleSubmit =  async (e) => {
    e.preventDefault();
    setError("");

    setIsLoading(true);

    const formdata = new FormData(e.target)
    console.log(formdata)
    const username = formdata.get('username')

    const password = formdata.get('password')
    

    try {
      const res = await apiRequest.post('/auth/login' , {username , password})

      // console.log(res)
      // localStorage.setItem('user', JSON.stringify(res.data));
      updateUser(res.data)


      navigate('/')
      
    } catch (error) {
      console.log(error.response.data.error)
      setError(error.response.data.error)
      
    }
    finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="login">
      <div className="formContainer">
        <form  onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" required minLength={3} maxLength={20} type="text" placeholder="Username" />
          <input name="password" required type="password" placeholder="Password" />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;

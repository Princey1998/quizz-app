import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  CircularProgress
} from "@mui/material";
import { useEffect, useState } from "react";
import { loginUserByEmailThunk } from "../../redux/thunks/authThunks"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.authReducer)
  const [loginData, setLoginData] = useState({})
  const navigate = useNavigate();

  const handelSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUserByEmailThunk(loginData))
  }

  useEffect(() => {
   if(authState.user && !authState.loginLoading) {
     navigate("/")
   }
  }, [authState.loginLoading])

  return (
    <div className=" pt-4">
      <h1 className="text-4xl text-center">Login</h1>
      <form onSubmit={handelSubmit} className="m-auto mt-4 w-full max-w-[24rem] px-2">
        <label className="mb-4 block">
          <p className="mb-2">Email</p>
          <input className="w-full p-2 bg-slate-300 focus:bg-white rounded border border-slate-50"  type="email" required onChange={(e) => setLoginData((prev) => ({
            ...prev,
            email: e.target.value
          }))}/>
        </label>
        <label className="mb-4 block">
          <p className="mb-2">Password</p>
          <input minLength={8} className="w-full p-2 bg-slate-300 focus:bg-white rounded border border-slate-50"  type="password" required onChange={(e) => setLoginData((prev) => ({
            ...prev,
            password: e.target.value
          }))}/>
        </label>
        <div className="text-center">
            <Button type="submit" variant="contained" className="w-32" >
               <span></span>
                {
                    authState.loginLoading ? <CircularProgress size={25} color="inherit" /> : "Login"
                }
            </Button>
        </div>
       
      </form>
    </div>
  );
};

export default Login;
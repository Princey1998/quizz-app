import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  CircularProgress
} from "@mui/material";
import { useEffect, useState } from "react";
import { signUpUserByEmailThunk } from "../../redux/thunks/authThunks"
import { useNavigate } from "react-router-dom"

const Signup = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.authReducer)
  const [singupData, setSignupData] = useState({})
  const navigate = useNavigate();

  const handelSubmit = (e) => {
    e.preventDefault()
    dispatch(signUpUserByEmailThunk(singupData))
  }

  useEffect(() => {
   if(authState.user && !authState.signupLoading) {
     navigate("/")
   }
  }, [authState.signupLoading])

  return (
    <div className=" pt-4">
      <h1 className="text-4xl text-center">SignUp</h1>
      <form onSubmit={handelSubmit} className="m-auto mt-4 w-full max-w-[24rem] px-2">
        <label className="mb-4 block">
          <p className="mb-2">Name</p>
          <input className="w-full p-2 bg-slate-300 focus:bg-white rounded border border-slate-50" type="text" required onChange={(e) => setSignupData((prev) => ({
            ...prev,
            name: e.target.value
          }))} />
        </label>
        <label className="mb-4 block">
          <p className="mb-2">Email</p>
          <input className="w-full p-2 bg-slate-300 focus:bg-white rounded border border-slate-50"  type="email" required onChange={(e) => setSignupData((prev) => ({
            ...prev,
            email: e.target.value
          }))}/>
        </label>
        <label className="mb-4 block">
          <p className="mb-2">Password</p>
          <input minLength={8} className="w-full p-2 bg-slate-300 focus:bg-white rounded border border-slate-50"  type="password" required onChange={(e) => setSignupData((prev) => ({
            ...prev,
            password: e.target.value
          }))}/>
        </label>
        <div className="text-center">
            <Button type="submit" variant="contained" className="w-32" >
               <span></span>
                {
                    authState.signupLoading ? <CircularProgress size={25} color="inherit" /> : "SignUp"
                }
            </Button>
        </div>
       
      </form>
    </div>
  );
};

export default Signup;

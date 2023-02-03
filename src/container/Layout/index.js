import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import { validateUserThunk } from "../../redux/thunks/authThunks";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.authReducer);

  useEffect(() => {
  
    if (authState.validateUserLoading) {
      dispatch(validateUserThunk());
    }

    if (!authState.validateUserLoading && !authState.user) {
      navigate("/login");
    }
  }, [authState.validateUserLoading, authState.user]);

  if (authState.validateUserLoading) {
    return (
      <div className="flex flex-row justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;

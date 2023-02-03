import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOutThunk } from "../../redux/thunks/authThunks";

const Header = () => {
  const authState = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(signOutThunk());
  };
  return (
    <header className="flex flex-row justify-between px-2 py-4 items-center bg-gray-200	">
      <div>
        <NavLink className="text-lg" to={"/"}>
          Play Quiz
        </NavLink>
      </div>
      <nav className="flex flex-row">
        {!authState.user ? (
          <>
            <NavLink
              className={({ isActive }) =>
                `px-2 ${isActive ? "text-blue-600" : ""}`
              }
              to={"/login"}
            >
              Login
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `px-2 ${isActive ? "text-blue-600" : ""}`
              }
              to={"/singup"}
            >
              Signup
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              className={({ isActive }) =>
                `px-2 ${isActive ? "text-blue-600" : ""}`
              }
              to={"/"}
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `px-2 ${isActive ? "text-blue-600" : ""}`
              }
              to={"/my-quiz"}
            >
              My Quiz
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `px-2 ${isActive ? "text-blue-600" : ""}`
              }
              to={"/play-quiz"}
            >
              Play Quiz
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `px-2 ${isActive ? "text-blue-600" : ""}`
              }
              to={"/results"}
            >
              Results
            </NavLink>
            <button
              className=" bg-transparent px-2 m-0 text-inherit"
              onClick={handleLogOut}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;

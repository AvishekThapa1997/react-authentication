import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AUTH_ACTIONS } from "../../store/AuthContextProvider";
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const { authState, dispatch } = useContext(AuthContext);
  const logoutHandler = (event) => {
    dispatch({
      type: AUTH_ACTIONS.logout,
    });
  };
  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!authState.token && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {authState.token && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {authState.token && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;

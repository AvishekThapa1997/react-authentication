import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import classes from "./AuthForm.module.css";
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authState, signUpUser, signInUser] = useAuth();
  const history = useHistory();
  //const [_authState] = useContext(AuthContext);
  useEffect(() => {
    if (authState.status) {
      clearInputs();
      history.replace("/");
    }
  }, [authState.status, history]);
  const emailRef = useRef();
  const passwordRef = useRef();
  const clearInputs = () => {
    emailRef.current.value = "";
    passwordRef.current.value = "";
  };
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (isLogin) {
      signInUser(email, password);
      return;
    }
    signUpUser(email, password);
  };
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            required
            ref={emailRef}
            className={authState.loading && classes.disabled}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordRef}
            className={authState.loading && classes.disabled}
          />
        </div>
        <div className={classes.actions}>
          {authState.loading ? (
            <p className={classes.loading}>Loading...</p>
          ) : (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}

          <button
            type="button"
            className={classes.toggle}
            disabled={authState.loading}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
      {authState.error && (
        <h1 className={classes.error}>{authState.error.message}</h1>
      )}
    </section>
  );
};

export default AuthForm;

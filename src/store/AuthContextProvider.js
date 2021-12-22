import { createContext, useEffect, useReducer, useMemo } from "react";

const tokenExpirationRemainingTime = (expirationTime) => {
  return expirationTime - new Date().getTime();
  //   const diffInTime = (new Date().getTime() - updateTime) / 1000;
  //   return expirationTime - diffInTime;
};
const getCacheToken = () => {
  const data = localStorage.getItem("token");
  const parseData = JSON.parse(data);
  let tokenExpirationTime = 0;
  if (parseData) {
    tokenExpirationTime = tokenExpirationRemainingTime(parseData.expireIn);
    console.log(tokenExpirationTime);
    if (tokenExpirationTime > 300000) {
      return [parseData.token, tokenExpirationTime];
    }
  }
  return ["", tokenExpirationTime];
};
let logoutTimeoutEvent;
const authReducer = (prevState, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.login:
    case AUTH_ACTIONS.updatePassword: {
      const tokenExpirationTime =
        new Date().getTime() + +action.payload.expiresIn * 1000;
      const remainingTimeForTokenExpiration =
        tokenExpirationRemainingTime(tokenExpirationTime);
      if (logoutTimeoutEvent) {
        clearTimeout(logoutTimeoutEvent);
      }
      logoutTimeoutEvent = setTimeout(
        action.logoutHandler,
        remainingTimeForTokenExpiration
      );
      cacheToken({
        expireIn: tokenExpirationTime,
        token: action.payload.idToken,
      });
      return {
        token: action.payload.idToken,
      };
    }
    case AUTH_ACTIONS.logout: {
      if (logoutTimeoutEvent) {
        clearTimeout(logoutTimeoutEvent);
      }
      removeCacheToken();
      return {
        ...prevState,
        token: "",
      };
    }
    default: {
      return prevState;
    }
  }
};
const cacheToken = (data) => {
  localStorage.setItem("token", JSON.stringify(data));
};
const removeCacheToken = () => {
  localStorage.removeItem("token");
};

export const AUTH_ACTIONS = {
  login: "login",
  logout: "logout",
  updatePassword: "updatePassword",
};
export const AuthContext = createContext();
const AuthContextProvider = (props) => {
  const [cacheToken, tokenExpirationTime] = useMemo(() => getCacheToken(), []);
  useEffect(() => {
    if (tokenExpirationTime > 0) {
      logoutTimeoutEvent = setTimeout(() => {
        dispatch({
          type: AUTH_ACTIONS.logout,
        });
      }, tokenExpirationTime);
    }
    return () => {
      if (logoutTimeoutEvent) {
        clearTimeout(logoutTimeoutEvent);
      }
    };
  }, [cacheToken, tokenExpirationTime]);
  const INITIAL_AUTHSTATE = useMemo(() => {
    return { token: cacheToken };
  }, [cacheToken]);
  const [authState, dispatch] = useReducer(authReducer, INITIAL_AUTHSTATE);
  return (
    <AuthContext.Provider value={{ authState, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContextProvider;

import axiosInstance from "./axiosInstance";
import { useState, useContext } from "react";
import { AuthContext } from "../store/AuthContextProvider";
import { AUTH_ACTIONS } from "../store/AuthContextProvider";
const useAuth = () => {
  const [authState, setAuthState] = useState({});
  const { dispatch } = useContext(AuthContext);
  const userAuthentication = async (email, password, url) => {
    setAuthState({
      loading: true,
    });
    try {
      const response = await axiosInstance.post(url, {
        email: email,
        password: password,
        returnSecureToken: true,
      });
      console.log(response.data);
      setAuthState({
        status: "success",
        ...response.data,
      });
      dispatch({
        type: AUTH_ACTIONS.login,
        payload: response.data,
        logoutHandler: () => {
          dispatch({
            type: AUTH_ACTIONS.logout,
          });
        },
      });
    } catch (err) {
      setAuthState(err.response.data);
    }
  };
  const signUpUser = (email, password) => {
    userAuthentication(email, password, "accounts:signUp");
  };
  const signInUser = (email, password) => {
    userAuthentication(email, password, "accounts:signInWithPassword");
  };
  return [authState, signUpUser, signInUser];
};

const useProfileUpdate = () => {
  const { authState, dispatch } = useContext(AuthContext);
  const [profileUpdateState, setProfileUpdateState] = useState({});
  const updatePassword = async (newPassword) => {
    setProfileUpdateState({
      loading: true,
    });
    try {
      const response = await axiosInstance.post("accounts:update", {
        idToken: authState.token,
        password: newPassword,
        returnSecureToken: true,
      });
      setProfileUpdateState({
        status: "success",
        message: "Password Updated Successfully!!",
      });
      dispatch({
        type: AUTH_ACTIONS.updatePassword,
        payload: response.data,
        logoutHandler: () => {
          dispatch({
            type: AUTH_ACTIONS.logout,
          });
        },
      });
    } catch (err) {
      setProfileUpdateState({
        status: "failed",
        message: err.response.data.message,
      });
    }
  };
  return { profileUpdateState, updatePassword };
};
export { useProfileUpdate, useAuth };

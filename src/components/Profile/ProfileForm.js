import classes from "./ProfileForm.module.css";
import { useRef, useEffect } from "react";
import { useProfileUpdate } from "../../lib/auth";
import { useHistory } from "react-router-dom";
const ProfileForm = () => {
  const history = useHistory();
  const { profileUpdateState, updatePassword } = useProfileUpdate();
  useEffect(() => {
    if (profileUpdateState.status === "success") {
      newPasswordRef.current.value = "";
      history.replace("/");
    }
  }, [profileUpdateState.status, history]);
  const newPasswordRef = useRef();
  const passwordChangeHandler = (event) => {
    event.preventDefault();
    const enteredPassword = newPasswordRef.current.value;
    updatePassword(enteredPassword);
  };
  return (
    <>
      <form className={classes.form} onSubmit={passwordChangeHandler}>
        <div className={classes.control}>
          <label htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" ref={newPasswordRef} />
        </div>
        <div className={classes.action}>
          <button>Change Password</button>
        </div>
      </form>
      {(profileUpdateState.status || profileUpdateState.loading) && (
        <p>{profileUpdateState.message ?? "Loading..."}</p>
      )}
    </>
  );
};

export default ProfileForm;

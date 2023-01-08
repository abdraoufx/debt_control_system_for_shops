import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HOME_PAGE } from "../../App";
import { auth } from "../../firebase/firebase-config";

type Props = {};

type userData = {
  email: string;
};

const ForgotPassword = (props: Props) => {
  const defaultFormData: userData = {
    email: "",
  };

  const [formData, setFormData] = useState<userData>(defaultFormData);
  const [userNotFound, setUserNotFound] = useState<boolean>(false);
  const [checkEmailMsg, setCheckEmailMsg] = useState<boolean>(false);

  const setValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userNotFound) setUserNotFound(false);
    if (checkEmailMsg) setCheckEmailMsg(false);

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const changePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    sendPasswordResetEmail(auth, formData.email)
      .then(() => {
        setCheckEmailMsg(true);
      })
      .catch((err) => {
        setUserNotFound(true);
      });
  };

  return (
    <main className="main flex justify-center items-center">
      <div className="sign-users">
        <h3 className="sign-users__title">Forgot Password</h3>
        <form action="#" className="sign-users__form" onSubmit={changePassword}>
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              id="email"
              required
              onChange={setValues}
            />
          </label>
          {checkEmailMsg && (
            <div className="redirect">Check Your Email Inbox</div>
          )}
          {userNotFound && <div className="user-err">User Not Found</div>}
          <button
            type="submit"
            className={`submit-user ${userNotFound && "btn-disabled"}`}
          >
            Change Password
          </button>
          <div className="redirect">
            already have an account?{" "}
            <Link to={`${HOME_PAGE}/login`}>Login</Link>
          </div>
          <div className="redirect">
            don't have an account?{" "}
            <Link to={`${HOME_PAGE}/sign-up`}>Sign Up</Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ForgotPassword;

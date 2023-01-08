import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContextAPI } from "../../context/auth/AuthContext";
import { auth } from "../../firebase/firebase-config";

type Props = {};

interface UserData {
  email: string;
  password: string;
}

const Login = (props: Props) => {
  const { setCurrentUser, currentUser } = useContext(AuthContextAPI);

  const defaultFormData: UserData = {
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState<UserData>(defaultFormData);
  const [userNotFound, setUserNotFound] = useState<boolean>(false);

  const navigate = useNavigate();

  const setValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userNotFound) setUserNotFound(false);

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const loginUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((resp) => {
        localStorage.setItem("user", JSON.stringify(resp.user));
        setCurrentUser({
          email: resp.user.email,
          displayName: resp.user.displayName,
          uid: resp.user.uid,
        });
        navigate("/dashboard");
      })
      .catch((err) => {
        setUserNotFound(true);
      });
  };

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    }
  });

  return (
    <main className="main flex justify-center items-center">
      <div className="sign-users">
        <h3 className="sign-users__title">Login To Account</h3>
        <form action="#" className="sign-users__form" onSubmit={loginUser}>
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
          <label htmlFor="password">
            Password
            <input
              type="password"
              name="password"
              id="password"
              required
              onChange={setValues}
            />
          </label>
          {userNotFound && (
            <div className="user-err">Check Your Password Or Email.</div>
          )}
          <button type="submit" className="submit-user">
            Sign In
          </button>
          <div className="redirect">
            don't have an account? <Link to="/sign-up">Sign Up</Link>
          </div>
          <div className="redirect">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;

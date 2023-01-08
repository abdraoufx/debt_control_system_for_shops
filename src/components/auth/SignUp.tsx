import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebase-config";
import { AuthContextAPI } from "../../context/auth/AuthContext";
import { HOME_PAGE } from "../../App";

type Props = {};

interface UserData {
  username: string;
  email: string;
  password: string;
}

const SignUp = (props: Props) => {
  const { currentUser } = useContext(AuthContextAPI);

  const defaultFormData: UserData = {
    username: "",
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [userExists, setUserExists] = useState<boolean>(false);

  const navigate = useNavigate();

  const setValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userExists) setUserExists(false);

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const createUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((resp) => {
        updateProfile(resp.user, { displayName: formData.username });
        navigate(`${HOME_PAGE}/login`);
      })
      .catch((err) => {
        setUserExists(true);
      });
  };

  useEffect(() => {
    if (currentUser) navigate(`${HOME_PAGE}/dashboard`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="main flex justify-center items-center">
      <div className="sign-users">
        <h3 className="sign-users__title">Create Your Account</h3>
        <form action="#" className="sign-users__form" onSubmit={createUser}>
          <label htmlFor="username">
            Username
            <input
              type="text"
              name="username"
              id="username"
              required
              onChange={setValues}
            />
          </label>
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
              minLength={8}
              required
              onChange={setValues}
            />
          </label>
          {userExists && <div className="user-err">User Already Exists</div>}
          <button
            type="submit"
            className={`submit-user ${userExists && "btn-disabled"}`}
          >
            Sign Up
          </button>
          <div className="redirect">
            already have an account?{" "}
            <Link to={`${HOME_PAGE}/login`}>Login</Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignUp;

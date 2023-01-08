import {
  updateEmail,
  updatePassword,
  updateProfile,
  User,
} from "firebase/auth";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HOME_PAGE } from "../../App";
import { AuthContextAPI } from "../../context/auth/AuthContext";
import { auth } from "../../firebase/firebase-config";
import "../../sass/pages/_edit-page.scss";

interface userDataToUpdate {
  username: string;
  email: string;
  password: string;
}

type Props = {};

const EditProfile = (props: Props) => {
  const { currentUser, setCurrentUser } = useContext(AuthContextAPI);

  const defaultFormData: userDataToUpdate = {
    username: "",
    email: "",
    password: "",
  };

  const [isInputsShowed, setIsInputsShowed] = useState<boolean>(false);
  const [userFormData, setUserFormData] =
    useState<userDataToUpdate>(defaultFormData);
  const [errMsg, setErrMsg] = useState<string>("");

  // Refs
  const userNameInp = useRef<HTMLInputElement>(null!);
  const emailInp = useRef<HTMLInputElement>(null!);

  const changeUserProfile = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const { username, email, password } = userFormData;

    if (!username && !email && !password) {
      setErrMsg("No Data Changed");
      return;
    }

    if (username) {
      // Here We Update Only The UserName
      updateProfile(auth.currentUser as User, {
        displayName: username,
      })
        .then(() => {
          const userFromLocal =
            JSON.parse(localStorage.getItem("user") as string) || null;

          if (userFromLocal) {
            userFromLocal.displayName = username;
            setCurrentUser(userFromLocal);
            localStorage.setItem("user", JSON.stringify(userFromLocal));
          }
        })
        .catch(() => {
          setErrMsg("An Error Aqquired, Try Again");
        });
    }

    if (email) {
      // Here We Update Only The Email
      updateEmail(auth.currentUser as User, email)
        .then(() => {
          const userFromLocal =
            JSON.parse(localStorage.getItem("user") as string) || null;

          if (userFromLocal) {
            userFromLocal.email = email;
            setCurrentUser(userFromLocal);
            localStorage.setItem("user", JSON.stringify(userFromLocal));
          }
        })
        .catch((error) => {
          setErrMsg("An Error Aqquired, Try Again");
        });
    }

    if (password) {
      // Here We Update Only The Password.
      updatePassword(auth.currentUser as User, password).catch((error) => {
        setErrMsg("Password Didn't Changed, Try Again");
      });
    }

    setIsInputsShowed(false);
  };

  const setValues = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (errMsg) setErrMsg("");

    setUserFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const cancelChanges = (): void => {
    setErrMsg("");
    setIsInputsShowed(false);
  };

  useEffect(() => {
    if (userNameInp.current)
      userNameInp.current.value = currentUser?.displayName ?? "";
    if (emailInp.current) emailInp.current.value = currentUser?.email ?? "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInputsShowed]);

  return (
    <main className="main flex justify-center items-center py-2 text-white">
      <div className="edit-wrapper">
        <div className="edit-wrapper__head">
          {!isInputsShowed && (
            <Link to={`${HOME_PAGE}/dashboard`} className="back-to-home">
              back
            </Link>
          )}
          <h1 className="title">Edit Profile</h1>
        </div>
        {!isInputsShowed ? (
          <div className="edit-wrapper__user-data">
            <div className="name">
              <span className="title">Name:</span>
              <p className="username">{currentUser?.displayName}</p>
            </div>
            <div className="email">
              <span className="title">Email:</span>
              <p>{currentUser?.email}</p>
            </div>
            <div className="btn-wrapper">
              <button
                className="btn-wrapper__btn"
                onClick={() => setIsInputsShowed(true)}
              >
                edit profile
              </button>
            </div>
          </div>
        ) : (
          <>
            <form
              action="#"
              className="submit-data"
              onSubmit={changeUserProfile}
            >
              <label htmlFor="username">
                <span>Username:</span>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter New Username"
                  ref={userNameInp}
                  onChange={setValues}
                />
              </label>

              <label htmlFor="email">
                <span>Email:</span>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter Your New Email"
                  ref={emailInp}
                  onChange={setValues}
                />
              </label>

              <label htmlFor="password">
                <span>Password:</span>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter Your New Password"
                  onChange={setValues}
                />
              </label>

              {errMsg && <div className="user-err">{errMsg}</div>}

              <div className="btns">
                <button className="btns__save" type="submit">
                  save
                </button>
                <button className="btns__cancel" onClick={cancelChanges}>
                  cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
};

export default EditProfile;

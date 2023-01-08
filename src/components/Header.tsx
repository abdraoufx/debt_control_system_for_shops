import { deleteUser, signOut } from "firebase/auth";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HOME_PAGE } from "../App";
import { AuthContextAPI } from "../context/auth/AuthContext";
import { auth } from "../firebase/firebase-config";
import "../sass/pages/_header.scss";

type Props = {};

const Header = (props: Props) => {
  const { currentUser, setCurrentUser } = useContext(AuthContextAPI);

  const getUserName = (): string | null => {
    if (currentUser?.displayName) return currentUser?.displayName;
    return null;
  };

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [errOnSignOutOrDel, setErrOnSignOutOrDel] = useState<boolean>(false);

  const navigate = useNavigate();

  const clearUserAndLocalStorage = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        clearUserAndLocalStorage();
        navigate(`${HOME_PAGE}/login`);
      })
      .catch((error) => {
        setErrOnSignOutOrDel(true);
      });
  };

  const delUser = () => {
    const user = auth.currentUser;

    if (user) {
      deleteUser(user)
        .then(() => {
          clearUserAndLocalStorage();
          navigate("/login");
        })
        .catch((err) => {
          setErrOnSignOutOrDel(true);
        });
    }
  };

  return (
    <header className="main-header bg-light-black relative">
      <div className="main-header__container flex px-4 flex-wrap items-center justify-between h-[60px] relative">
        <img className="logo" src="/images/logo.png" alt="Logo" />
        <div className="user-info flex gap-3">
          <p className="capitalize text-white font-normal">
            welcome,{" "}
            <span className="name font-bold">{getUserName() ?? "unknown"}</span>
          </p>
          <img
            src="/images/settings.svg"
            alt="Settings"
            className="show-settings cursor-pointer"
            onClick={() => setShowSettings(!showSettings)}
          />
        </div>
      </div>
      <ul
        className={`settings bg-dark-black ${
          showSettings ? "showed" : "unshowed"
        }`}
      >
        <li onClick={() => navigate(`${HOME_PAGE}/edit-profile`)}>
          Edit Profile
        </li>
        <li onClick={signOutUser}>Sign Out</li>
        <li onClick={delUser}>Delete Account</li>
      </ul>
      <div className={`err-box ${errOnSignOutOrDel ? "showed" : "unshowed"}`}>
        <div className="img-wrapper flex justify-end">
          <img
            src="/images/customers-page/close-icon.svg"
            alt="Close Icon"
            onClick={() => setErrOnSignOutOrDel(false)}
          />
        </div>
        <span>An Error Aqquired, Try Again.</span>
      </div>
    </header>
  );
};

export default Header;

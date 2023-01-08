import React from "react";
import { Link } from "react-router-dom";
import { HOME_PAGE } from "../../App";

type Props = {};

const HomeHeader = (props: Props) => {
  return (
    <header className="home__header">
      <img src="/images/logo.png" alt="Logo" className="logo" />
      <div className="navigate-side">
        <button className="navigate-side__sign-up">
          <Link to={`${HOME_PAGE}/sign-up`}>sign up</Link>
        </button>
        <button className="navigate-side__sign-in">
          <Link to={`${HOME_PAGE}/login`}>login</Link>
        </button>
      </div>
    </header>
  );
};

export default HomeHeader;

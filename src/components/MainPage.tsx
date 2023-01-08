import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContextAPI } from "../context/auth/AuthContext";
import Header from "./Header";
import NavBar from "./navBar_components/NavBar";
import NavigatedLink from "./NavigatedLink";

type Props = {
  children: React.ReactNode;
};

const MainPage = ({ children }: Props) => {
  const { currentUser } = useContext(AuthContextAPI);

  const expandNav = () => {
    document.querySelector(".main-nav")?.classList.toggle("is-expanded");
  };

  if (!currentUser) {
    return <Navigate to="/login" />;
  } else {
    return (
      <main className="main-page">
        <Header />
        <NavBar />
        <section className="main-section bg-dark-black px-4 py-2 flex flex-col col-span-6">
          <div className="navigated-link mb-1 flex justify-between items-center">
            <NavigatedLink />
            <img
              src="/images/hamburger.svg"
              alt="Hamburger Icon"
              className="w-[25px] z-[100] navigated-link__icon"
              onClick={expandNav}
            />
          </div>
          {children}
        </section>
      </main>
    );
  }
};

export default MainPage;

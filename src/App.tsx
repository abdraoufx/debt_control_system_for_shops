import React from "react";
import UserContext from "./context/UserContext";
import Dashboard from "./components/navBar_components/Dashboard";
import Debters from "./components/navBar_components/Debters";
import SalaryScheduele from "./components/navBar_components/SalaryScheduele";
import TAOTC from "./components/navBar_components/TAOTC";
import Calculator from "./components/mainSection_components/Calculator";
import Notes from "./components/navBar_components/Notes";
import MissingItems from "./components/navBar_components/MissingItems";
import AboutMe from "./components/navBar_components/AboutMe";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import MainPage from "./components/MainPage";
import ForgotPassword from "./components/auth/ForgotPassword";
import AuthContext from "./context/auth/AuthContext";
import EditProfile from "./components/auth/EditProfile";
import Home from "./components/home/Home";
import "./sass/main.scss";
import { Route, Routes } from "react-router-dom";

export const HOME_PAGE =
  "https://abdraoufx.github.io/debt_control_system_for_shops/build";

function App() {
  return (
    <>
      <UserContext>
        <AuthContext>
          <Routes>
            <Route path={`${HOME_PAGE}/`} element={<Home />} />
            <Route path={`${HOME_PAGE}/sign-up`} element={<SignUp />} />
            <Route path={`${HOME_PAGE}/login`} element={<Login />} />
            <Route
              path={`${HOME_PAGE}/forgot-password`}
              element={<ForgotPassword />}
            />
            <Route
              path={`${HOME_PAGE}/edit-profile`}
              element={<EditProfile />}
            />
            <Route
              path={`${HOME_PAGE}/dashboard`}
              element={
                <MainPage>
                  <Dashboard />
                </MainPage>
              }
            />
            <Route
              path={`${HOME_PAGE}/debters`}
              element={
                <MainPage>
                  <Debters />
                </MainPage>
              }
            />
            <Route
              path={`${HOME_PAGE}/salary-scheduele`}
              element={
                <MainPage>
                  <SalaryScheduele />
                </MainPage>
              }
            />
            <Route
              path={`${HOME_PAGE}/taotc`}
              element={
                <MainPage>
                  <TAOTC />
                </MainPage>
              }
            />
            <Route
              path={`${HOME_PAGE}/calculator`}
              element={
                <MainPage>
                  <Calculator />
                </MainPage>
              }
            />
            <Route
              path={`${HOME_PAGE}/notes`}
              element={
                <MainPage>
                  <Notes />
                </MainPage>
              }
            />
            <Route
              path={`${HOME_PAGE}/missing-items`}
              element={
                <MainPage>
                  <MissingItems />
                </MainPage>
              }
            />
            <Route
              path={`${HOME_PAGE}/about-me`}
              element={
                <MainPage>
                  <AboutMe />
                </MainPage>
              }
            />
          </Routes>
        </AuthContext>
      </UserContext>
    </>
  );
}

export default App;

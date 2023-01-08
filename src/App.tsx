import React, { useEffect } from "react";
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
import { auth } from "./firebase/firebase-config";

function App() {
  useEffect(() => {
    console.log(auth);
  }, []);
  return (
    <>
      <UserContext>
        <AuthContext>
          <Routes>
            <Route path={`/`} element={<Home />} />
            <Route path={`/sign-up`} element={<SignUp />} />
            <Route path={`/login`} element={<Login />} />
            <Route path={`/forgot-password`} element={<ForgotPassword />} />
            <Route path={`/edit-profile`} element={<EditProfile />} />
            <Route
              path={`/dashboard`}
              element={
                <MainPage>
                  <Dashboard />
                </MainPage>
              }
            />
            <Route
              path={`/debters`}
              element={
                <MainPage>
                  <Debters />
                </MainPage>
              }
            />
            <Route
              path={`/salary-scheduele`}
              element={
                <MainPage>
                  <SalaryScheduele />
                </MainPage>
              }
            />
            <Route
              path={`/taotc`}
              element={
                <MainPage>
                  <TAOTC />
                </MainPage>
              }
            />
            <Route
              path={`/calculator`}
              element={
                <MainPage>
                  <Calculator />
                </MainPage>
              }
            />
            <Route
              path={`/notes`}
              element={
                <MainPage>
                  <Notes />
                </MainPage>
              }
            />
            <Route
              path={`/missing-items`}
              element={
                <MainPage>
                  <MissingItems />
                </MainPage>
              }
            />
            <Route
              path={`/about-me`}
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

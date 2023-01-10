import React from "react";
import "../../sass/pages/_home.scss";
import Content from "./Content";
import Footer from "./Footer";
import HomeHeader from "./HomeHeader";

type Props = {};

const Home = (props: Props) => {
  return (
    <main className="main home">
      <HomeHeader />
      <Content />
      <Footer />
    </main>
  );
};

export default Home;

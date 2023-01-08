import React from "react";
import "../../sass/pages/_home.scss";
import Content from "./Content";
import HomeHeader from "./HomeHeader";

type Props = {};

const Home = (props: Props) => {
  return (
    <main className="main home">
      <HomeHeader />
      <Content />
    </main>
  );
};

export default Home;

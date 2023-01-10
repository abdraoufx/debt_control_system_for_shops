import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="home__footer capitalize text-center text-white mt-[20px] px-[15px]">
      copyright &copy; {new Date().getFullYear() + " "}
      <a
        href="https://www.facebook.com/AbdRaouf.zk/"
        target="_blank"
        rel="noreferrer"
        className="font-bold capitalize transition-colors"
      >
        abdeRaouf Zemmal
      </a>{" "}
      | all rights reserved.{" "}
    </footer>
  );
};

export default Footer;

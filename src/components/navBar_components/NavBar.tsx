import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContextAPI } from "../../context/UserContext";
import "../../sass/pages/_navbar.scss";

type Props = {};

interface navBarFncsInt {
  filterTheDash: (word: string) => string;
}

export const navBarFncs: navBarFncsInt = {
  filterTheDash: (word: string) => {
    let wordWithoutDash: string[] = word.split("");
    wordWithoutDash.splice(wordWithoutDash.indexOf("-"), 1, " ");

    const result: string = wordWithoutDash.join("");
    return result;
  },
};

const NavBar = (props: Props) => {
  const { setSelectedLink } = useContext(UserContextAPI);

  const navFunctions: string[] = [
    "dashboard",
    "debters",
    "salary-scheduele",
    "taotc",
    "calculator",
    "notes",
    "missing-items",
  ];

  const navigate = useNavigate();

  const renderNavFunction = (arr: string[]): JSX.Element[] => {
    const { filterTheDash } = navBarFncs;

    return arr.map((word, idx) => {
      const wordContainsDash: boolean = word.split("").includes("-");

      const toggleSelected = (e: React.MouseEvent) => {
        if (!e.currentTarget.classList.contains("selected")) {
          document
            .querySelector(".main-nav .selected")
            ?.classList.remove("selected");
          e.currentTarget.classList.add("selected");

          if (
            document
              .querySelector(".main-nav")
              ?.classList.contains("is-expanded")
          ) {
            document
              .querySelector(".main-nav")
              ?.classList.remove("is-expanded");
          }
        }
      };

      return (
        <div
          className={`${word} ${
            word === "taotc" ? "uppercase" : "capitalize"
          } ${idx === 0 && "selected"} `}
          key={wordContainsDash ? filterTheDash(word) : word}
          onClick={(e: React.MouseEvent) => {
            toggleSelected(e);
            navigate(`/${word}`);
            setSelectedLink(word);
          }}
        >
          {wordContainsDash ? filterTheDash(word) : word}
        </div>
      );
    });
  };

  const clickingAboutMe = () => {
    navigate(`/about-me`);
    setSelectedLink("about-me");
    document.querySelector(".main-nav .selected")?.classList.remove("selected");
  };

  return (
    <nav
      className={`main-nav w-[300px] bg-light-black text-center text-[20px] inline-flex flex-col justify-between
      h-full`}
    >
      <div className="main-nav__functions flex flex-col">
        {renderNavFunction(navFunctions)}
      </div>
      <div
        className="main-nav__about capitalize text-dark-violet font-bold"
        onClick={clickingAboutMe}
      >
        about me
      </div>
    </nav>
  );
};

export default NavBar;

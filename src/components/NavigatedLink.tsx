import React, { useContext } from "react";
import { UserContextAPI } from "../context/UserContext";
import { navBarFncs } from "./navBar_components/NavBar";

type Props = {};

const NavigatedLink = (props: Props) => {
  const { selectedLink } = useContext(UserContextAPI),
    { filterTheDash } = navBarFncs;

  return (
    <span
      className={`navigated-link__title font-semibold text-white text-[21px] capitalize`}
    >
      {selectedLink === "taotc"
        ? "The Arrival Of The Commedity"
        : selectedLink.includes("-")
        ? filterTheDash(selectedLink)
        : selectedLink}
    </span>
  );
};

export default NavigatedLink;

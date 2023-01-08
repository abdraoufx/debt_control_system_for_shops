import React from "react";

type Props = {
  currentPage: string;
};

const Loader = ({ currentPage }: Props) => {
  return (
    <div className="loader-container">
      <div className="loader-container__loader animate-spin"></div>
      <span className="loader-container__name">loading {currentPage}...</span>
    </div>
  );
};

export default Loader;

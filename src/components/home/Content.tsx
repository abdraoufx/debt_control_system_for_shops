import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* 
    * TODO:
    1 => Make Img Transparent.
    2 => Make The Intro Words.
    3 => Make A sIMPLE fOOTER aND YOUR dONE
*/

type Props = {};

const Content = (props: Props) => {
  const boxesContainer = useRef<HTMLDivElement>(null!);

  const toggleOpacityAnimtion = () => {
    const DELAY: number = 600;

    setTimeout(() => {
      boxesContainer.current.classList.replace("unshow", "show");
    }, DELAY);
  };

  useEffect(() => {
    toggleOpacityAnimtion();
  }, []);

  return (
    <section className="home__content">
      <div className="txt-and-btn">
        <h1 className="txt-and-btn__title">With Us:</h1>
        <p className="txt-and-btn__intro">Your Shop Debt Managment Is Easy.</p>
        <button className="txt-and-btn__get-started">
          <Link to="/dashboard">Get Started</Link>
        </button>
      </div>
      <div className="techs-used">
        <h3 className="techs-used__title">Technolgies Used In This Project:</h3>
        <div className="techs-used__boxes unshow" ref={boxesContainer}>
          <div className="box react">
            <h3 className="type">Front End:</h3>
            <div className="image">
              <div className="react-img">
                <img
                  src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpewlehh.com%2Fimages%2Freact.png&f=1&nofb=1&ipt=ad7de16eda754007c793c02f212f7d3aa5252e37aaccb95c5f33c3795c5b5247&ipo=images"
                  alt="React Logo"
                />
                <span className="tech-name">React</span>
              </div>
            </div>
          </div>
          <div className="box firebase">
            <h3 className="type">Backend + DB:</h3>
            <div className="image">
              <div className="firebase-img">
                <img
                  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.icon-icons.com%2Ficons2%2F2699%2FPNG%2F512%2Ffirebase_logo_icon_171157.png&f=1&nofb=1&ipt=b60f41e3be9be486593316f28fb946883675ea421660a2301592fc986104df14&ipo=images"
                  alt="Firebase Logo"
                />
                <span className="tech-name">Firebase</span>
              </div>
            </div>
          </div>
          <div className="box sass-and-tailwind">
            <h3 className="type">Styling:</h3>
            <div className="images">
              <div className="sass-and-tailwind-imgs">
                <div className="sass">
                  <img
                    src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.freebiesupply.com%2Flogos%2Flarge%2F2x%2Fsass-1-logo-png-transparent.png&f=1&nofb=1&ipt=ed7de9993a2c994e6bf45d2a9d761148a2fd34a049f6e99c10eea206d04d97ad&ipo=images"
                    alt="Sass Logo"
                  />
                  <span className="tech-name">Sass</span>
                </div>
                <span className="plus">+</span>
                <div className="tailwind">
                  <img
                    src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flabinator.com%2Fwordpress-marketplace%2Fwp-content%2Fuploads%2F2020%2F07%2FTailwind-CSS-Logo.png&f=1&nofb=1&ipt=c980414260d7c0c31207257407206d02a4d4b9b970a1d5103183515fa7996e37&ipo=images"
                    alt="Tailwind Logo"
                  />
                  <span className="tech-name">Tailwind</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;

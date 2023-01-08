import React, { useContext, useEffect } from "react";
import { editClassOnMount } from "./functions/editClassOnMount";
import "../../sass/pages/navBar/_About-me.scss";
import { UserContextAPI } from "../../context/UserContext";

type Props = {};

const AboutMe = (props: Props) => {
  const { setSelectedLink } = useContext(UserContextAPI);

  useEffect(() => {
    editClassOnMount(
      ".main-nav__functions .about-me",
      setSelectedLink,
      "about-me"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="main-section__about-me flex flex-wrap-reverse sm:flex-nowrap gap-2">
      <div className="txt text-white">
        <p className="small-bio">
          My Name Is AbdeRaouf, Iam a Front End Developer. <br />
          <span className="hobbies capitalize">
            I enjoy turning complex ideas that come to my mind or ask me into
            games, websites, portfolios, challenges ...
          </span>
        </p>
        <div className="contact text-2xl mt-5">
          <h4 className="contact__title capitalize">contact links:</h4>
          <div className="contact__links flex gap-1 items-center">
            <a
              href="https://twitter.com/abdraoufx"
              target="_blank"
              rel="noreferrer"
            >
              <i className="ri-twitter-fill"></i>
            </a>
            <a
              href="https://www.facebook.com/AbdRaouf.zk/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="ri-facebook-circle-fill"></i>
            </a>
            <a
              href="https://github.com/abdraoufx"
              target="_blank"
              rel="noreferrer"
            >
              <i className="ri-github-fill"></i>
            </a>
            <a
              href="https://www.frontendmentor.io/profile/abdraoufx"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fres.cloudinary.com%2Fpracticaldev%2Fimage%2Ffetch%2Fs--U6E1tTP8--%2Fc_fill%2Cf_auto%2Cfl_progressive%2Ch_320%2Cq_auto%2Cw_320%2Fhttps%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Forganization%2Fprofile_image%2F1390%2Ff6c7428b-c890-4c97-a586-352a887caad6.png&f=1&nofb=1&ipt=fb270cdf0e819b2a0b8e3a68793f9c30122df111c99e49075f4567e950e782e4&ipo=images"
                alt="Front End Mentor Svg Icon"
                className="w-[20px] relative bottom-[2px]"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="img-wrapper w-full max-w-[310px] mx-auto mb-4 sm:mx-0">
        <img
          src="/images/me.jpg"
          alt="Me"
          className="img-wrapper__img rounded-[50%] border-[1.5px] border-solid border-violet"
        />
      </div>
    </section>
  );
};

export default AboutMe;

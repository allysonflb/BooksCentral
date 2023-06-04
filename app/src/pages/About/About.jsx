import React from "react";
import "./About.css";
import aboutImg from "../../images/Sobre.jpeg";

const About = () => {
  return (
    <section className="about">
      <div className="container-fluid">
        <div className="section-title">
          <h2>Sobre</h2>
        </div>
        <div className="about-content grid">
          <div className="about-img">
            <img src = {aboutImg} alt="about" />
          </div>
          <div className="about-text">
            <h2 className="about-title fs-26 ls-1">BooksCentral</h2>
            <h9 className="fs-20">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias, et
              soluta! Accusantium autem dolores repudiandae sed porro cupiditate
              cumque eum libero, impedit exercitationem iure repellat adipisci
              magnam necessitatibus, ducimus vero.
            </h9>
            <h9 className="fs-20">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Reiciendis, rem odio. Nulla sapiente, iste minus, quod eaque
              asperiores non blanditiis similique ipsam excepturi a optio
              exercitationem et inventore impedit voluptas.
            </h9>
          </div>  
        </div>
      </div>
    </section>
  );
};

export default About;

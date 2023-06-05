import React from "react";
import "./About.css";
import aboutImg from "../../images/Sobre.jpeg";
import { Container, Row, Col } from "react-bootstrap";

const About = () => {
  return (
    <section className="about">
      <Container fluid>
        <div className="section-title">
          <h2>Sobre</h2>
        </div>
        <Row className="about-content">
          <Col md={6} className="about-img">
            <img src={aboutImg} alt="about" />
          </Col>
          <Col md={6} className="about-text">
            <h2 className="about-title fs-26 ls-1">BooksCentral</h2>
            <h6>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias, et
              soluta! Accusantium autem dolores repudiandae sed porro cupiditate
              cumque eum libero, impedit exercitationem iure repellat adipisci
              magnam necessitatibus, ducimus vero.
            </h6>
            <h6>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Reiciendis, rem odio. Nulla sapiente, iste minus, quod eaque
              asperiores non blanditiis similique ipsam excepturi a optio
              exercitationem et inventore impedit voluptas.
            </h6>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;

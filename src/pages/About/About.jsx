import React from "react";
import "./About.css";
import aboutImg from "../../images/Sobre.jpeg";
import gitimg from "../../images/GitHub_Logo.png";
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
            <div className="about-container grid">
              <h2 className="about-title">Bem-vindo ao BooksCentral</h2>
              <p className="about-description">
                No BooksCentral, estamos apaixonados por livros e acreditamos no
                poder que eles têm de transformar vidas. Nossa missão é ajudar
                você visitante a encontrar livros que deseja conhecer,
                fornecendo uma plataforma onde você pode descobrir, compartilhar
                e explorar uma vasta gama de livros emocionantes.
              </p>
              <p className="about-description">
                O BooksCentral é um projeto acadêmico que nasceu de uma ideia
                apaixonante.
              </p>
              <p className="about-description">
                Comece a explorar hoje mesmo a vasta quantidade de livros
                disponibilizados a serem buscados.
              </p>
            </div>
            <div className="made-with-love">
              <p>
                Made with ♥ by <span className="text-danger">Allyson</span>
              </p>
              <div className="social-icons grid">
                <a
                  href="https://www.linkedin.com/in/allysonflb/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={"https://img.shields.io/static/v1?message=LinkedIn&logo=linkedin&label=&color=0077B5&logoColor=white&labelColor=&style=for-the-badge"}
                    alt="linkedin logo"
                  />
                </a>
                <a
                  href="https://github.com/allysonflb"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={gitimg}
                    alt="github logo"
                  />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;

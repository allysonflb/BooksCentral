import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Loading from '../Loader/Loader';
import coverImg from '../../images/capa_nao_encontrada..jpeg';
import './BookDetails.css';
import { useNavigate } from 'react-router-dom';

const URL = 'https://openlibrary.org/works/';

const BookDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [books, setBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    async function getBook() {
      try{
        const response = await fetch(`${URL}${id}.json`);
        const data = await response.json();
        console.log("data, book details");
        console.log(data);

        if(data){
          const {description, title, covers, subject_places, subject_times, subjects} = data;
          let newDescription = description ? description : 'Sem descrição';
          if (typeof newDescription === 'object' && newDescription.type === '.value') {
            newDescription = newDescription.value;
          } else if (typeof newDescription === 'object' && newDescription.type === '/type/text') {
            newDescription = newDescription.value;
          }
          const newBook = {
            description: newDescription,
            title: title ? title : 'Sem título',
            covers: covers ? `https://covers.openlibrary.org/b/id/${covers[0]}-L.jpg` : coverImg,
            subject_places: subject_places ? subject_places.join(', ') : 'Local não encontrado' ,
            subject_times: subject_times ? subject_times.join(', ') : 'Data não encontrada',
            subjects: subjects ? subjects.join(', ') : 'Assuntos não encontrados'
          };
          setBook(newBook);
        } else {
          setBook(null);
        }
        setLoading(false); 
      } catch(error){
        console.log(error);
        setLoading(false);
      }
    }
    getBook();
  }, [id]);

  if(loading) return <Loading />;

  return (
    <section className="book-details">
      <div className="container-fluid">
        <button type = 'button' className = 'btn btn-outline-dark custom-btn' onClick = {() => navigate(-1)}>Voltar</button>
        <div className="row book-details-content">
          <div className="col-md-4 book-details-img">
            <img src={books?.covers} alt = "capa do livro"/>
          </div>
          <div className="col-md-8 book-details-info">
            <div className="row book-details-item title">
              <div className="col-md-2">
                <h1>Título: </h1>
              </div>
              <div className="col-md-10">
                <h2>{books?.title}</h2>
              </div>
            </div>
            <div className="row book-details-item description">
              <div className="col-md-2">
                <h2>Descrição: </h2>
              </div>
              <div className="col-md-10">
                <span> {books?.description} </span>
              </div>
            </div>
            <div className="row book-details-item">
              <div className="col-md-2">
                <h2>Lugares: </h2>
              </div>
              <div className="col-md-10">
                <span>{books?.subject_places}</span>
              </div>
            </div>
            <div className="row book-details-item">
              <div className="col-md-2">
                <h2>Datas: </h2>
              </div>
              <div className="col-md-10">
                <span>{books?.subject_times}</span>
              </div>
            </div>
            <div className="row book-details-item">
              <div className="col-md-2">
                <h2>Assuntos: </h2>
              </div>
              <div className="col-md-10">
                <span>{books?.subjects}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default BookDetails
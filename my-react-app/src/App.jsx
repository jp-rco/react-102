import React, { useState, useEffect } from 'react';
import './App.css';
import simpsonslogo from './assets/The Simpsons.svg';
import notfound from './assets/NOT FOUND.jpeg';
import loading from './assets/loading.svg';

function App() {
  const [characterName, setCharacterName] = useState('Character name');
  const [quote, setQuote] = useState('Loading...');
  const [inputValue, setInputValue] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [secondErrorMessage, setSecondErrorMessage] = useState('');
  const [thirdErrorMessage, setThirdErrorMessage] = useState('');
  const [currentCharacter, setCurrentCharacter] = useState('');
  const [imageUrl, setImageUrl] = useState([loading]);

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await fetch('https://thesimpsonsquoteapi.glitch.me/quotes');
      const comments = await response.json();

      if (comments.length > 0) {
        const quote = comments[0].quote;
        const imageUrl = comments[0].image;
        const characterName = comments[0].character;

        setQuote(quote);
        setCharacterName(characterName);
        setCurrentCharacter(characterName);
        setImageUrl(imageUrl);
      } else {
        console.error('No se encontraron citas.');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  const clearInputs = () => {
    setInputValue('');
    setNameFilter('');
  };

  const handleFetchButtonClick = async () => {
    await fetchQuote();
    clearInputs();
  };

  const handleSendButtonClick = async () => {
    try {
      const numFrases = parseInt(inputValue);
  
      const response = await fetch(`https://thesimpsonsquoteapi.glitch.me/quotes?count=${numFrases}&character=${currentCharacter}`);
      const data = await response.json();
  
      const commentsText = data.map((item, index) => {
        const numSecuencial = index + 1;
        return (
          <p key={index}>{numSecuencial}. {item.quote}</p>
        );
      });
  
      setQuote(commentsText);
    } catch (error) {
      console.error('Error fetching data:', error);
      setQuote("Error al cargar los datos.");
    }
    clearInputs();
  };
  

  const handleFilterButtonClick = async () => {
    try {
      const response = await fetch(`https://thesimpsonsquoteapi.glitch.me/quotes?character=${nameFilter}`);
      const data = await response.json();

      if (data.length > 0) {
        const quote = data[0].quote;
        const imageUrl = data[0].image;

        setQuote(quote);
        setCurrentCharacter(nameFilter);
        setCharacterName(nameFilter);
        setImageUrl(imageUrl);
      } else {
        setQuote(`No se encontraron frases para ${nameFilter}.`);
        setCharacterName('');
        setImageUrl([notfound]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setQuote("Error al cargar los datos.");
    }
    clearInputs();
  };

  const handleSecondInputChange = (e) => {
    const inputValue = e.target.value.trim();
    if (isNaN(inputValue)) {
      setSecondErrorMessage('La entrada debe ser un número');
    } else {
      setSecondErrorMessage('');
    }
    setInputValue(inputValue);
  };

  const handleThirdInputChange = (e) => {
    const thirdInputValue = e.target.value.trim();
    const lettersRegex = /^[a-zA-Z\s]*$/; 
    if (!lettersRegex.test(thirdInputValue)) {
      setThirdErrorMessage('La entrada debe contener solo letras');
    } else {
      setThirdErrorMessage('');
    }
    setNameFilter(thirdInputValue);
  };

  return (
    <div className="container">
      <div className="encabezado">
         <img className="logo" src={simpsonslogo} alt="the simpsons logo" />
      </div>
      <div className="all">
        <div className="principal">
          <div className="image-container">
            <p id="name">{characterName}</p>
            <img id="image" src={imageUrl} alt="Simpsons Image" />
          </div>
          <p id="quote">{quote}</p>
        </div>
        <div className="buttons">
          <div className="primer">
            <button id="fetchbutton" onClick={handleFetchButtonClick}>NUEVO PERSONAJE</button>
          </div>
          <div className="segundo">
            <div className="error">
              <span className="error-message">{secondErrorMessage}</span>
            </div>
            <div className="frases">
              <input
                id="input"
                type="text"
                name="taskText"
                autoComplete="off"
                placeholder="# frases"
                value={inputValue}
                onChange={handleSecondInputChange}
              />
              <button className="send" onClick={handleSendButtonClick}>Enviar</button>
            </div>
          </div>
          <div className="tercero">
            <div className="error2">
              <span className="error-message">{thirdErrorMessage}</span>
            </div>
            <div className="nombre">
              <input
                id="input-f"
                type="text"
                name="taskText"
                autoComplete="off"
                placeholder="Nombre personaje"
                value={nameFilter}
                onChange={handleThirdInputChange}
              />
              <button id="filtrob" className="send" onClick={handleFilterButtonClick}>Filtrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

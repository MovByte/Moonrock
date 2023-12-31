import React, { useState } from 'react';
import './App.css';

function Game({ title, image }) {
 const [showModal, setShowModal] = useState(false);

 const handleClick = () => {
    setShowModal(true);
 };

 const handleClose = () => {
    setShowModal(false);
 };

 return (
    <div className="game" onClick={handleClick}>
      <img src={image} alt={title} />
      <h2>{title}</h2>
      {showModal && (
        <div className="game-modal">
          <img src={image} alt={title} />
          <h2>{title}</h2>
          <button onClick={handleClose}>Close</button>
        </div>
      )}
    </div>
 );
}

function GameList({ games }) {
 const [view, setView] = useState('list');

 const renderGames = () => {
    if (view === 'list') {
      return games.map((game) => <div key={game.title}>{game.title}</div>);
    } else {
      return games.map((game) => <Game key={game.title} title={game.title} image={game.image} />);
    }
 };

 return (
    <div className="game-list">
      <button onClick={() => setView('list')}>List View</button>
      <button onClick={() => setView('card')}>Card View</button>
      {renderGames()}
    </div>
 );
}

function App() {
 const games = [
    { title: 'Game 1', image: 'https://via.placeholder.com/200' },
    { title: 'Game 2', image: 'https://via.placeholder.com/200' },
 ];

 return (
    <div className="App">
      <header>
        <h1>Title</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/settings">Settings</a>
          <a href="/donate">Donate</a>
        </nav>
      </header>
      <main>
        <input type="text" placeholder="Search" />
        <GameList games={games} />
      </main>
    </div>
 );
}

export default App;
import React from 'react';

const GameModal = ({ game, onClose }) => {
 return (
    <div className="game-modal">
      <img src={game.image} alt={game.name} />
      <h2>{game.name}</h2>
      <button onClick={onClose}>Close</button>
    </div>
 );
};

export default GameModal;
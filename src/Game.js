import React from 'react';

const Game = ({ name, image, onClick }) => {
 return (
    <div className="game" onClick={onClick}>
        <h2>{name}</h2>
        <img src={image} alt={name} />
    </div>
 );
};

export default Game;
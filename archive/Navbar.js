import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className='navbar'>
                <div className='buttons-container'>
                <Link to="/" className='nav-button'>Home</Link>
                <Link to="/login" className='nav-button'>Login</Link>
                <Link to="https://donate.astroid.gg" className='nav-button'>Donate</Link>
            </div>
        </nav>
    );
}

export default Navbar;
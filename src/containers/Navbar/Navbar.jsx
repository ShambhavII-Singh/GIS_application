import React, { useState } from 'react';
import HamburgerIcon from 'calcite-ui-icons-react/HamburgerIcon';
import XIcon from 'calcite-ui-icons-react/XIcon';
import logo from '../../assets/images/logo.png';

import './Navbar.css';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <nav className='app__navbar'>
      <div className='app__navbar-logo'>
        <img src={logo} alt="logo" />
      </div>
      <ul className='app__navbar-links'>
        <li className='p__opensans'>
          <a href="#home">
            Home
          </a>
        </li>
        <li className='p__opensans'>
          <a href="#about">
            About
          </a>
        </li>
      </ul>
      <div className='app__navbar-login'>
        <a href='#map' className='p__opensans'>Find your route?</a>
      <div />
        <a href='/' className='p__opensans'>Statistics</a>
      </div>
      <div className='app__navbar-smallscreen'>
        <HamburgerIcon color='#FFFDDD' fontSize={27} onClick={()=>{setToggleMenu(true);}} />
        {toggleMenu &&(
          <>
            <div className='app__navbar-smallscreen_overlay flex__center slide-bottom'>
              <XIcon  color='#DCCA87' fontSize={27} className='overlay__close' onClick={()=>{setToggleMenu(false);}} />
              <ul className='app__navbar-smallscreen-links'>
                <li className='p__opensans'>
                  <a href="#home">
                    Home
                  </a>
                </li>
                <li className='p__opensans'>
                  <a href='#map'>Find your route?</a>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  )
};

export default Navbar;
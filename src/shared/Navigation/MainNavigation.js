import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import "./MainNavigation.css"


const MainNavigation = () => {

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };
  
  return (
    <nav>
      <ul>
      <NavLinks />   
      </ul>
    </nav>
  );
};

export default MainNavigation;

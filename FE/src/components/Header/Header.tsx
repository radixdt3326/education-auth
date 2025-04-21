"use client";
import { useState } from 'react';
import Link from 'next/link';
import "./header.css";
import React from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Toggle the mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header>
      <div className="header-container">
        <div className="logo">
          <Link href="/">My Next.js App</Link>
        </div>
        <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li onClick={toggleMenu}>
              <Link href="/">SignIn</Link>
            </li>
            <li onClick={toggleMenu}>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </nav>
        <button className="hamburger" onClick={toggleMenu}>
          <span className="hamburger-icon"></span>
          <span className="hamburger-icon"></span>
          <span className="hamburger-icon"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;

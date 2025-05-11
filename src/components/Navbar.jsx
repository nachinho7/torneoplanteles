import React from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src="/assets/Cuenta/sintmo.png" alt="Sin TMO" className="navbar-logo" />
      </div>

      <div className="navbar-content">
      <div className="navbar-center">
        <h2>Santiago Lopez Saavedra</h2>
        <span>@comentarista.rugby</span>
      </div>

      <div className="navbar-right">
        <a href="https://www.instagram.com/comentarista.rugby/" target="_blank" rel="noreferrer">
          <img src="/assets/Icons/instagram.png" alt="Instagram" />
        </a>
        <a href="https://open.spotify.com/episode/0Rb3EofHbgLqGFMAgeYylL?si=rVkVk8VYSDG20YaYSlg_Dw" target="_blank" rel="noreferrer">
          <img src="/assets/Icons/spotify.png" alt="Spotify" />
        </a>
        <a href="https://x.com/comentarista.rugby" target="_blank" rel="noreferrer">
          <img src="/assets/Icons/twitter.png" alt="Twitter" />
        </a>
        <a href="https://www.tiktok.com/@comentarista.rugby" target="_blank" rel="noreferrer">
          <img src="/assets/Icons/tiktok.png" alt="TikTok" />
        </a>
      </div>
      </div>
    </div>
  );
};

export default Navbar;

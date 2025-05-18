import React from "react";
import './Rodape.css'
import { Link  } from "react-router-dom";

const Rodape = ({fb_link, ig_link, tw_link}) => {
  return (
    <footer>
      <div className="footer-content">
        <img src="/imagens/logo.png" alt="ShareCondo Logo" className="share-condo-logo" />
        <div className="social-icons">
          <Link to={fb_link}> <img src="/imagens/facebook-icon.png" className="social-media-logo" alt="Facebook" /></Link>
          <Link to= {ig_link}> <img src="/imagens/instagram-icon.png" className="social-media-logo" alt="Instagram" /></Link>
          <Link to= {tw_link}> <img src="/imagens/twitter-icon.png" className="social-media-logo" alt="Twitter" /></Link>
        </div>
      </div>
    </footer>
  );
};

export default Rodape;

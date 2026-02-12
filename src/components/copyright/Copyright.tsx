import React from 'react';
import './Copyright.css';
import { IonIcon } from '@ionic/react';
import { logoGithub, logoX } from 'ionicons/icons';

const Copyright: React.FC = () => {
  const startYear = 2020;
  const currentYear = new Date().getFullYear();
  
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <div className="copyright-container">
      <div className="copyright-content">
        <span className="copyright-text">© {startYear} - {currentYear} coturiv. All rights reserved.</span>
        <div className="social-links">
          <a href="https://github.com/coturiv/crypto-i" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
            <IonIcon icon={logoGithub} className="social-icon" />
          </a>
          <a href="https://x.com/coturiv" target="_blank" rel="noopener noreferrer" aria-label="X profile">
            <IonIcon icon={logoX} className="social-icon" />
          </a>
        </div>
      </div>
      <div className="updated-row">
        <span className="updated-text">Latest updated: {today}</span>
      </div>
    </div>
  );
};

export default Copyright;

import React from 'react';
import './Copyright.css';

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
        <span className="updated-text">Latest updated: {today}</span>
      </div>
    </div>
  );
};

export default Copyright;

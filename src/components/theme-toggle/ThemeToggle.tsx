import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { moonOutline, sunnyOutline } from 'ionicons/icons';
import { useTheme } from '../../theme/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <IonButton fill="clear" onClick={toggleTheme} className="theme-toggle">
      <IonIcon icon={theme === 'dark' ? moonOutline : sunnyOutline} />
    </IonButton>
  );
};

export default ThemeToggle;

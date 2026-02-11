import React, { useState } from 'react';
import { IonInput, IonButton, IonIcon, IonLabel } from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';

import './ShowHidePassword.css';

type Props = {
  [key: string]: any;
};

const ShowHidePassword: React.FC<Props> = (props: Props) => {
  const [encrypted, changeMode] = useState<boolean>(true);
  
  return (
    <div style={{ width: '100%', padding: '12px 16px' }}>
      <IonLabel style={{ display: 'block', fontSize: '1.2rem', marginBottom: '4px', color: 'rgba(var(--ion-color-primary-rgb), 0.7)', fontWeight: 600 }}>Key of the encryption</IonLabel>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <IonInput 
          placeholder="Enter key" 
          type={encrypted ? 'password' : 'text'} 
          onIonInput={e => props.onChange(e)}
          style={{ flex: 1, '--padding-top': '0', '--padding-bottom': '0', '--padding-start': '0', '--padding-end': '0', fontSize: '16px', margin: 0, minHeight: 'auto', '--color': 'var(--ion-color-step-700)' }}
        />
      
        <IonButton onClick={() => changeMode(!encrypted)} fill='clear' slot="end" style={{ margin: 0, height: '24px', '--padding-end': '0' }}>
          <IonIcon slot='icon-only' icon={encrypted ? eye : eyeOff} color='primary' style={{fontSize: '1.4em'}} />
        </IonButton>
      </div>
    </div>
  );
};

export default ShowHidePassword;

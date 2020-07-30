import React, { useState } from 'react';
import { IonInput, IonButton, IonIcon } from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';

import './ShowHidePassword.css';

type Props = {
  [key: string]: any;
};

const connect = function (Component: React.FC): React.FC<Props> {
  const ComponentWrapper = function (props: Props): JSX.Element {
      return <Component {...props} />;
  };

  return ComponentWrapper;
};


const ShowHidePassword: React.FC = (props: Props) => {
  const [encrypted, changeMode] = useState<boolean>(true);
  
  return (
    <React.Fragment>
      <IonInput placeholder="Key of the encryption" type={encrypted ? 'password' : 'text'} onIonChange={e => props.onChange(e)}/>
    
      <IonButton onClick={() => changeMode(!encrypted)} fill='clear'>
        <IonIcon slot='icon-only' icon={encrypted ? eye : eyeOff} color='secondary' style={{fontSize: '2.2em'}} />
      </IonButton>
    </React.Fragment>
    
  );
};

export default connect(ShowHidePassword);

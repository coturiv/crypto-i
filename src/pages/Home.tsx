import React, { useState } from 'react';
import { IonContent, IonPage, IonTextarea, IonItem, IonLabel, IonList, IonListHeader, IonInput, IonButton, IonIcon } from '@ionic/react';
import { copy } from 'ionicons/icons';

import * as CryptoJS from 'crypto-js';

import './Home.css';


const iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");

const encrypt = (message = '', key = '') => {
  return CryptoJS.AES.encrypt(message, key, {iv}).toString();
}

const decrypt = (message = '', key = '') => {
  return CryptoJS.AES.decrypt(message, key, {iv}).toString(CryptoJS.enc.Utf8);
}


const Home: React.FC = () => {
  const [message, setMessage] = useState<string>();
  const [secretPassphrase, setSecret] = useState<string>();
  const [outputText, setOutput] = useState<string>();

  const encryptText = () => {
    if (!message || !secretPassphrase) {
      return;
    }

    setOutput(encrypt(message, secretPassphrase));
  }

  const decryptText = () => {
    if (!message || !secretPassphrase) {
      return;
    }

    setOutput(decrypt(message, secretPassphrase));
  }

  const copyToClipboard = (e: any) => {
    navigator.clipboard.writeText(outputText || '');
  }


  return (
    <IonPage>
      <IonContent>
        <IonList lines="full" style={{width: '90%', maxWidth: '800px', margin: '0 auto', marginTop: '100px'}}>
          <IonListHeader lines="full">
            <IonLabel>
              <h1 style={{fontStyle: 'italic'}}>
                AES Encryption
              </h1>
              <p>
                Encrypt and decrypt text with AES algorithm
              </p>
            </IonLabel>
          </IonListHeader>

          <IonItem style={{marginTop: '24px'}}>
            <IonTextarea placeholder="Plain or encrypted text here" rows={6} value={message} onIonChange={e => setMessage(e.detail.value!)}></IonTextarea>
          </IonItem>
     
          <IonItem style={{marginTop: '24px'}}>
            <IonInput value={secretPassphrase} placeholder="Key of the encryption" onIonChange={e => setSecret(e.detail.value!)} clearInput></IonInput>  
          </IonItem>

          <IonItem lines="none">
            <div style={{width: '100%', marginTop: '24px'}} className="ion-text-end">
              <IonButton color="tertiary" onClick={encryptText}>Encrypt</IonButton>
              <IonButton color="dark" onClick={decryptText}>Decrypt</IonButton>
            </div>
          </IonItem>

          {outputText && outputText!.length > 0 &&
            <IonItem style={{marginTop: '64px'}}>
              <IonTextarea style={{overflow: 'hidden'}} autoGrow={true} readonly={true} value={outputText}></IonTextarea>
              <IonButton color='medium' fill='clear' onClick={copyToClipboard}>
                <IonIcon slot='icon-only' icon={copy} />
            </IonButton>
            </IonItem>
          }
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;

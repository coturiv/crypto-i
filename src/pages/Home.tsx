import React, { useState } from 'react';
import { IonContent, IonPage, IonTextarea, IonItem, IonList, IonLabel, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonSpinner } from '@ionic/react';
import { copy } from 'ionicons/icons';

import './Home.css';
import ShowHidePassword from '../components/show-hide-password/ShowHidePassword';
import ThemeToggle from '../components/theme-toggle/ThemeToggle';
import Copyright from '../components/copyright/Copyright';
import { encrypt, decrypt, VERSION } from '../utils';


const Home: React.FC = () => {
  const [message, setMessage] = useState<string>();
  const [secretPassphrase, setSecret] = useState<string>();
  const [outputText, setOutput] = useState<string>();
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const encryptText = () => {
    if (!message || !secretPassphrase) return;
    setIsEncrypting(true);
    setHasError(false);

    // Use setTimeout to allow the UI to update and show the spinner before starting the heavy operation
    setTimeout(() => {
      try {
        const result = encrypt(message, secretPassphrase);
        // Strip the version prefix for a cleaner display
        setOutput(result.replace(`${VERSION}:`, ''));
      } catch (e) {
        console.error("Encryption error:", e);
        setOutput("Encryption failed. Please check your input.");
        setHasError(true);
      } finally {
        setIsEncrypting(false);
      }
    }, 100);
  };

  const decryptText = () => {
    if (!message || !secretPassphrase) return;
    setIsDecrypting(true);
    setHasError(false);

    setTimeout(() => {
      try {
        let payload = message.trim();
        // Automatically attach the version prefix if it's missing
        if (payload && !payload.startsWith(`${VERSION}:`)) {
          payload = `${VERSION}:${payload}`;
        }
        
        const result = decrypt(payload, secretPassphrase);
        if (result) {
          setOutput(result);
        } else {
          setOutput("Decryption failed. Invalid key or message.");
          setHasError(true);
        }
      } catch (e) {
        console.error("Decryption error:", e);
        setOutput("Decryption failed. Please check your input.");
        setHasError(true);
      } finally {
        setIsDecrypting(false);
      }
    }, 100);
  };

  const copyToClipboard = (_: any) => {
    navigator.clipboard.writeText(outputText || '');
  };

  return (
    <IonPage>
      <IonContent className="ion-padding home-content">
        <div className="main-container">
          <div style={{ padding: '0 8px', marginTop: '32px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontStyle: 'italic', fontSize: '2.2rem', margin: 0, fontWeight: 700 }}>AES Encryption</h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--ion-color-medium)', marginTop: '4px' }}>
                Encrypt and decrypt text with AES algorithm
              </p>
            </div>
            <ThemeToggle />
          </div>

          <IonCard className="main-card">
            <IonCardContent style={{ paddingTop: '12px' }}>
              <IonList lines="none">
                <IonItem className="input-item">
                  <div style={{ width: '100%', padding: '12px 16px' }}>
                    <IonLabel style={{ display: 'block', fontSize: '1.2rem', marginBottom: '4px', color: 'rgba(var(--ion-color-primary-rgb), 0.7)', fontWeight: 600 }}>Message</IonLabel>
                    <IonTextarea
                      placeholder="Plain or encrypted text here"
                      rows={6}
                      value={message}
                      onIonInput={e => setMessage(e.detail.value!)}
                      className="custom-textarea"
                      style={{ '--padding-top': '0', '--padding-bottom': '0', '--padding-start': '0', '--padding-end': '0', fontSize: '16px', margin: 0, minHeight: 'auto', '--color': 'var(--ion-color-step-700)' }}
                    />
                  </div>
                </IonItem>

                <IonItem className="input-item">
                  <ShowHidePassword onChange={(e: any) => setSecret(e.detail.value!)} />
                </IonItem>

                <div className="button-group">
                    <IonButton 
                      color="primary" 
                      onClick={encryptText} 
                      className="action-button"
                      disabled={isEncrypting || isDecrypting}
                    >
                      {isEncrypting && <IonSpinner name="crescent" color="light" style={{ width: '18px', height: '18px', marginRight: '8px' }} />}
                      Encrypt
                    </IonButton>
                    <IonButton 
                      color="primary" 
                      fill="outline" 
                      onClick={decryptText} 
                      className="action-button"
                      disabled={isEncrypting || isDecrypting}
                    >
                      {isDecrypting && <IonSpinner name="crescent" color="primary" style={{ width: '18px', height: '18px', marginRight: '8px' }} />}
                      Decrypt
                    </IonButton>
                  </div>
              </IonList>
            </IonCardContent>
          </IonCard>

          {outputText && outputText.length > 0 && (
            <IonCard className="result-card" style={{ marginTop: '16px' }}>
              <IonCardHeader style={{ paddingBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <IonCardSubtitle style={{ 
                    fontSize: '1rem', 
                    color: hasError ? 'var(--ion-color-danger)' : 'inherit' 
                  }}>
                    {hasError ? 'Error' : 'Result'}
                  </IonCardSubtitle>
                  {!hasError && (
                    <IonButton fill="clear" onClick={copyToClipboard} size="small">
                      <IonIcon slot="icon-only" icon={copy} color="primary" />
                    </IonButton>
                  )}
                </div>
              </IonCardHeader>
              <IonCardContent>
                <div className="result-container">
                  <IonTextarea
                      value={outputText}
                      readonly={true}
                      autoGrow={true}
                      className="result-textarea"
                      style={{ '--color': hasError ? 'var(--ion-color-danger)' : 'var(--ion-color-step-700)' }}
                    />
                </div>
              </IonCardContent>
            </IonCard>
          )}
        </div>
        <Copyright />
      </IonContent>
    </IonPage>
  );
};

export default Home;

import { createContext, useContext } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const RecaptchaContext = createContext();

export const useRecaptcha = () => {
  const context = useContext(RecaptchaContext);
  if (!context) {
    throw new Error('useRecaptcha must be used within a RecaptchaProvider');
  }
  return context;
};

export const RecaptchaProvider = ({ children }) => {
  // Clave pública de reCAPTCHA (obtenida de Google Console)
  // IMPORTANTE: Esta es una clave de prueba, debes reemplazarla con tu clave real
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  const value = {
    siteKey: RECAPTCHA_SITE_KEY,
  };

  return (
    <RecaptchaContext.Provider value={value}>
      <GoogleReCaptchaProvider 
        reCaptchaKey={RECAPTCHA_SITE_KEY}
        scriptProps={{
          async: false,
          defer: false,
          appendTo: 'head',
          nonce: undefined,
        }}
      >
        {children}
      </GoogleReCaptchaProvider>
    </RecaptchaContext.Provider>
  );
};

export default RecaptchaProvider;
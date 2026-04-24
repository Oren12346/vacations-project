// Frontend entry point that initializes interceptors and restores the logged-in user.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from "react-router-dom";
import { interceptor } from './2-utils/interceptor';
import { Provider } from 'react-redux';
import store from './store/store';
import authService from './3-services/auth-service';

// Create the axios interceptor before rendering the application.
interceptor.create();
// Restore the logged-in user from the saved token on page refresh.
authService.initUserFromToken();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter >
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter >
  </StrictMode>

)
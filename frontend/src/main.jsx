import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './Context/Auth.jsx';
import { BrowserRouter } from 'react-router';
import { CartProvider } from './Context/Cart.jsx';
import { SocketProvider } from './Context/Socket.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

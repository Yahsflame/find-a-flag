import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { CountryProvider } from './contexts/CountryContext';
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <CountryProvider>
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard />
              } 
            />
          </Routes>
        </BrowserRouter>
      </CountryProvider>
  );
}

export default App;
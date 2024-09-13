import { Outlet } from 'react-router-dom';
import Navbar from './assets/Navbar';
import AuthContextProvider from './contexts/authContext/authContext';
import React from 'react';
import { UniversitiesProvider } from './contexts/universitiesContext';
function App() {
  return (
    <AuthContextProvider>
      <UniversitiesProvider>
        <Navbar />
        <Outlet/>
      </UniversitiesProvider>
    </AuthContextProvider>
  );
}

export default App

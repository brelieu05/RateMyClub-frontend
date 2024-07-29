import { Outlet } from 'react-router-dom';
import Navbar from './assets/Navbar';
import AuthContextProvider from './contexts/authContext/authContext';
import React from 'react';
function App() {
  return (
    <AuthContextProvider>
      <Navbar />
      <Outlet/>
    </AuthContextProvider>
  );
}

export default App

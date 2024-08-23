import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { ChakraProvider, extendTheme } from '@chakra-ui/react'

import { SignUp } from './pages/SignUp.tsx'
import { Login } from './pages/Login.tsx'
import { ClubReview } from './pages/ClubReview.tsx'
import { Browse } from './pages/Browse.tsx'
import { Reports } from './pages/Reports.tsx'
import NewHeroPage from './pages/NewHeroPage.tsx'
import NewBrowse from './pages/NewBrowse.tsx';
// import '@fontsource-variable/inter';

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  colors: {
    text: {
      primary: '#1E1E1E',
    },
  },
  styles: {
    global: {
      body: {
        color: 'text.primary', // Set the default text color
      },
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: '/',
        element: <NewHeroPage/>,
      },
      {
        path: '/SignUp',
        element: <SignUp/>
      },
      {
        path: '/Login',
        element: <Login/>
      },
      {
        path: '/:club_id',
        element: <ClubReview/>
      },
      {
        path: '/Browse',
        element: <NewBrowse/>
      },
      {
        path: '/Reports',
        element: <Reports/>
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router}>
        <App/>
      </RouterProvider>
    </ChakraProvider>
  </React.StrictMode>
)

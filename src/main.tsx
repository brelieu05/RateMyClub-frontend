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
import HeroPage from './pages/HeroPage.tsx'
// import '@fontsource-variable/inter';

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: '/',
        element: <HeroPage/>,
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
        path: '/:university/:club_name',
        element: <ClubReview/>
      },
      {
        path: '/Browse',
        element: <Browse/>
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

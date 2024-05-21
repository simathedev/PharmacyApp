import React from 'react';
import Navbar from './components/navbar';
import Shortcuts from './components/widgets/Shortcuts';
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    Collapse,
    Alert,
    AlertTitle,
    useTheme,
  } from "@mui/material";
  import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const theme=useTheme();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLargeScreen= useMediaQuery("(min-width:900px)");
    const isMediumScreen = useMediaQuery("(min-width:600px) and (max-width:800px)");
    const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isRegisterPage = location.pathname.startsWith('/register');
  const isSignInPage = location.pathname.startsWith('/signIn');
  const isSplashPage = location.pathname.startsWith('/splash');
  const isMainSignInPage = location.pathname.startsWith('/home');

  return (
    <div style={{backgroundColor:theme.palette.background.testing}}>
    {isHomePage ||isMainSignInPage|| isRegisterPage || isSplashPage ||isSignInPage ? null : <Navbar />}
      <main>{children}</main>
      {!isLargeScreen&&
      (isHomePage || isMainSignInPage||isRegisterPage ||isSplashPage || isSignInPage?
        null:
      <Shortcuts/>
      )
      }
      
      
    </div>
  );
};

export default Layout;
import React from 'react'
import Form from './form'
import { Grid, Box,useMediaQuery, Typography, Button, useTheme } from '@mui/material';
import Navbar from 'components/navbar';
import BackButton from 'components/buttons/BackButton';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const Index = () => {
  const theme=useTheme();
  const isNonMobileScreens= useMediaQuery("(min-width:600px)");
  const isLargeScreen= useMediaQuery("(min-width:900px)");
  const role = useSelector((state) => state.auth.role);
  const isPermitted=role==='pharmacist'||role==='admin';

  return (
    <Box sx={{minHeight:'100vh'}}>
      
      <Box sx={{ml:3}}>
        <Link to='/manage/medications' style={{textDecoration:'none'}}>
        <BackButton/>
        </Link>
      </Box>
     
  <Box sx={{alignItems:'center',textAlign:'center'}}>
  <Typography variant="h3">
           Add Bulk Medication
          </Typography>
  </Box>
   
      
     

    <Box
    width={isNonMobileScreens?"70%":"80%"}
    p="2rem"
    m="2rem auto"
    borderRadius="1.5rem"
    display="flex"
    flexDirection="column"
    backgroundColor={theme.palette.background.alt}
    minHeight="50vh"
    >
        <Form/>
    </Box>
    </Box>
  )
}

export default Index
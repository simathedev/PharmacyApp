import React from 'react'
import Form from './form'
import Navbar from 'components/navbar';
import BackButton from 'components/buttons/BackButton';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Grid, Box,useMediaQuery, Typography, Button, useTheme } from '@mui/material';
import NotPermitted from 'components/NotPermitted';


const Index = () => {
  const theme=useTheme();
  const role=useSelector((state)=>state.auth.role);
  const isNonMobileScreens= useMediaQuery("(min-width:600px)");
  const isPermitted=role==='pharmacist'||role==='admin';
  return (
<Box>
      
      <Box sx={{ml:3}}>
        <Link to='/admin/pharmacists' >
        <BackButton/>
        </Link>
      </Box>
      <Box sx={{alignItems:'center',textAlign:'center'}}>
      <Typography variant="h3">
     Edit Pharmacists
              </Typography>
      </Box>
    
      <Box
    width={isNonMobileScreens?"50%":"80%"}
    p="2rem"
    m="2rem auto"
    borderRadius="1.5rem"
    backgroundColor={theme.palette.background.alt}
    >
      {isPermitted?(
        <Form/>
      ):(
        <NotPermitted/>
      )}
    </Box>
    </Box>
  )
}

export default Index
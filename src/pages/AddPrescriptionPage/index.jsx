import React from 'react'
import Form from './form'
import { Grid, Box,useMediaQuery, Typography, Button, useTheme } from '@mui/material';
import Navbar from 'components/navbar';
import BackButton from 'components/buttons/BackButton';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Index = () => {
  const theme=useTheme();
  const isNonMobileScreens= useMediaQuery("(min-width:600px)");
  const role= useSelector((state) => state.auth.role);
  console.log(role)
  return (
     <Box sx={{minHeight:'100vh'}}>
      
      <Box sx={{ml:3}}>
        {role==='pharmacist'&&(
  <Link to='/manage/prescriptions' style={{textDecoration:'none'}} >
  <BackButton/>
  </Link>
        )}
        {role==='admin'&&(
  <Link to='/manage/prescriptions' style={{textDecoration:'none'}} >
  <BackButton/>
  </Link>
        )}
        {role==='user'&&(
  <Link to='/user/view/prescriptions' style={{textDecoration:'none'}} >
  <BackButton/>
  </Link>
        )}
      
      </Box>
      <Box sx={{alignItems:'center',textAlign:'center'}}>
      <Typography variant="h3">
                Prescription Information
              </Typography>
      </Box>
    
      <Box
    width={isNonMobileScreens?"50%":"80%"}
    p="2rem"
    m="2rem auto"
    borderRadius="1.5rem"
    backgroundColor={theme.palette.background.alt}
    >
        <Form/>
    </Box>
    </Box>
  )
}

export default Index
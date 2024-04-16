import React from 'react'
import Form from './form'
import Navbar from 'components/navbar';
import BackButton from 'components/buttons/BackButton';
import { Link } from 'react-router-dom';
import { Grid, Box,useMediaQuery, Typography, Button, useTheme } from '@mui/material';

const Index = () => {
  const theme=useTheme();
  const isNonMobileScreens= useMediaQuery("(min-width:600px)");
  return (
<Box>
      
      <Box sx={{ml:3}}>
        <Link to='/admin/pharmacies' >
        <BackButton/>
        </Link>
      </Box>
      <Box sx={{alignItems:'center',textAlign:'center'}}>
      <Typography variant="h3">
     Edit Pharmacy
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
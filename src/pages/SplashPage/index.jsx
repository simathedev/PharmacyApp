import React from 'react';
import { CgPill } from "react-icons/cg";
import { MdLocalPharmacy } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { BiPackage } from "react-icons/bi";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Grid, Box,useMediaQuery, Card, Typography, Button, useTheme } from '@mui/material';
import { BiSolidCircleHalf } from "react-icons/bi";
import { FaPills } from "react-icons/fa";


const Index = () => {
  const {palette} = useTheme();
  const theme = useTheme();
  const isLargeScreen= useMediaQuery("(min-width:900px)");
  const isMediumScreen = useMediaQuery("(min-width:600px) and (max-width:800px)");
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
     minHeight="100vh" // Ensure full viewport height
     backgroundColor={palette.primary.main}
    >
      <Box width={isSmallScreen ? '70%' : '60%'} display="flex" flexDirection="column">
      <Box display='flex' justifyContent='center' alignItems='center'>
  <BiSolidCircleHalf
    color={palette.background.alt}
    fontSize={isLargeScreen?'5rem':isMediumScreen?'3rem':'2.5rem'}
    style={{ transform: 'scaleX(-1)' }}
  />


      <Box  display='flex' flexDirection='column' alignItems='center'>
      {/*      <FaPills color={palette.background.alt} style={{paddingRight:'0.5rem'}} fontSize={isLargeScreen?'3.2rem':'2rem'}/> */}
        <Typography variant="h2" color={palette.background.alt} fontSize={isLargeScreen?'3.8rem':isMediumScreen?'4rem':'1.8rem'} fontWeight="bold" textAlign="center">
          Pharmacy App
        </Typography>
        <Typography  color={palette.background.alt} fontWeight="500" variant="h5" sx={{mb:"1.5rem" }}>
        Get Meds Conveniently.
        </Typography>
</Box>
      <BiSolidCircleHalf color={palette.background.alt} fontSize={isLargeScreen?'5rem':isMediumScreen?'3rem':'2.5rem'}/>
      </Box>
      
        
      </Box>
    </Box>
  );
};

export default Index;


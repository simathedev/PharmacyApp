import React from 'react';
import { CgPill } from "react-icons/cg";
import { MdLocalPharmacy } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { BiPackage } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import { Grid, Box,useMediaQuery, Card, Typography, Button, useTheme } from '@mui/material';
import { BiSolidCircleHalf } from "react-icons/bi";
import { FaPills } from "react-icons/fa";


const Index = () => {
  const {palette} = useTheme();
  const theme = useTheme();
  const navigate=useNavigate();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;
  const isLargeScreen= useMediaQuery("(min-width:900px)");
  const isMediumScreen = useMediaQuery("(min-width:600px) and (max-width:899px)");
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
 
  return (
    <Box
      display="flex"
      justifyContent="center"
     minHeight="100vh" // Ensure full viewport height
     backgroundColor={palette.primary.main}
    >
      <Box width={isSmallScreen ? '70%' : '60%'} marginTop={isLargeScreen?'40vh':isMediumScreen?'40vh':'35vh'} display="flex" flexDirection="column">
      <Box display='flex' justifyContent='center' alignItems='center'>
  <BiSolidCircleHalf
    color={palette.background.alt}
    fontSize={isLargeScreen?'5rem':isMediumScreen?'4rem':'2.5rem'}
    style={{ transform: 'scaleX(-1)' }}
  />


      <Box  display='flex' flexDirection='column' alignItems='center' justifyItems='center'>

      {/*      <FaPills color={palette.background.alt} style={{paddingRight:'0.5rem'}} fontSize={isLargeScreen?'3.2rem':'2rem'}/> */}
        <Typography variant="h2" color={palette.background.alt} fontSize={isLargeScreen?'3.2rem':isMediumScreen?'2.8rem':'1.5rem'} fontWeight="bold" textAlign="center">
          Pharmacy App
        </Typography>
        <Typography  color={palette.background.alt} fontWeight="500" variant={isLargeScreen?"h3":"h5"} sx={{mb:"1.5rem" }}>
        Get Meds Conveniently.
        </Typography>
</Box>
      <BiSolidCircleHalf color={palette.background.alt} fontSize={isLargeScreen?'5rem':isMediumScreen?'3rem':'2.5rem'}/>
      </Box>
      <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',width:'100%'}}>
      <Button variant='contained' 
      sx={{backgroundColor:alt,color:primary,borderRadius:6,width:isLargeScreen?'20%':isMediumScreen?'30%':'40%',marginTop:isLargeScreen?'3rem':'1.5rem'}}
      onClick={() => navigate('/home')}
      >
          Get Started
        </Button>
      </Box>
   
     
      </Box>
    </Box>
  );
};

export default Index;


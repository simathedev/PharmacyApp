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
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;
  const isLargeScreen= useMediaQuery("(min-width:900px)");
  const isMediumScreen = useMediaQuery("(min-width:600px) and (max-width:899px)");
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
 
  return (
    <Box
      display="flex"
      justifyContent="center"
     minHeight="100vh" // Ensure full viewport height
    >
      <Box width={isSmallScreen ? '70%' : '60%'} display="flex" flexDirection="column" marginTop={isLargeScreen?'7rem':isMediumScreen?'10rem':'5rem'}>
      
      <Box  display='flex' flexDirection='column' alignItems='center'>
      <FaPills color='#00A3FF' style={{paddingRight:'0.5rem'}} fontSize={isLargeScreen?'3.2rem':'2rem'}/>
        <Typography variant="h2" color="primary" fontWeight="bold" textAlign="center">
          Pharmacy App
        </Typography>
        <Typography fontWeight="500" variant="h5" sx={{mb:"1.5rem" }}>
        Get Meds Conveniently.
        </Typography>
</Box>
        <Grid container spacing={3} justifyContent="center">
          {[
            { icon: <FaUser />, text: 'User', link: '/signIn/user' },
            { icon: <MdLocalPharmacy />, text: 'Pharmacist', link: '/signIn/pharmacist' },
            { icon: <FaUserDoctor />, text: 'Admin', link: '/signIn/admin' },
            
          ].map((item, index) => (
        <Grid item key={index} xs={10} sm={7} sx={{display:'flex',flexDirection:'column'}}>
              <Link to={item.link} style={{ textDecoration: 'none' }}>
                <Card
                sx={{
                  display:"flex",
                flexDirection:"column",
                  textAlign:"center",
                  padding:isNonMobileScreens?"25px 10px":"16px 8px",
                  alignItems:"center",
                  justifyContent:"center",
                  backgroundColor:alt,
                  '&:hover': {
                    backgroundColor:primary,
                  color:alt,
                  }
                }}
                >
                  <Box>
                  {item.icon}
                  <Typography variant="subtitle1" mt={1}>
                    {item.text}
                  </Typography>
                  </Box>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Index;


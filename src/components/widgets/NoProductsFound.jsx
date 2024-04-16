import React from 'react';
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
    Card,
    Button,
    Grid
  } from "@mui/material";
import WidgetWrapper from 'components/WidgetWrapper';
import { GiMedicinePills } from "react-icons/gi";

const NoProductsFound = () => {
const {palette}=useTheme();
  return (
    <>
    <Box sx={{Width:'100%',mt:6, display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
    <GiMedicinePills fontSize='3rem' style={{ color: palette.primary.main }}/>
    <Typography variant='h1' color='primary' sx={{my:2,fontWeight:'bold'}}>No Products Found</Typography>
    <Button>
        Return to homepage
    </Button>
    </Box>    
    </>
   
  );
};

export default NoProductsFound;
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

const LoadingComponent = () => {
const {palette}=useTheme();
  return (
    <>
    <Box sx={{Width:'100%',mt:6, display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
    <Typography variant='h1' color='primary' sx={{my:2,fontWeight:'bold'}}>Loading...</Typography>
    </Box>    
    </>
   
  );
};

export default LoadingComponent;
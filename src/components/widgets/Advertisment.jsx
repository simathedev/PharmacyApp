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
    Grid
  } from "@mui/material";
import WidgetWrapper from 'components/WidgetWrapper';

const Advertisement = () => {

  return (
   <WidgetWrapper sx={{width:'80%',height:'40vh',textAlign:'center', mt:1}}>
    <Typography variant='h5' sx={{my:2}}>Advertisement</Typography>
   </WidgetWrapper>
   
  );
};

export default Advertisement;
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

const Loading = () => {
const {palette}=useTheme();

const theme = useTheme();
const neutralLight = theme.palette.neutral.light;
const dark = theme.palette.neutral.dark;
const background = theme.palette.background.default;
const primaryLight = theme.palette.primary.light;
const alt = theme.palette.background.alt;
const primary=theme.palette.primary.main;

const isNonMobile = useMediaQuery("(min-width:600px)");
const isLargeScreen= useMediaQuery("(min-width:900px)");
const isMediumScreen = useMediaQuery("(min-width:500px) and (max-width:800px)");


  return (
    <>
    <Box sx={{Width:'100%', height:"100vh",mt:25, display:'flex',flexDirection:'column',alignItems:'center'}}>
    <GiMedicinePills fontSize={isNonMobile?'3rem':'2rem'} style={{ color: primary }}/>
    <Typography variant={isNonMobile?'h1':'h4'} color='primary' sx={{my:2,fontWeight:'bold'}}>Loading...</Typography>
    </Box>    
    </>
   
  );
};

export default Loading;
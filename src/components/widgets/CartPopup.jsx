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

const CartPopup = ({ count }) => {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;
  return (
    <Box sx={{borderRadius:'50%',backgroundColor:alt,px:1,py:0.7,fontSize:'14px',position:'absolute',right:23}}>
      { <>{count}</>}
    </Box>
  );
};

export default CartPopup;
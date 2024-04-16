import React from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Typography, Grid, useTheme, useMediaQuery } from "@mui/material";


const BackButton = ({ onClick }) => {
  const theme=useTheme();
  return (
    <IconButton color="primary"
     onClick={onClick} 
     sx={{ borderRadius: '8px', padding: '8px', '&:hover': { color: theme.palette.primary.hovered } }}
     >
      <ArrowBackIcon /> 
     
    </IconButton>
  );
};

export default BackButton;
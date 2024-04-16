import React from 'react';
import IconButton from '@mui/material/IconButton';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Grid, Card, Box, Typography,useMediaQuery, TextField, InputAdornment, Button, useTheme, FormControl, MenuItem } from '@mui/material';
import { themeSettings } from 'theme';

const AddToCartButton = ({ onClick }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme=useTheme();
  return (
    <IconButton color="primary"
     onClick={onClick} 
     sx={{ fontSize:'16px', borderRadius: '8px', padding: isNonMobile?'5px':'2.5px', '&:hover': { color:theme.palette.primary.hovered } }}
     >
       <ShoppingCartOutlinedIcon/>
       <Typography variant="body1" sx={{fontSize:!isNonMobile&&'12px'}}>Add To Cart</Typography>
    </IconButton>
  );
};

export default AddToCartButton;

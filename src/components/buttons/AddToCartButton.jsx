import React from 'react';
import IconButton from '@mui/material/IconButton';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Grid, Card, Box, Typography,useMediaQuery, TextField, InputAdornment, Button, useTheme, FormControl, MenuItem } from '@mui/material';
import { themeSettings } from 'theme';

const AddToCartButton = ({ buttonColored,onClick }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;
  return (
    <IconButton color="primary"
     onClick={onClick} 
     //backgroundColor={buttonColored?primary:'none'}
     sx={{ backgroundColor:buttonColored?primary:'none', color:buttonColored&&alt,width:buttonColored&&'40%', fontSize:'16px', borderRadius: '8px', padding: buttonColored?'7px 3px':isNonMobile?'5px':'2.5px', '&:hover': { color:theme.palette.primary.hovered } }}
     >
       <ShoppingCartOutlinedIcon/>
       <Typography variant="body1" sx={{fontSize:!isNonMobile&&'12px'}}>Add To Cart</Typography>
    </IconButton>
  );
};

export default AddToCartButton;

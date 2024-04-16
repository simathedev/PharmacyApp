import React from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  Collapse,
  Alert,
  AlertTitle,
  useTheme,
} from "@mui/material";

const DeleteButton = ({ onClick }) => {
  const theme=useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

    return (
      <IconButton color="primary"
      onClick={onClick} 
      sx={{ borderRadius: '8px', fontSize:'16px', border: isNonMobile&&`1px solid ${theme.palette.primary.dark }`,width:isNonMobile&&'6rem', px:isNonMobile?'8px':'10px', '&:hover': { backgroundColor: theme.palette.primary.hovered, color:theme.palette.background.alt } }}
      >
        {
          isNonMobile?
          <>
           <DeleteIcon /> Delete
          </>
          :
          <>
           <DeleteIcon />
          </>
        }
       
      </IconButton>
    );
  };
  
  export default DeleteButton;
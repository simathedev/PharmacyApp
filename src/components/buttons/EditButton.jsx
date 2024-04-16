import React from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
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

const EditButton = ({ onClick }) => {
  const theme=useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <IconButton
      color="primary"
      onClick={onClick}
      sx={{ borderRadius: '8px',width:isNonMobile&&'6rem', fontSize:'16px', color:isNonMobile? theme.palette.background.alt:theme.palette.primary.main ,
      backgroundColor:isNonMobile&& ` ${theme.palette.primary.main }`, px:isNonMobile?'8px':'10px', '&:hover': { backgroundColor: theme.palette.primary.hovered } }}    >
         {
          isNonMobile?
          <>
           <EditIcon /> Edit
          </>:
          <>
          <EditIcon />
          </>
}
    </IconButton>
  );
};

export default EditButton;

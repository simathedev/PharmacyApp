import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
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

const AddButton = ({ onClick }) => {
  const theme=useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <IconButton
     onClick={onClick} 
     sx={{ borderRadius: '8px', fontSize:'16px', color:isNonMobile? theme.palette.background.alt:theme.palette.primary.main,backgroundColor:isNonMobile&& ` ${theme.palette.primary.main }`, width:isNonMobile&&'6rem', padding: '8px', '&:hover': { backgroundColor: theme.palette.primary.hovered,color:theme.palette.background.alt } }}
     >
{
  isNonMobile?
  <>
  <AddIcon /> Add
  </>
  :
<>
<AddIcon />
</>
}
    </IconButton>
  );
};

export default AddButton;

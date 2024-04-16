import React,{useState} from 'react';
import { Box, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,Typography,useTheme } from "@mui/material";
import WidgetWrapper from './WidgetWrapper';
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";

const DeleteItem = ( {open, onClose, onDelete, deleteItemId}) => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const{palette}=useTheme();
  const dark =palette.neutral.dark;
  const medium=palette.neutral.medium;
  const main=palette.neutral.main;

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2} }}>
    <DialogTitle>Confirm Deletion</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete this item?
      </DialogContentText>
    </DialogContent>
    <DialogActions  >
      <Button onClick={onClose} color="primary" variant="outlined" >
        No
      </Button>
      <Button onClick={() => onDelete(deleteItemId)} color="primary" variant="contained">
        Yes
      </Button>
    </DialogActions>
  </Dialog>
  );
};


export default DeleteItem;
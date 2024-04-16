import React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const CloseButton = ({ onClick }) => {
  return (
    <IconButton color="primary" onClick={onClick}>
      <CloseIcon />
    </IconButton>
  );
};

export default CloseButton;

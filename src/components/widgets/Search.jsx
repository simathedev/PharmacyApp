import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Grid, Card, 
    Box, Typography, TextField, 
    InputAdornment, Button, useTheme,
     FormControl, Select, MenuItem,useMediaQuery,
     CircularProgress
     } from '@mui/material';

const SearchWidget = ({ searchQuery, setSearchQuery, isNonMobile }) => {
  return (
    <Box sx={{ my: 4 }}>
      <TextField
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          sx: { borderRadius: 10 } // Customize input field style
        }}
        sx={{ mb: 2, width: isNonMobile ? "50%" : "70%" }}
      />
    </Box>
  );
};

export default SearchWidget;

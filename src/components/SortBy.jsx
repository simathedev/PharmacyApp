import React,{useState} from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { Grid, Card, Box,useMediaQuery, Typography, Button, useTheme, FormControl, Select, MenuItem } from '@mui/material';


const SortBy = ({ functionName,sortField }) => {
    const [sortBy, setSortBy] = useState('nameAsc');
    const sortedData = functionName.slice().sort((a, b) => {
        let name;
        name=sortField;
        switch (sortBy) {
          case 'nameAsc':
            return a.name.localeCompare(b.name);
          case 'nameDesc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });

  return (
    <Box sx={{borderRadius:'2%',padding:'2px 4px'}}>
            {/* Sort by dropdown */}
        <FormControl variant="outlined" sx={{ mb: 2 }}>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            displayEmpty
          >
            <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
            <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
          </Select>
        </FormControl>
  
    </Box>
  );
};

export default SortBy;
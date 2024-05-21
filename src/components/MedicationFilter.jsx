import React, { useState } from "react";
import { Box, Typography, Button, Checkbox, useTheme, FormGroup, FormControlLabel, TextField } from '@mui/material';

const MedicationFilter = ({pharmacy, handleFilter }) => {
  const [availability, setAvailability] = useState({
    instock: false,
    outofstock: false
  });
  const [selectedPharmacy, setSelectedPharmacy] = useState('');

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  const handleApplyFilter = () => {
    const filters = {
      availability: {
        instock: availability.instock,
        outofstock: availability.outofstock
      },
      pharmacy: selectedPharmacy
    };
    handleFilter(filters);
  };

  const handleClearFilter = () => {
    setAvailability({
      instock: false,
      outofstock: false
    });
    setSelectedPharmacy('');
    handleFilter({});
  };

  return (
    <Box>
      <Typography variant="h6">Medication Filter</Typography>

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={availability.instock}
              onChange={(e) => setAvailability({ ...availability, instock: e.target.checked })}
            />
          }
          label="In Stock"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={availability.outofstock}
              onChange={(e) => setAvailability({ ...availability, outofstock: e.target.checked })}
            />
          }
          label="Out of Stock"
        />
      </FormGroup>
      <Box mt={2} display='flex' gap='1'>
        <Button variant="contained" sx={{color:alt}} onClick={handleApplyFilter}>
          Apply Filter
        </Button>
        <Button variant="outlined" onClick={handleClearFilter} style={{ marginLeft: 8 }}>
          Clear Filter
        </Button>
      </Box>
    </Box>
  );
};

export default MedicationFilter;

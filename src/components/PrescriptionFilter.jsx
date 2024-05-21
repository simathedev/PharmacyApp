// PrescriptionFilter.js

import React, { useState } from "react";
import { Box, Typography, Button, useTheme, Checkbox, FormGroup, FormControlLabel, TextField } from '@mui/material';

const PrescriptionFilter = ({ handleFilter }) => {
  const [approved, setApproved] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApplyFilter = () => {
    const filter = {};
    if (approved !== null) {
      filter.approved = approved;
    }
    if (startDate && endDate) {
      filter.startDate = startDate;
      filter.endDate = endDate;
    }
    handleFilter(filter);
  };

  const handleClearFilter = () => {
    setApproved(null);
    setStartDate('');
    setEndDate('');
    handleFilter({});
  };

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent:'left', textAlign:'left', gap: 2 }}>
      <Typography sx={{fontWeight:'bold'}} gutterBottom>Approval Status:</Typography>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={approved === true} onChange={(e) => setApproved(e.target.checked ? true : null)} />}
          label="Approved"
        />
        <FormControlLabel
          control={<Checkbox checked={approved === false} onChange={(e) => setApproved(e.target.checked ? false : null)} />}
          label="Not Approved"
        />
      </FormGroup>

      <Typography sx={{fontWeight:'bold'}} gutterBottom>Date Range:</Typography>
      <Box sx={{ display: 'flex',flexDirection:'column', gap: 2 }}>
        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" sx={{color:alt}} onClick={handleApplyFilter}>Apply Filter</Button>
        <Button variant="outlined" onClick={handleClearFilter}>Clear Filter</Button>
      </Box>
    </Box>
  );
};

export default PrescriptionFilter;

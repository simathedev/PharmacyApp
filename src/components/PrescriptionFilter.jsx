import React, { useState } from "react";
import { Box, Typography, Button, Checkbox, FormGroup, FormControlLabel, TextField } from '@mui/material';

const PrescriptionFilter = ({ handleFilter }) => {
  const [approved, setApproved] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApplyFilter = () => {
    const filter = {};
    if (approved !== null) { // Check if approved is not null
      filter.approved = approved;
    }
    if (startDate && endDate) {
      filter.startDate = startDate;
      filter.endDate = endDate;
    }
    handleFilter(filter);
  };

  const handleClearFilter = () => {
    // Reset state values
    setApproved(null); // Change to null
    setStartDate('');
    setEndDate('');
    // Clear the filter by passing an empty filter object
    handleFilter({});
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent:'left', textAlign:'left', gap: 2 }}>
      <Typography sx={{fontWeight:'bold'}} gutterBottom>Approved:</Typography>
      <FormControlLabel
        control={<Checkbox checked={approved} onChange={(e) => setApproved(e.target.checked)} />}
        label="Approved"
      />

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
        <Button variant="contained" onClick={handleApplyFilter}>Apply Filter</Button>
        <Button variant="contained" onClick={handleClearFilter}>Clear Filter</Button>
      </Box>
    </Box>
  );
};

export default PrescriptionFilter;

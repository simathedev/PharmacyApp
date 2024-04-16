import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme } from '@mui/material';

const AvailableMedication = ({ medications }) => {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor:primary }}>
            <TableCell>
              <Typography variant="h6" fontWeight="bold" color={alt}>Medication Name</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" fontWeight="bold" color={alt}>Availability</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {medications.map((medication) => (
            <TableRow key={medication._id}>
              <TableCell>
                <Typography variant="body1">{medication.medication.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color={medication.medication.inStock ? 'success.light' : 'error.light'}>
                  {medication.medication.inStock ? 'In Stock' : 'Out of Stock'}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AvailableMedication;

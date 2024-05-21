import React from 'react';
import { useSelector } from "react-redux";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme } from '@mui/material';

const AvailableMedication = ({ medications }) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const alt = theme.palette.background.alt;
  const role=useSelector((state)=>state.auth.role);

  // Check if medications is an array before mapping over it
  if (!Array.isArray(medications) || medications.length === 0) {
    return (
      <Typography variant="body1" color="error">
        No medications available
      </Typography>
    );
  }

  return (
    <TableContainer >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: primary }}>
            <TableCell>
              <Typography variant="h6" fontWeight="bold" color={alt}>
                Medication Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" fontWeight="bold" color={alt}>
                Availability
              </Typography>
            </TableCell>
           
              {role!='user'&&(
                <>
                <TableCell>
                <Typography variant="h6" fontWeight="bold" color={alt}>
                Qty In Stock
                </Typography>
                </TableCell>
                </>
              )}
             
            <TableCell>
              <Typography variant="h6" fontWeight="bold" color={alt}>
                {role==='user'?'Qty Prescribed':'Qty Ordered'}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {medications.map((medication) => (
            <TableRow key={medication?._id}>
              <TableCell>
                <Typography variant="body1">{medication?.medication?.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold" color={medication.medication.inStock ? 'green' : 'red'}>
                  {medication?.medication?.inStock ? 'In Stock' : 'Out of Stock'}
                </Typography>
              </TableCell>
              {role!='user'&&(
<>
<TableCell>
  <Typography variant="body1">{medication?.medication?.quantity}</Typography>
</TableCell>
</>
              )}
    
<TableCell>
  <Typography variant="body1">{medication?.quantity}</Typography>
</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AvailableMedication;

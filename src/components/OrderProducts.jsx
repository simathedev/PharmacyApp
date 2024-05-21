import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';

const OrderProducts = ({ medications }) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  let apiUrlSegment=process.env.NODE_ENV === 'production' ?
  `https://pharmacy-app-api.vercel.app`
  :
  `http://localhost:3001`
  // Check if medications array exists before mapping over it
  if (!medications || medications.length === 0) {
    return (
      <Typography variant="body1">No medications found</Typography>
    );
  }

  return (
<Box sx={{display:'flex'}}>
      {medications.map((medication, index) => (
        <Box key={index} sx={{ width:'25%',borderRadius: '2%', padding: '2px 0px', marginTop: '1rem' }}>
          <img
            width={isNonMobile ? "70px" : "50px"}
            height={isNonMobile ? "70px" : "50px"}
            alt="medication"
            style={{ borderRadius: '10%' }}
            src={`${apiUrlSegment}/assets/${medication.medication?.picture}`}
          />
          <Box sx={{width:isNonMobile?'75%':'80%'}}>
          <Typography variant='body1' sx={{ fontSize: '12px' }}>
            {medication.medication?.name}
          </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default OrderProducts;

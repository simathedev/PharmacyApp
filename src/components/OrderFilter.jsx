import React, { useState } from "react";
import { Box, Typography, FormControl, Select, MenuItem, TextField, Button, Checkbox, FormGroup, FormControlLabel, Slider } from '@mui/material';

const OrderFilter = ({ handleFilter }) => {
  const [deliveryType, setDeliveryType] = useState('all'); // Initialize deliveryType state with 'all'
  const [orderStatus, setOrderStatus] = useState([]);

  const orderStatuses = [{ name:'pending' }, 
                         { name:'order successful' }, 
                         { name:'order cancelled' },
                         { name:'order being prepared' },
                         { name:'ready for collection' },
                         { name:'out for delivery' },
                         { name:'delivered' },
                         { name:'collected' }];

  const handleApplyFilter = () => {
    // Construct the filter object based on the selected options
    const filter = {};
    filter.deliveryType = deliveryType; // Add selected deliveryType to the filter object
    if (orderStatus.length > 0) {
      filter.orderStatuses = orderStatus;
    }
    // Pass the filter object to the parent component
    handleFilter(filter);
  };

  const handleClearFilter = () => {
    // Clear all selected filters
    setDeliveryType('all');
    setOrderStatus([]);
    // Clear all order status checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
    // Pass an empty filter object to remove all filters
    handleFilter({});
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent:'left',textAlign:'left', gap: 2 }}>
      <Typography sx={{fontWeight:'bold'}}  gutterBottom>Delivery Type:</Typography>
      <FormControl>
        <Select
          value={deliveryType}
          onChange={(e) => setDeliveryType(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="delivery">Delivery</MenuItem>
          <MenuItem value="collection">Collection</MenuItem>
        </Select>
      </FormControl>

      <Typography sx={{fontWeight:'bold'}}  gutterBottom>Order Status:</Typography>
      <FormGroup>
        {orderStatuses.map((order) => (
          <FormControlLabel
            key={order.name}
            control={<Checkbox checked={orderStatus.includes(order.name)} onChange={(e) => {
              if (e.target.checked) {
                setOrderStatus([...orderStatus, order.name]);
              } else {
                setOrderStatus(orderStatus.filter((cat) => cat !== order.name));
              }
            }} />}
            label={order.name}
          />
        ))}
      </FormGroup>
    
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={handleApplyFilter}>Apply Filter</Button>
        <Button variant="contained" onClick={handleClearFilter}>Clear Filter</Button>
      </Box>
    </Box>
  );
};

export default OrderFilter;

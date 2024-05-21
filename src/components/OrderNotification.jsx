import React, { useState, useEffect } from 'react';
import { Grid, Card, Box, useMediaQuery, Typography,useTheme, Button } from '@mui/material';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const OrderNotification = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const selectedPharmacy = useSelector((state) => state.auth.pharmacy);

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  let apiUrlSegment=process.env.NODE_ENV === 'production' ?
  `https://pharmacy-app-api.vercel.app`
  :
  `http://localhost:3001`

  const fetchNewOrders = async () => {
    let pharmacyId;
    pharmacyId = selectedPharmacy._id;
    console.log("pharmacy id: ", pharmacyId);
    try {
      const response = await fetch(`${apiUrlSegment}/order/getNewOrders/${pharmacyId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const ordersData = await response.json();
        console.log("orders data:", ordersData);
        const sortedOrders = ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } else {
        console.log('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
   }  finally {
      setLoading(false); // Set loading to false once data fetching is done
    }
  };

  useEffect(() => {
    fetchNewOrders();
  }, [token]);

  const updateOrderStatus = async (id, status) => {
    try {
      const orderStatusResponse = await fetch(`${apiUrlSegment}/order/updateOrder/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ orderStatus: status }),
      });

      const updatedOrder = await orderStatusResponse.json();

      if (updatedOrder) {
        if (status === 'order successful') {
          toast.success('Order Accepted.', { 
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        } else if (status === 'order cancelled') {
          toast.success('Order Cancelled.', { 
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        } else {
          console.log('Updated order response:', updatedOrder);
        }
        fetchNewOrders();
      } else {
        toast.error('Order Accept Request Unsuccessful', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }

  if (loading) {
    return <Typography>Loading...</Typography>; // Display loading indicator while fetching data
  }

  if (orders.length === 0) {
    return <Typography fontStyle='italic'>No orders found.</Typography>; // Display message when no orders are found
  }

  return (
    <Box sx={{ borderRadius: '2%', padding: '2px 4px', width: '100%' }}>
      {/*<Typography>Order Notification</Typography>*/}
      {orders?.slice(0, 2).map((order) => (
        <Card key={order._id} sx={{ backgroundColor:alt, my: 2, px: isNonMobile ? 3 : 5, py: 1, textAlign: 'left' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Link to={`/view/order/${order._id}`} style={{textDecoration:'none'}}>
              <Typography variant='body1' fontWeight='500' color='primary' sx={{ py: 1 }}>Order ID: {order._id}</Typography>
              </Link>
              <Typography variant='body1' sx={{ pb: 0.4 }}>Customer: {order.user?.firstName} {order.user?.lastName}</Typography>
              <Typography variant='body1' sx={{ py: 0.4 }}>Delivery Type: {order.deliveryType}</Typography>
              <Typography variant='body1' sx={{ py: 0.4 }}>Order Status: {order.orderStatus}</Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
              <Button onClick={() => updateOrderStatus(order._id, 'order successful')}>Accept</Button>
              <Button onClick={() => updateOrderStatus(order._id, 'order cancelled')}>Decline</Button>
            </Grid>
          </Grid>
        </Card>
      ))}
      <Link to={`/manage/orders?orderStatus=${encodeURIComponent('pending')}`} style={{ textDecoration: 'none' }}>
        <Button>View More</Button>
      </Link>
    </Box>
  );
};

export default OrderNotification;

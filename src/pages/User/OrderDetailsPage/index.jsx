import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Card, Box,useMediaQuery, Typography, Button, useTheme } from '@mui/material';
import EditButton from "components/buttons/EditButton";
import DeleteButton from "components/buttons/DeleteButton";
import AddButton from "components/buttons/AddButton";
import BackButton from "components/buttons/BackButton";
import OrderProducts from "components/OrderProducts";
import { Link } from 'react-router-dom';
import OrderStatus from "components/widgets/OrderStatus";
import Navbar from "components/navbar";
import { useParams } from "react-router-dom";

const Index = () => {
  const {id}=useParams();
  const token = useSelector((state) => state.auth.token);
  const [order, setOrder] = useState([]);
  const user = useSelector((state) => state.auth.user);
  let userId;

  userId=user._id;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3001/order/getorder/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const ordersData = await response.json();
          console.log("order data in details page:",ordersData);
          setOrder(ordersData);
        } else {
          console.log("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <Box sx={{minHeight:'100vh'}}>

    <Box sx={{textAlign:'center'}}>
    <Box sx={{width:'100%',display:'flex',justifyContent:'left',pl:2}}>
      <Link to={'/user/view/orders'}>
          <BackButton />
        </Link>
      </Box>
      
      <Typography variant='h3'>Order</Typography>
      <Box sx={{display:'flex',flex:'column',width:'100%',alignItems:'center', justifyContent:'center'}}>
      <Card sx={{backgroundColor:alt,borderRadius:6,my:2,px:isNonMobile?6:4,py:6,textAlign:'left',width:isNonMobile?'76%':'90%'}}>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
          <OrderProducts medications={order?.medications} />
            <Typography variant='h5'color='primary' sx={{fontWeight:'bold'}}>Order: {order._id}</Typography>
           {
            order.deliveryType==='collection'?
            (
              <>
              <p>Collection Address: {order.pharmacy.name}</p>
              <p>{order.pharmacy.streetAddress}</p>

              </>
              
            ):
            (
              <p>Delivery Address: {order.userAddress}</p>
            )
           }
           
            <p>Contact Number: {order.userPhoneNumber}</p>
          <p>Delivery Type: {order.deliveryType}</p>
            <Typography variant='body1'>Order Date: {order.createdAt}</Typography>
            <Typography variant='body1'>Status: {order.orderStatus} </Typography>
           
          </Grid>
          <Box sx={{py:2}}>
          <OrderStatus currentStatus={order.orderStatus} deliveryType={order.deliveryType} />
          </Box>
          </Grid>
        </Card>
      </Box>
       
   
    </Box>
    </Box>
  )
}

export default Index;
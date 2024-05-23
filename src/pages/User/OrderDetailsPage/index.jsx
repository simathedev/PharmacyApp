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
import Loading from "components/Loading";

const Index = () => {
  const {id}=useParams();
  const token = useSelector((state) => state.auth.token);
  const [order, setOrder] = useState([]);
  const [isLoading,setIsLoading]=useState(true);
  const user = useSelector((state) => state.auth.user);
  let userId;

  userId=user._id;
  let apiUrlSegment=process.env.NODE_ENV === 'production' ?
  `https://pharmacy-app-api.vercel.app`
  :
  `http://localhost:3001`

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
        const response = await fetch(`${apiUrlSegment}/order/getorder/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          setIsLoading(false);
          const ordersData = await response.json();
          console.log("order data in details page:",ordersData);
          setOrder(ordersData);
        } else {
          setIsLoading(false);
          console.log("Failed to fetch orders");
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token]);

if (isLoading)
{
  return <Loading/>
}

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
      <Card sx={{backgroundColor:alt,borderRadius:6,marginTop:2,marginBottom:6,px:isNonMobile?6:4,py:6,textAlign:'left',width:isNonMobile?'76%':'90%'}}>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Box sx={{pb:2}}>
            <OrderProducts medications={order?.medications} />
            </Box>
          <Typography variant={isNonMobile?'h4':'h5'} fontWeight='bold' color='primary'>
            Order
          </Typography>
            <Typography variant='body1' sx={{ fontSize: isNonMobile?'1.2rem':'0.8rem',mb:2 }}>{order._id}</Typography>
           {
            order.deliveryType==='collection'?
            (
              <>
         <Typography variant={isNonMobile?'h4':'h5'} fontWeight='bold' color='primary'>
              Collection Address
              </Typography>
                <Typography variant='body1' sx={{ fontSize: isNonMobile?'1.2rem':'0.8rem',mb:2 }}>
              {order.pharmacy.name}
              </Typography>
                <Typography variant='body1' sx={{ fontSize: isNonMobile?'1.2rem':'0.8rem',mb:2 }}>
              {order.pharmacy.streetAddress}
              </Typography>
              
              </>
            ):
            (
              <>
              <Typography variant={isNonMobile?'h4':'h5'} fontWeight='bold' color='primary'>Delivery Address</Typography>
              <Typography variant='body1' sx={{ fontSize: isNonMobile?'1.2rem':'0.8rem',mb:2 }}>{order.userAddress}</Typography>
              </>
             
            )
           }
           
           <Typography variant={isNonMobile?'h4':'h5'} fontWeight='bold' color='primary'>Contact Number</Typography>
             <Typography variant='body1' sx={{ fontSize: isNonMobile?'1.2rem':'0.8rem',mb:2 }}>{order.userPhoneNumber}</Typography>
           <Typography variant={isNonMobile?'h4':'h5'} fontWeight='bold' color='primary'>Delivery Type </Typography>
             <Typography variant='body1' sx={{ fontSize: isNonMobile?'1.2rem':'0.8rem',mb:2 }}>{order.deliveryType}</Typography>
           <Typography variant={isNonMobile?'h4':'h5'} fontWeight='bold' color='primary'> Order Date </Typography>
              <Typography variant='body1' sx={{ fontSize: isNonMobile?'1.2rem':'0.8rem',mb:2 }}>{order.createdAt}</Typography>
            <Typography variant={isNonMobile?'h4':'h5'} fontWeight='bold' color='primary'> Status </Typography>
              <Typography variant='body1' sx={{ fontSize: isNonMobile?'1.2rem':'0.8rem',mb:2 }}>{order.orderStatus} </Typography>
           
          </Grid>
          <Box sx={{py:2,border:'1px sl'}}>
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
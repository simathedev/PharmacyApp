import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Card, Box,useMediaQuery, Typography, Button, useTheme, CircularProgress} from '@mui/material';
import EditButton from "components/buttons/EditButton";
import DeleteButton from "components/buttons/DeleteButton";
import AddButton from "components/buttons/AddButton";
import BackButton from "components/buttons/BackButton";
import OrderProducts from "components/OrderProducts";
import { Link } from 'react-router-dom';
import OrderStatus from "components/widgets/OrderStatus";
import Navbar from "components/navbar";
import ViewButton from "components/buttons/ViewButton";
import FilterOption from "components/widgets/FilterOption";

const Index = () => {
  const token = useSelector((state) => state.auth.token);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  let userId;
  userId=user._id;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLargeScreen= useMediaQuery("(min-width:900px)");
  const isMediumScreen = useMediaQuery("(min-width:500px) and (max-width:800px)");
 


  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/order/getUserOrders/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const ordersData = await response.json();
          console.log("orders data:",ordersData);
          setOrders(ordersData);
        } else {
          console.log("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      finally {
        setLoading(false); // Set loading to false when data fetching is completed
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <Box sx={{minHeight:'100vh'}}>
 {loading?(
 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
 <CircularProgress />
 <Typography variant='h4' color='primary' sx={{px:2}}>Loading...</Typography>
</Box>
    ):(
    <Box sx={{textAlign:'center'}}>
    <Box sx={{width:'100%',display:'flex',justifyContent:'left',pl:2}}>
      <Link to={'/User'}>
          <BackButton />
        </Link>
      </Box>
       
      <Typography variant='h3'>Order </Typography>
      {orders.length === 0 && (
          <Typography variant="h4">No Order found...</Typography>
        )}
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Box sx={{width:isLargeScreen?'70%':isMediumScreen?'80%':'90%'}}>
      {orders?.map((orders) => (
        <Card key={orders._id} sx={{my:2,px:4,py:6,textAlign:'left'}}>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{display:'flex',flexDirection:'column',justifyContent:'space-between',pb:1}}>
          <Typography variant={isNonMobile?'h5':'h6'} width='40%' color='primary' sx={{fontWeight:'bold'}}>Order ID: {orders._id}</Typography>
            <Box sx={{display:'flex',textAlign:'left',width:'40%',flexDirection:'column'}}>
            <Typography variant='body1' sx={{fontWeight:'bold'}}>{orders.createdAt}</Typography> 
            </Box>
          </Box>
          <Typography variant='body1'>{orders.orderStatus} </Typography>
          <OrderProducts medications={orders.medications} />
          </Grid>
       
          <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:isNonMobile?'center':'left',justifyContent:isNonMobile?'center':'left',gap:2}}>
          <Link to={`/user/view/order/${orders._id}`}>
         <ViewButton/>
         </Link>
          </Grid>
          </Grid>
        </Card>
      ))}
      </Box>
   
        </Box>
     
     

      {/*<OrderStatus/>*/}
    </Box>
    )}
    </Box>
  )
}

export default Index
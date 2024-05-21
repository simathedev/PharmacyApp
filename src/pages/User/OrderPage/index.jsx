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
import Loading from "components/Loading";
import NoDataFound from "components/widgets/NoDataFound";


const Index = () => {
  const token = useSelector((state) => state.auth.token);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  let userId;
  userId=user?._id;

  let apiUrlSegment=process.env.NODE_ENV === 'production' ?
    `https://pharmacy-app-api.vercel.app`
    :
    `http://localhost:3001`

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLargeScreen= useMediaQuery("(min-width:900px)");
  const isMediumScreen = useMediaQuery("(min-width:500px) and (max-width:800px)");
 
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;


  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrlSegment}/order/getUserOrders/${userId}`, {
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
        setIsLoading(false); // Set isLoading to false when data fetching is completed
      }
    };

    fetchOrders();
  }, [token]);

  if(isLoading){
    return <Loading/>
  }

  return (
    <Box sx={{minHeight:'100vh'}}>

{/*<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
 <CircularProgress />
 <Typography variant='h4' color='primary' sx={{px:2}}>Loading...</Typography>
</Box>*/}
    <Box sx={{textAlign:'center'}}>
    <Box sx={{width:'100%',display:'flex',justifyContent:'left',pl:2}}>
      <Link to={'/User'}>
          <BackButton />
        </Link>
      </Box>
       

      <Typography variant='h3'>Your Orders</Typography>
      {orders.length === 0 && (
        <Box sx={{minHeight:'60vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
           {/*<Typography variant="h4">No Order found...</Typography>*/}
           <NoDataFound name='Orders' icon='BiPackage'/>
        </Box>
       
        )}
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Box sx={{width:isLargeScreen?'70%':isMediumScreen?'80%':'90%'}}>
      {orders?.map((orders) => (
        <Card key={orders?._id} sx={{backgroundColor:alt,my:2,px:4,py:6,textAlign:'left'}}>
           <Link to={`/user/view/order/${orders?._id}`} style={{textDecoration:'none'}}>
          <Box sx={{width:'100%',display:'flex',alignItems:'left',flexDirection:!isNonMobile&&'column',backgroundColor:primaryLight, borderRadius:2, p:isNonMobile?'1.6rem 1rem':'1rem 0rem',my:1, justifyContent:isNonMobile?'space-between':'center',pb:1}}>
          <Typography variant={isNonMobile?'h5':'h6'}  color='primary' sx={{fontWeight:'bold'}}>Order: ORD{orders?._id}</Typography>
            <Box sx={{display:'flex',textAlign:'left',flexDirection:'column',pr:'2rem'}}>
            <Typography variant='body1' sx={{fontWeight:'bold', color:primary}}>{orders?.createdAt}</Typography> 
            </Box>
          </Box>
          </Link>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
          

          <Typography variant='body1'>{orders?.orderStatus} </Typography>
         <Box sx={{width:isNonMobile?'60%':'90%'}}>
         <OrderProducts medications={orders?.medications} />
         </Box>
          </Grid>
       
         {/* <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:isNonMobile?'center':'left',justifyContent:isNonMobile?'center':'left',gap:2}}>
          <Link to={`/user/view/order/${orders._id}`}>
         <ViewButton/>
         </Link>
      </Grid>*/}
          </Grid>
        </Card>
      ))}
      </Box>
   
        </Box>
     
     

      {/*<OrderStatus/>*/}
    </Box>
   
    </Box>
  )
}

export default Index
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, CircularProgress,useTheme, useMediaQuery, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { AiOutlineCheckCircle } from 'react-icons/ai'; // Import check circle icon
import { MdLocalShipping, MdStore } from 'react-icons/md'; // Import shipping and store icons
import { LuPackageCheck } from "react-icons/lu";
import { FcPaid } from "react-icons/fc";
import BackButton from "components/buttons/BackButton";
import Navbar from "components/navbar";
import Loading from "components/Loading";

const Index = () => {
  const token = useSelector((state) => state.auth.token);
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const orderID = localStorage.getItem('newOrderId');

  let apiUrlSegment=process.env.NODE_ENV === 'production' ?
    `https://pharmacy-app-api.vercel.app`
    :
    `http://localhost:3001`

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const primaryDark = theme.palette.primary.dark;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

const isNonMobile = useMediaQuery("(min-width:600px)");
const isLargeScreen= useMediaQuery("(min-width:900px)");
const isMediumScreen = useMediaQuery("(min-width:500px) and (max-width:800px)");
   

 useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrlSegment}/order/getorder/${orderID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const ordersData = await response.json();
          setOrder(ordersData);
        } else {
          console.log("Failed to fetch order");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchOrders();
  }, [orderID, token]);
if(loading){
return <Loading/>
}
  return (
    <Box sx={{ minHeight: '100vh' }}>
        <Box sx={{ textAlign: 'center', padding: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'left', paddingLeft: '20px' }}>
            <Link to={'/User'} style={{textDecoration:'none'}}>
              <BackButton />
            </Link>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>             
          <Typography variant={isNonMobile?'h2':'h4'} sx={{  marginBottom: '10px',fontWeight: 'bold', paddingTop: '20px', paddingBottom: '10px', color: primary }}>Order Successfully Created!</Typography>

            <Box sx={{ width: isNonMobile?'70%':'85%', marginBottom: '20px' }}>
              {/*<Typography variant='h3' sx={{ fontWeight: 'bold', paddingTop: '20px', paddingBottom: '10px', color: 'primary.main' }}>Order Successfully Created!</Typography>*/}
              <Typography variant={isNonMobile?'h5':'h6'} sx={{ paddingBottom: '12px',color:primaryDark, fontStyle:'italic' }}>ORD{orderID}</Typography>
              <Box sx={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                <Typography variant= {isNonMobile?'h5':'body1'} sx={{ paddingBottom: '10px', textAlign: 'center' }}>
                {/*<LuPackageCheck />*/}
                  <FcPaid style={{ fontSize:isNonMobile?'40px':'36px', color: primary, marginTop:'2px', marginBottom: '10px' }} /><br />
                  Thank you for placing your order with us. Your order is currently in <span style={{ fontWeight: 'bold', color: primary }}>{order?.orderStatus}</span>. We have noted that you have opted for
                  <span style={{ fontWeight: 'bold', color: primary }}> {order?.deliveryType}</span> for this order.
                  The items will be sourced from <span style={{ fontWeight: 'bold', color: primary }}> {order.pharmacy?.name}</span>.
                  <br/><br/>We will keep you updated on the progress of your order. If you have any questions or need further assistance,
                  please feel free to reach out to our customer support team. 
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
    </Box>
  );
};

export default Index;

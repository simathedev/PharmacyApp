import React, { useEffect, useState } from "react";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { Grid, Card, Box, useMediaQuery, Typography,  Button, Badge, IconButton,useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import OrderNotification from "components/OrderNotification";
import MedicationNotification from "components/MedicationNotification";
import ScriptNotification from "components/ScriptNotification";

const DashboardNotifications = () => {
  const role = useSelector((state) => state.auth.role);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLargeScreen = useMediaQuery("(min-width:900px)");
  const isMediumScreen = useMediaQuery("(min-width:600px) and (max-width:800px)");
  const [showOrderNotifications, setShowOrderNotifications] = useState(false);
  const [showMedicationNotifications, setShowMedicationNotifications] = useState(false);
  const [showScriptNotifications, setShowScriptNotifications] = useState(false);
  const [showScriptPin, setShowScriptPin] = useState(false);
  const [showMedicationPin, setShowMedicationPin] = useState(false);
  const [showOrderPin, setShowOrderPin] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const selectedPharmacy = useSelector((state) => state.auth.pharmacy);

  let apiUrlSegment=process.env.NODE_ENV === 'production' ?
  `https://pharmacy-app-api.vercel.app`
  :
  `http://localhost:3001`

  const handleViewMedicationNotifications = () => {
    setShowMedicationNotifications(true);
    setShowOrderNotifications(false);
    setShowScriptNotifications(false);
   // setShowMedicationNotifications(!showMedicationNotifications);
  };

  const handleViewOrderNotifications = () => {
    setShowOrderNotifications(true);
    setShowMedicationNotifications(false);
    setShowScriptNotifications(false);
    //setShowOrderNotifications(!showOrderNotifications);
  };

  const handleViewScriptNotifications = () => {
    setShowScriptNotifications(true);
    setShowMedicationNotifications(false);
    setShowOrderNotifications(false);
    //setShowScriptNotifications(!showScriptNotifications);
  };

  const handleMedicationNotificationsChange = (hasNotifications) => {
    setShowMedicationPin(hasNotifications);
    console.log("has notification in Medication function: ",hasNotifications)
  };
  
  const handleOrderNotificationsChange = (hasNotifications) => {
    setShowOrderPin(hasNotifications);
    console.log("has notification in Order function: ",hasNotifications)

  };
  
  const handleScriptNotificationsChange = (hasNotifications) => {
    setShowScriptPin(hasNotifications);
    console.log("has notification in Script function: ",hasNotifications)
  };

  const fetchOrderNotifications = async () => {
    let pharmacyId;
    pharmacyId = selectedPharmacy._id;
    let hasNotificationPin;
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
        if(ordersData.length>0)
          {
            hasNotificationPin=true;

          }
          else
          {
            hasNotificationPin=false;

          }
          setShowOrderPin(hasNotificationPin);
      } else {
        hasNotificationPin=false;
        setShowOrderPin(hasNotificationPin);
        console.log('Failed to fetch orders');
      }
    } 
    catch (error) 
    {
      hasNotificationPin=false;
      setShowOrderPin(hasNotificationPin);
      console.error('Error fetching orders:', error);
   }  
   finally 
   {
      setLoading(false); // Set loading to false once data fetching is done
    }
  };

  const fetchMedicationNotifications = async () => {
    let pharmacyId;
    pharmacyId = selectedPharmacy._id;
    console.log("pharmacy id: ",pharmacyId);
    let hasNotificationPin;
    let apiUrlSegment=process.env.NODE_ENV === 'production' ?
    `https://pharmacy-app-api.vercel.app`
    :
    `http://localhost:3001`

      try {

        const response = await fetch(`${apiUrlSegment}/medication/getFinishedMedications/${pharmacyId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const medicationData = await response.json();
          if(medicationData.length>0)
            {
              hasNotificationPin=true;
            }
            else
            {
              hasNotificationPin=false;
            }
            setShowMedicationPin(hasNotificationPin);
        } else {

          hasNotificationPin=false;
          setShowMedicationPin(hasNotificationPin);
          console.log('Failed to fetch medication');
        }
      } catch (error) {
        hasNotificationPin(false);
        setShowMedicationPin(hasNotificationPin);
        console.error('Error fetching medication:', error);
      }
  };

  const fetchScriptNotifications = async () => {
    let pharmacyId;
    pharmacyId = selectedPharmacy._id;
    let hasNotificationPin;
    console.log("pharmacy id: ", pharmacyId);
    try {
      const response = await fetch(`${apiUrlSegment}/prescription/getNewPrescriptions/${pharmacyId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const scriptsData = await response.json();
        console.log("scripts data:", scriptsData)
        if(scriptsData.length>0)
          {
            hasNotificationPin=true;

          }
          else{
            hasNotificationPin=false; 
          }
          setShowScriptPin(hasNotificationPin);
      } else {
        hasNotificationPin=false;
        setShowScriptPin(hasNotificationPin);
        console.log('Failed to fetch scripts');
      }
    } catch (error) {
      hasNotificationPin=false;
      setShowScriptPin(hasNotificationPin);
      console.error('Error fetching scripts:', error);
    }
    finally {
      setLoading(false); // Set loading to false once data fetching is done
    }
  };

 useEffect(() => {
  fetchOrderNotifications();
  fetchMedicationNotifications();
  fetchScriptNotifications();
 }, [showOrderNotifications,showMedicationNotifications,showScriptNotifications]);

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  return (
    <WidgetWrapper
      display="flex"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      width={isNonMobile ? "65%" : "78%"}
      zIndex="9"
      marginBottom={isLargeScreen ? "1rem" : isMediumScreen ? "2rem" : "2rem"}
    >
      <Box gap={2} justifyContent="center" alignItems="center" sx={{ width: isNonMobile ? "80%" : "100%" }}>
        <Typography variant={isNonMobile?"h3":"h4"} sx={{ my: 1 }}>
          Dashboard Notifications
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Button onClick={handleViewMedicationNotifications} sx={{ gridColumn: "span 4" }}>
            <Badge color="error" variant="dot" invisible={!showMedicationPin}>
            <NotificationsNoneOutlinedIcon />
          </Badge>
    
         
            {showMedicationNotifications ? "Hide Medication Notifications" : "View Medication Notifications"}
          </Button>

          <Button onClick={handleViewOrderNotifications} sx={{ gridColumn: "span 4" }}> 
<Badge color="error" variant="dot" invisible={!showOrderPin}>
<NotificationsNoneOutlinedIcon />
</Badge>
          
            {showOrderNotifications ? "Hide Order Notifications" : "View Order Notifications"}
          </Button>

          <Button onClick={handleViewScriptNotifications} sx={{ gridColumn: "span 4" }}>
     
            <Badge color="error" variant="dot" invisible={!showScriptPin}>
          <NotificationsNoneOutlinedIcon />
        </Badge>
        
          
            {showScriptNotifications ? "Hide Script Notifications" : "View Script Notifications"}
          </Button>
        </Box>
        <Box sx={{ width: "100%", fontSize: !!isNonMobile && "8px" }}>
          {role === "pharmacist" && (
            <>
              {showOrderNotifications && <OrderNotification hasNotifications={handleOrderNotificationsChange} />}
              {showMedicationNotifications && <MedicationNotification hasNotifications={handleMedicationNotificationsChange}/>}
              {showScriptNotifications && <ScriptNotification hasNotifications={handleScriptNotificationsChange} />}
            </>
          )}
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default DashboardNotifications;

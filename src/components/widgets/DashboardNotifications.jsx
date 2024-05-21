import React, { useEffect, useState } from "react";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Card, Box, useMediaQuery, Typography, Button,useTheme } from "@mui/material";
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

  const handleViewMedicationNotifications = () => {
    setShowMedicationNotifications(true);
    setShowOrderNotifications(false);
    setShowScriptNotifications(false);
  };

  const handleViewOrderNotifications = () => {
    setShowOrderNotifications(true);
    setShowMedicationNotifications(false);
    setShowScriptNotifications(false);
  };

  const handleViewScriptNotifications = () => {
    setShowScriptNotifications(true);
    setShowMedicationNotifications(false);
    setShowOrderNotifications(false);
  };

  useEffect(() => {}, []);

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
            {showMedicationNotifications ? "Hide Medication Notifications" : "View Medication Notifications"}
          </Button>

          <Button onClick={handleViewOrderNotifications} sx={{ gridColumn: "span 4" }}>
            {showOrderNotifications ? "Hide Order Notifications" : "View Order Notifications"}
          </Button>

          <Button onClick={handleViewScriptNotifications} sx={{ gridColumn: "span 4" }}>
            {showScriptNotifications ? "Hide Script Notifications" : "View Script Notifications"}
          </Button>
        </Box>
        <Box sx={{ width: "100%", fontSize: !!isNonMobile && "8px" }}>
          {role === "pharmacist" && (
            <>
              {showOrderNotifications && <OrderNotification />}
              {showMedicationNotifications && <MedicationNotification />}
              {showScriptNotifications && <ScriptNotification />}
            </>
          )}
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default DashboardNotifications;

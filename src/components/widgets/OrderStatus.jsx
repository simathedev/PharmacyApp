import React from "react";
import { Box, Typography, useTheme, Card, useMediaQuery } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const OrderStatus = ({ currentStatus, deliveryType }) => {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    const primary=theme.palette.primary.main;

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLargeScreen= useMediaQuery("(min-width:900px)");
  const isMediumScreen = useMediaQuery("(min-width:500px) and (max-width:800px)");
     
  const getStatusColor = (text) => {
    return currentStatus && currentStatus.toLowerCase() === text.toLowerCase()
      ? alt
      : dark;
  };

  return (
    <Card
      sx={{
        display: "flex",
        padding: 1,
        flexWrap: "wrap", // Allow items to wrap onto the next line
        width:'100%',
        border:'1px solid white',
        borderRadius:6,
        backgroundColor:primary,
      }}
    >
      {[
        { id: 1, text: "Pending" },
        { id: 2, text: currentStatus === "order cancelled" ? "Order Cancelled" : "Order Successful" },
        { id: 3, text: "Order Being Prepared" },
        { id: 4, text: deliveryType === "collection" ? "Ready for Collection" : "Out for Delivery" },
        { id: 5, text: deliveryType === "collection" ? "Collected" : "Delivered" },
      ].map((item, index) => (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign:"center",
            margin:isNonMobile?1:0.4,
            width:isNonMobile?'4.9rem':'2.9rem',
            textAlign: "center",
          }}
        >
          <CheckCircle
            sx={{
              color: getStatusColor(item.text),
              fontSize: isNonMobile?32:20,
              marginBottom: 2,
            }}
          />
          <Typography
            variant={isNonMobile?"subtitle2":"subtitle3"}
            sx={{
              fontWeight: currentStatus === item.text ? "bold" : "normal",
              color: getStatusColor(item.text),
              fontSize:!isNonMobile&&'0.5rem',
              width:'0.7rem',
            }}
          >
            {item.text}
          </Typography>
        </Box>
      ))}
    </Card>
  );
};

export default OrderStatus;

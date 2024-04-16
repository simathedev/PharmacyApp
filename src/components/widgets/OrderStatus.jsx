import { useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const OrderStatus = ({ currentStatus, deliveryType }) => {
  useEffect(() => {}, []);

  const theme = useTheme();

  const getStatusColor = (text) => {
    return currentStatus && currentStatus.toLowerCase() === text.toLowerCase()
      ? theme.palette.primary.main
      : "inherit";
  };

  const getTypographyStyle = (text) => {
    return currentStatus && currentStatus.toLowerCase() === text.toLowerCase()
      ? { fontWeight: "bold", fontSize: 12,color:theme.palette.primary.main } // Apply distinct styling when currentStatus matches the text
      : { fontSize: 12 };
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      {[{ id: 1, text: "Pending" },{ id: 2, text: currentStatus==="order cancelled"?"Order Cancelled":"Order Successful" },{ id: 3, text: "Order Being Prepared" },{ id: 4, text: deliveryType === "collection" ? "Ready for Collection" : "Out for Delivery" },{ id: 5, text: deliveryType === "collection" ? "Collected" : "Delivered" }].map((item, index, array) => (
        <Box key={item.id} sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", marginLeft: index === 0 ? 0 : 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <CheckCircle
              sx={{
                color: getStatusColor(item.text), // Change color of the icon as needed
                fontSize: 36,
                marginBottom: 1,
              }}
            />
            <Typography variant="subtitle1" sx={{ ...getTypographyStyle(item.text), maxWidth: 100, textAlign: "center" }}>
              {item.text}
            </Typography>
          </Box>
          {index !== array.length - 1 && (
            <Box sx={{ position: "absolute", top: "50%", left: "calc(50% + 28px)", transform: "translateY(-50%)" }}>
              <svg height="20" width="20">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
                    markerWidth="6" markerHeight="6"
                    orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={getStatusColor(array[index + 1].text)} />
                  </marker>
                </defs>
                <line x1="0" y1="10" x2="20" y2="10" style={{ stroke: getStatusColor(array[index + 1].text), strokeWidth: 2, markerEnd: "url(#arrow)" }} />
              </svg>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default OrderStatus;

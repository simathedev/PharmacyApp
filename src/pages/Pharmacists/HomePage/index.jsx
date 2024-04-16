import React, {useEffect} from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link } from 'react-router-dom';
import { CgPill } from "react-icons/cg";
import { MdLocalPharmacy } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { BiPackage } from "react-icons/bi";
import { FaNotesMedical } from "react-icons/fa";
import { useSelector } from "react-redux";
import Navbar from 'components/navbar';
import DashboardNotifications from 'components/widgets/DashboardNotifications';
import NotPermitted from 'components/NotPermitted';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Index = () => {
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();
  const {palette}=useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLargeScreen= useMediaQuery("(min-width:900px)");
  const isMediumScreen = useMediaQuery("(min-width:600px) and (max-width:800px)");
  console.log("role: ",role);

  
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;


  useEffect(() => {
    const isPermitted = role === 'pharmacist';
    if (!isPermitted) {
      navigate('/');
      toast.error('Access Denied. Pharmacist Only.', { 
        // Position of the notification
        autoClose: 5000, // Duration before the notification automatically closes (in milliseconds)
        hideProgressBar: true, // Whether to hide the progress bar
        closeOnClick: true, // Whether clicking the notification closes it
        pauseOnHover: true, // Whether hovering over the notification pauses the autoClose timer
        draggable: true, // Whether the notification can be dragged
        progress: undefined, // Custom progress bar (can be a React element)
        // Other options for customizing the notification
      });
    }
  }, [role, navigate]);

  return (
    <Box sx={{minHeight:'100vh'}}>
{role==='pharmacist'?(
<>
<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
    <Typography variant="h2" color={palette.primary.main} fontWeight="500" textAlign="center" mb={4} mt={10} >
      Welcome, {user.firstName} 
      </Typography>
      <DashboardNotifications/>
     
  <Grid container spacing={isLargeScreen?4:isMediumScreen?2:1} direction="row" justifyContent="center" alignItems="center">
    <Grid item xs={9} sm={4} sx={{  my: isLargeScreen?4:0 }}>
      <Link to={'/manage/medications'} style={{ textDecoration: 'none' }}>
      <Card sx={{ 
        backgroundColor:alt,
         "&:hover": { backgroundColor: palette.primary.main,color:palette.background.alt },
        width: "100%", height: "100px", mb:2, display:'flex', flexDirection:'column', alignItems: 'center',justifyContent:'center', textAlign:'center',borderRadius:'10px'}}>
          <CgPill/>
        <Typography>Manage Medication</Typography>
      </Card>
      </Link>
      <Link to={'/manage/users'} style={{ textDecoration: 'none' }}>
      <Card sx={{ 
         backgroundColor:alt,
                 "&:hover": { backgroundColor: palette.primary.main,color:palette.background.alt },
        width: "100%", height: "100px", mb:2, display:'flex', flexDirection:'column', alignItems: 'center',justifyContent:'center', textAlign:'center',borderRadius:'10px'}}>
        <FaUser/>
       <Typography>Manage Users</Typography> 
      </Card>
      </Link>
    </Grid>

    <Grid item xs={9} sm={4} sx={{ my: isLargeScreen?4:0 }}>
      <Link to={'/manage/orders'} style={{ textDecoration: 'none' }}>
      <Card sx={{ 
         backgroundColor:alt,
                 "&:hover": { backgroundColor: palette.primary.main,color:palette.background.alt },
        width: "100%", height: "100px", mb:2, display:'flex', flexDirection:'column', alignItems: 'center',justifyContent:'center', textAlign:'center',borderRadius:'10px'}}>
        <BiPackage/>
        <Typography>Manage Orders</Typography>
      </Card>
      </Link>
      <Link to={'/manage/prescriptions'} style={{ textDecoration: 'none' }}>
      <Card sx={{ 
         backgroundColor:alt,
                 "&:hover": { backgroundColor: palette.primary.main,color:palette.background.alt },
        width: "100%", height: "100px", mb:2, display:'flex', flexDirection:'column', alignItems: 'center',justifyContent:'center', textAlign:'center',borderRadius:'10px'}}>
      <FaNotesMedical/>
       <Typography>Manage Scripts</Typography>
      </Card>
      </Link>
    </Grid>
  </Grid>
  </Box>
</>
):(
  <Box sx={{justifyContent:'center',alignItems:'center',textAlign:'center'}}>
    <NotPermitted/>
  </Box>
)}
   
  </Box>
  )
}

export default Index

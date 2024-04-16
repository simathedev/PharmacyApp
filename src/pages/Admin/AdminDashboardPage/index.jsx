import React, {useEffect} from 'react';
import { CgPill } from "react-icons/cg";
import { MdLocalPharmacy } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUser , FaNotesMedical} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { BiPackage } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { Grid, Card, Box,useMediaQuery, Typography, Button, useTheme } from '@mui/material';
import Navbar from 'components/navbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminPharmacy from '../../../components/AdminPharmacy';


const Index = () => {
  const user = useSelector((state) => state.auth.user);
  const role=useSelector((state)=>state.auth.role);
  const navigate = useNavigate();
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;
  const {palette}=useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
 console.log("user admin:",user)
 console.log("role admin:",role)

 useEffect(() => {
  const isPermitted = role === 'admin';
  if (!isPermitted) {
    navigate('/');
    toast.error('Access Denied. Admin Only.', { 
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
    <>
        
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
     //minHeight="70vh" // Ensure full viewport height
    >

      <Box width={isSmallScreen ? '70%' : '60%'} display="flex" flexDirection="column">
        <Typography variant="h2" color={palette.primary.main} fontWeight="500" textAlign="center" mb={4} mt={10}>
          Welcome, Admin
        </Typography>
       
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {[
            { icon: <FaUser />, text: 'View Users', link: '/manage/users' },
            { icon: <MdLocalPharmacy />, text: 'View Pharmacies', link: '/admin/pharmacies' },
            { icon: <FaUserDoctor />, text: 'View Pharmacists', link: '/admin/pharmacists' },
            { icon: <CgPill />, text: 'View Medication', link: '/manage/medications' },
            { icon: <BiPackage />, text: 'View Orders', link: '/manage/orders' },
            {icon:<FaNotesMedical />,text:'View Prescriptions', link:'/manage/prescriptions'}
          ].map((item, index) => (
            <Grid item key={index} xs={12} sm={6}>
              <Link to={item.link} style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    backgroundColor:alt,
                    width: "100%", borderRadius:'10px',height: "100px", mb:2, display:'flex', flexDirection:'column', alignItems: 'center',justifyContent:'center', textAlign:'center',
                    "&:hover": { backgroundColor: primary,color:alt },
                  }}
                >
                  {item.icon}
                  <Typography variant="subtitle1" mt={1}>
                    {item.text}
                  </Typography>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
    </>
  );
};

export default Index;


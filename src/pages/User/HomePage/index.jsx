import React from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link } from 'react-router-dom';
//import {Person,Medication,Description,Inventory} from '@mui/icons-material';
import { CgPill } from "react-icons/cg";
import { MdLocalPharmacy } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { BiPackage } from "react-icons/bi";
import { FaNotesMedical } from "react-icons/fa";
import NearbyPharmacy from 'components/NearbyPharmacy';
import MobileShortcuts from '../../../components/widgets/Shortcuts';
import { useDispatch, useSelector } from "react-redux";
import Navbar from 'components/navbar';
import Categories from 'components/buttons/Categories';
import Advertisement from 'components/widgets/Advertisment';
import CartNavbar from 'components/cartnavbar';

const Index = () => {
  const { palette } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const items=useSelector((state)=>state.cart.items);
  const role=useSelector((state)=>state.auth.role);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  console.log("items from state: ",items);
  console.log("user from state:",user)
  const pharmacy=useSelector((state)=>state.auth.pharmacy);
console.log("pharmacy from redux:",pharmacy);
  console.log("role: ",role)
  const fullName = `${user?.firstName} ${user?.lastName}`;
  return (
    <Box sx={{minHeight:'100vh' }}>
      <CartNavbar/>
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
    
      <Typography
      variant={isNonMobile?"h2":"h3"} fontWeight="500" 
      textAlign="center" mb={4} mt={isNonMobile?10:8}
      color={palette.primary.main}
      >Welcome, {!user?'User':user?.firstName}</Typography>
      <NearbyPharmacy/>
      <Categories/>
      
    </Box>
    </Box>
  );
}

export default Index;

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
import { BiSolidAmbulance } from "react-icons/bi";

const Index = () => {
const theme=useTheme();
const {palette}=useTheme();
const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;
const role=useSelector((state)=>state.auth.role);

const isNonMobile = useMediaQuery("(min-width:600px)");
const isLargeScreen= useMediaQuery("(min-width:900px)");
const isMediumScreen = useMediaQuery("(min-width:500px) and (max-width:800px)");
   

  return (
   <Box sx={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',mt:25,gap:1}}>
<BiSolidAmbulance fontSize={isNonMobile?'3rem':'2rem'} style={{ color: theme.palette.primary.main }} />
<Typography variant='h1'fontSize={isNonMobile?'5rem':'2rem'} color='primary' fontWeight='bold'>
    Error 404
</Typography>
<Typography variant='h4' fontSize={isNonMobile?'2rem':'1rem'} color='primary'>
  Page Not Found.
</Typography>
{role==='admin'?(
<>
<Link to='admin' style={{textDecoration:'none'}}>
<Button sx={{fontSize:!isNonMobile&&'0.6rem'}} >Return To Homepage</Button>
</Link>
</>
):role==='pharmacist'?(
<>
<Link to='/pharmacist' style={{textDecoration:'none'}}>
<Button>Return To Homepage</Button>
</Link>
</>
):(
<>
<Link to='/user' style={{textDecoration:'none'}}>
<Button>Return To Homepage</Button>
</Link>
</>
)}



   </Box>
  );
};

export default Index;


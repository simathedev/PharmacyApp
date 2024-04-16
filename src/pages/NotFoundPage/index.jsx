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
const role=useSelector((state)=>state.auth.role);
  return (
   <Box sx={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:1}}>
<BiSolidAmbulance fontSize='3rem' style={{ color: theme.palette.primary.main }} />
<Typography variant='h1'fontSize='5rem' color='primary' fontWeight='bold'>
    Error 404
</Typography>
<Typography variant='h4' fontSize='2rem' color='primary'>
  Page Not Found.
</Typography>
{role==='admin'?(
<>
<Link to='admin'>
<Button>Return To Homepage</Button>
</Link>
</>
):role==='pharmacist'?(
<>
<Link to='/pharmacist'>
<Button>Return To Homepage</Button>
</Link>
</>
):(
<>
<Link to='/user'>
<Button>Return To Homepage</Button>
</Link>
</>
)}



   </Box>
  );
};

export default Index;


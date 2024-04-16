import React, {useState,useEffect} from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { Grid, Card, Box,useMediaQuery,Typography, Button, useTheme } from '@mui/material';
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaPills } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotPermitted = () => {
    const {palette}=useTheme();
  return (
<Box sx={{borderRadius:'2%',padding:'2px 4px',
display:'flex', flexDirection:'column', textAlign:'center', alignItems:'center',justifyContent:'center'}}>
   {/* <FaPills fontSize='2rem' color={palette.primary.main}/>*/} 
 <Typography variant='h2' color='primary' fontWeight='bold' my='1rem'>Access Denied</Typography>
 <Typography variant='h4'>You are not permitted to view this page</Typography>
 <Link to='/'>
 <Button color='primary'>Sign In</Button>
 </Link>
    </Box>
  );
};

export default NotPermitted;
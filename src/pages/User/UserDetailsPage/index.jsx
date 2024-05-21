import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Card, Box,useMediaQuery, Typography, Button, useTheme } from '@mui/material';
import EditButton from "components/buttons/EditButton";
import DeleteButton from "components/buttons/DeleteButton";
import AddButton from "components/buttons/AddButton";
import BackButton from "components/buttons/BackButton";
import { Link } from 'react-router-dom';
import { FaCreditCard, FaHome, FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import Navbar from "components/navbar";
import LoadingComponent from "components/LoadingComponent";
import Loading from "components/Loading";

const Index = () => {
  const { palette } = useTheme();
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  console.log('user in profile data:',user)
  const [profilePicture,setProfilePicture]=useState('')
  const [responseData,setResponseData]=useState([]);
  const [isLoading,setIsLoading]=useState(true);
  console.log("is loading:",isLoading);
  const role= useSelector((state) => state.auth.role);
  const id=useSelector((state)=>state.auth.user?._id)
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const getUserDetails=async(id)=>{
    try{
      setIsLoading(true);
      console.log("id:",id)
      let fetchStatement;
      if(role==='admin')
      {
       fetchStatement= `http://localhost:3001/admin/${id}`
                 }
      else if(role==='pharmacist')
      {
        fetchStatement=`http://localhost:3001/pharmacist/getPharmacist/${id}`
                  }
      else
      {
        fetchStatement=`http://localhost:3001/user/getUser/${id}`
  
      }
      const apiUrl=fetchStatement;
              const response = await fetch(
                apiUrl, {
                  method: "GET",
                  headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                  },
              });
              const data = await response.json();
  
                if(response.ok)
                {
                  setIsLoading(false)
                  setResponseData(data);
                  console.log("response data from update user page: ",data);
               
                }

    }
    catch(error)
    {
      setIsLoading(false);
      console.error("Error fetching user details:", error);

    }
          
        }
    
       useEffect(()=>{
        getUserDetails(id);
    
                },[id]);

                if(isLoading)
                {
                  return <Loading/>
                }

  return (
    <>
    
    <Box sx={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center'}}>
     <Box sx={{width:'80%',display:'flex',justifyContent:'left',pl:2}}>
    
    {role==="user" && (
      <Link to={'/User'}>
        <BackButton />
      </Link>
    )}
  
    {role==="pharmacist" && (
      <Link to={'/pharmacist'}>
        <BackButton />
      </Link>
    )}

    {role==="admin" && (
      <Link to={'/admin'}>
        <BackButton />
      </Link>
    )}
  </Box>

  <Box sx={{ my: 2, mx: 2, px: 2, py: 3, textAlign: 'center' }} key={responseData?.id}>
  {/* Display medication details */} 
  {responseData.picture ?
    <img
      width={isNonMobile ? "140px" : "100px"}
      height={isNonMobile ? "140px" : "100px"}
      alt="medication"
      style={{ marginTop: "0.75rem", borderRadius: '50%', objectFit: 'cover' }} // Apply objectFit here
      src={`http://localhost:3001/assets/${responseData?.picture}`}
    />
    :
    <FaUserCircle fontSize='6rem' />
  }
  <Typography variant={isNonMobile ? "h2" : "h3"}>{user?.firstName} {user?.lastName}</Typography>
</Box>

  <Grid container spacing={1} justifyContent="center" alignItems="center">
    <Box sx={{display:'flex',flexDirection:'column', width: "70%"}}>
      {[
        
        { icon: <FaUser />, text: 'Edit Basic Info', link: '/user/edit/basicInfo' },
        { icon: <FaLock />, text: 'Change Password', link: '/user/edit/password' },

        { icon: <FaCreditCard />, text: 'Payment', link: '/user/edit/payment' },
        { icon: <FaHome />, text: 'Address', link: '/user/edit/address' },
        { icon: <FiLogOut />, text: 'Log Out', link: '/' },
      ].map((item, index) => (
        (role === "admin" || role === "pharmacist") ? (
          (item.link === '/user/edit/basicInfo' || item.link === '/user/edit/password'|| item.link === '/') && (
            <Link to={item.link}  key={index} style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  backgroundColor:alt,
                  width: "100%",px:4, borderRadius:'10px',
                  height: isNonMobile?"100px":"62px", mb:2, 
                  display:'flex', alignItems: 'center', gap:2, 
                  justifyContent:'left',
                  '&:hover': {
                    backgroundColor:primary,
                  color:alt,
                  }
                }}
              >
                {item.icon}
                <Typography variant="subtitle1" mt={isNonMobile?1:0.5}  sx={{fontSize:'12px'}}>
                  {item.text}
                </Typography>
              </Card>
            </Link>
          )
        ) : (
          <Link to={item.link}  key={index} style={{ textDecoration: 'none' }}>
            <Card
              sx={{
                width: "100%",px:4,
                 fontSize:!isNonMobile&&'10px',
                  borderRadius:'10px',
                  height: isNonMobile?"100px":"62px", mb:2,
                   display:'flex', alignItems: 'center',
                    gap:2, justifyContent:'left',
                    backgroundColor:alt,
                    '&:hover': {
                      backgroundColor:primary,
                    color:alt,
                    }
                  }}
            >
              {item.icon}
              <Typography variant="subtitle1" mt={1}>
                {item.text}
              </Typography>
            </Card>
          </Link>
        )
      ))}
    </Box>
  </Grid>
</Box>
</>
);
}

export default Index;

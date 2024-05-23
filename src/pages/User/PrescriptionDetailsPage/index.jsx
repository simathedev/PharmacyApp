
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Card, Box,useMediaQuery, Typography, Divider,Button, CircularProgress, useTheme } from '@mui/material';
import EditButton from "components/buttons/EditButton";
import DeleteButton from "components/buttons/DeleteButton";
import AddButton from "components/buttons/AddButton";
import BackButton from "components/buttons/BackButton";
import OrderProducts from "components/OrderProducts";
import { Link } from 'react-router-dom';
import Navbar from "components/navbar";
import AvailableMedication from "components/AvailableMedication";
import Loading from "components/Loading";
import { useParams } from "react-router-dom";

const Index = () => {
  const {id}=useParams();
  const token = useSelector((state) => state.auth.token);
  const [prescription, setPrescription] = useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  let apiUrlSegment=process.env.NODE_ENV === 'production' ?
    `https://pharmacy-app-api.vercel.app`
    :
    `http://localhost:3001`

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  useEffect(() => {
    const fetchPrescription = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrlSegment}/prescription/getPrescription/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const scriptData = await response.json();
          console.log("script data:",scriptData);
          setPrescription(scriptData);
        } else {
          console.log("Failed to fetch script");
        }
      } catch (error) {
        console.error("Error fetching script:", error);
      }
      finally {
        setIsLoading(false); 
      }
    };

    fetchPrescription();
  }, [token]);

  return (

    <Box sx={{display:'flex',flexDirection:'column'}}>
      <Box sx={{alignItems:'left',justifyContent:'left',display:'flex',px:isNonMobile?'3rem':'0.5rem'}}>
    <Link to={'/user/view/prescriptions'}>
    <BackButton/>
    </Link>
  
    </Box>
    <Box sx={{alignItems:'left',justifyContent:'left',width:'30%',display:'flex',px:isNonMobile?'3rem':'0.5rem',py:1}}>
    <Link to={'/user/add/prescription'}>
    <AddButton/>
    </Link>
    </Box>
    <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
      <Box sx={{textAlign:'center'}}>
      <Typography variant='h3' py="3">Prescription Details Page</Typography>
      </Box>
      <Card sx={{width:isNonMobile?'70%':'90%',marginBottom:6,borderRadius:5,pl:4,marginTop:'4rem',minHeight:'40vh',py:4}}>
      {prescription.length === 0 && (
          <Typography variant="h4">No Prescription found...</Typography>
        )}
        <Box sx={{py:4, gap:3}}>
 <Typography variant={isNonMobile?'h4':'h5'} fontWeight='bold' color='primary'>
        Start Date
      </Typography>
      <Typography variant='body1' sx={{ fontSize: isNonMobile?'1.2rem':'0.8rem',mb:2 }}>
        {prescription.startDate}
      </Typography>


        <Typography variant={isNonMobile?'h4':'h5'} fontWeight='bold' color='primary'>Repeats</Typography>
        <Typography variant='body1' sx={{ fontSize: isNonMobile?'1.2rem':'0.8rem',mb:2 }}>{prescription.repeats}</Typography>
        
        <Typography variant={isNonMobile?'h4':'h5'} fontWeight='bold' color='primary'>Pharmacy</Typography>
        <Typography variant='body1' sx={{ fontSize: isNonMobile?'1.2rem':'0.8rem' }}>{prescription.pharmacy?.name}</Typography>
        <Typography variant='body1' sx={{fontSize:isNonMobile?'1.2rem':'0.8rem',mb:2}}>{prescription.pharmacy?.streetAddress}</Typography>


        <Typography variant={isNonMobile?'h4':'h5'} fontWeight='bold' color='primary'>Doctor </Typography>
        <Typography variant='body1' sx={{ fontSize: isNonMobile?'1.2rem':'0.8rem',mb:2 }}>{prescription.doctor}</Typography>

        <Typography variant={isNonMobile?'h4':'h5'} fontWeight='bold' color='primary'>
          Approved By Pharmacy
          </Typography>
          <Typography variant='body1' sx={{ fontSize: isNonMobile?'1.2rem':'0.8rem',mb:2 }}>
            <span style={{color:prescription.approved?'green':'red',fontWeight:'bold'}}>
            {prescription.approved?'Yes':'No'}
            </span>
            </Typography>
        </Box>
       
     <Box sx={{width:isNonMobile?'70%':'90%'}}>
     <AvailableMedication medications={prescription.medications}/>
     </Box>
  
       
      </Card>
    </Box>
    </Box>
  )
}

export default Index
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Card, Box,useMediaQuery, Typography, Button, CircularProgress, useTheme } from '@mui/material';
import EditButton from "components/buttons/EditButton";
import DeleteButton from "components/buttons/DeleteButton";
import AddButton from "components/buttons/AddButton";
import BackButton from "components/buttons/BackButton";
import OrderProducts from "components/OrderProducts";
import { Link } from 'react-router-dom';
import Navbar from "components/navbar";
import AvailableMedication from "components/AvailableMedication";

const Index = () => {
    const token = useSelector((state) => state.auth.token);
  const [prescriptions, setPrescriptions] = useState([]);
  const [displayAvailability,setDisplayAvailability]=useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
   const toggleAvailability = () => {
    setDisplayAvailability((prev) => !prev); // Toggle the displayAvailability state
  };
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  let userId;
  userId=user._id;

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/prescription/getUserPrescriptions/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const scriptData = await response.json();
          console.log("scripts data:",scriptData);
          setPrescriptions(scriptData);
        } else {
          console.log("Failed to fetch scripts");
        }
      } catch (error) {
        console.error("Error fetching scripts:", error);
      }
      finally {
        setLoading(false); // Set loading to false when data fetching is completed
      }
    };

    fetchPrescriptions();
  }, [token]);

  
  return (
<Box sx={{minHeight:"100vh"}}>
{loading?(
 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
 <CircularProgress />
 <Typography variant='h4' color='primary' sx={{px:2}}>Loading...</Typography>
</Box>
    ):(
    <Box sx={{textAlign:'center'}}>
    <Typography variant='h3'>Your Prescriptions</Typography>

    <Box sx={{alignItems:'left',justifyContent:'left',display:'flex',px:isNonMobile?'3rem':'0.5rem'}}>
    <Link to={'/user'}>
    <BackButton/>
    </Link>
    
    </Box>
    <Box sx={{alignItems:'left',justifyContent:'left',width:'30%',display:'flex',px:isNonMobile?'3rem':'0.5rem',py:1}}>
    <Link to={'/user/add/prescription'}>
    <AddButton/>
    </Link>
    </Box>
    {prescriptions.length === 0 && (
          <Typography variant="h4">No Prescription found...</Typography>
        )}
      
   {prescriptions.map((script) => (
    <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
      <Card key={script._id} sx={{backgroundColor:alt,width:isNonMobile?'80%':'80%',my:2,px:4,py:6,textAlign:'left'}}>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
        <Box sx={{display:'flex',justifyContent:'space-between',pb:1}}>
          <Typography variant={isNonMobile?'h5':'h6'} width='40%' color='primary' sx={{fontWeight:'bold'}}>{script._id}</Typography>
          <Box sx={{display:'flex',textAlign:'right',width:'40%',flexDirection:'column'}}>
          <Typography variant='body1'  sx={{fontWeight:'bold'}}>{script.startDate}</Typography>
          </Box>
          </Box>
    
          <Typography variant="body1">
            Medication: 
          {script.medications.map((medication, index) => (
<>
 {medication.medication.name}, 
</>
))}
</Typography>
        <Typography  variant='body1'>Repeats: {script.repeats}</Typography>
        <Typography  variant='body1'>Doctor: {script.doctor}</Typography>
        <Typography  variant='body1'>Pharmacy: {script.pharmacy.name}</Typography>
        <Typography  variant='body1'>Approved: {script.approved ? 'Yes' : 'No'}</Typography>
      <Button onClick={toggleAvailability}>
      {displayAvailability?'Close Table':'Check Medication Available'}
      </Button>
      {displayAvailability&&
      (
        <AvailableMedication medications={script.medications}/>
      )}
        </Grid>
     
        <Grid item xs={6} sx={{display:'flex', alignItems:'center',justifyContent:'center',gap:2}}>
        </Grid>
        </Grid>
      </Card>
      </Box>
    ))}
  </Box>
    )}
  </Box>
  )
}

export default Index
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
import Loading from "components/Loading";
import NoDataFound from "components/widgets/NoDataFound";

const Index = () => {
    const token = useSelector((state) => state.auth.token);
  const [prescriptions, setPrescriptions] = useState([]);
  const [displayAvailability,setDisplayAvailability]=useState(false);
  const [isLoading,setIsLoading]=useState(true);
  const isNonMobile = useMediaQuery("(min-width:600px)");
   const toggleAvailability = () => {
    setDisplayAvailability((prev) => !prev); 
  };
  const user = useSelector((state) => state.auth.user);
  let userId;
  userId=user?._id;

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setIsLoading(true);
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
        setIsLoading(false); // Set loading to false when data fetching is completed
      }
    };

    fetchPrescriptions();
  }, [token]);

if (isLoading)
{
  return <Loading/>
}
  
  return (
<Box sx={{minHeight:"100vh"}}>
  

 {/*<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
 <CircularProgress />
 <Typography variant='h4' color='primary' sx={{px:2}}>Loading...</Typography>
  </Box>*/}

    <Box sx={{textAlign:'center'}}>
    

    <Box sx={{alignItems:'left',justifyContent:'left',display:'flex',px:isNonMobile?'3rem':'0.5rem'}}>
    <Link to={'/user'}>
    <BackButton/>
    </Link>
    
    </Box>
    <Typography variant='h3'>Your Prescriptions</Typography>
    <Box sx={{alignItems:'left',justifyContent:'left',width:'30%',display:'flex',px:isNonMobile?'3rem':'0.5rem',py:1}}>
    <Link to={'/user/add/prescription'}>
    <AddButton/>
    </Link>
    </Box>
    {prescriptions.length === 0 && (
          <Box sx={{minHeight:'60vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          {/*<Typography variant="h4">No Order found...</Typography>*/}
          <NoDataFound name='Prescription' icon='FaNotesMedical'/>
       </Box>
      
        )}
      
   {prescriptions.map((script) => (
    <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
      <Card key={script?._id} sx={{backgroundColor:alt,width:isNonMobile?'80%':'80%',my:2,px:4,py:6,textAlign:'left'}}>
      
      <Link to={`/user/view/prescription/${script?._id}`} style={{textDecoration:'none'}}>
      <Box sx={{display:'flex',alignItems:'left',flexDirection:!isNonMobile&&'column',backgroundColor:primaryLight, borderRadius:2, p:isNonMobile?'1.6rem 1rem':'1rem 0rem',my:1, justifyContent:isNonMobile?'space-between':'center',pb:1}}>
          <Box >
          <Typography variant={isNonMobile?'h5':'h6'} width={isNonMobile?'40%':'90%'}  sx={{fontWeight:'bold',color:primary}}>SCR{script?._id}</Typography>
          </Box>
          <Box >
          <Typography variant='body1'  sx={{fontWeight:'bold',color:primary}}>{script?.startDate}</Typography>
          </Box>
          </Box>
      </Link>
        
    
          <Typography variant="body1">
            Medication: 
          {script?.medications.map((medication, index) => (
<>
 {medication.medication.name}, 
</>
))}
</Typography>
        <Typography  variant='body1'>Repeats: {script?.repeats}</Typography>
        <Typography  variant='body1'>Doctor: {script?.doctor}</Typography>
        <Typography  variant='body1'>Pharmacy: {script?.pharmacy?.name}</Typography>
        <Typography  variant='body1'>Approved: <span style={{color:script.approved?'green':'red',fontWeight:'bold'}}>
        {script.approved ? 'Yes' : 'No'}
          </span></Typography>
      {/*<Button onClick={toggleAvailability}>
      {displayAvailability?'Close Table':'Check Medication Available'}
      </Button>
      {displayAvailability&&
      (
        <AvailableMedication medications={script.medications}/>
      )}*/}
      
     

      </Card>
      </Box>
    ))}
  </Box>
  </Box>
  )
}

export default Index
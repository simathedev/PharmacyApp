import React, {useState,useEffect} from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { Grid, Card, Box,useMediaQuery,Typography, Button, useTheme } from '@mui/material';
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const MedicationNotification = () => {

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [medications, setMedications] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const selectedPharmacy=useSelector((state)=>state.auth.pharmacy);
  useEffect(() => {
    const fetchFinishedMedication = async () => {
      let pharmacyId;
      pharmacyId = selectedPharmacy._id;
      console.log("pharmacy id: ",pharmacyId);

      let apiUrlSegment=process.env.NODE_ENV === 'production' ?
      `https://pharmacy-app-api.vercel.app`
      :
      `http://localhost:3001`

        try {

          const response = await fetch(`${apiUrlSegment}/medication/getFinishedMedications/${pharmacyId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const medicationData = await response.json();
            console.log("medication data:",medicationData)
            setMedications(medicationData);
          } else {
            console.log('Failed to fetch medication');
          }
        } catch (error) {
          console.error('Error fetching medication:', error);
        }
      };
      fetchFinishedMedication();
  }, [token]);
  if (medications.length === 0) {
    return <Typography fontStyle='italic'>No medication found.</Typography>;
  }

  return (

    <Box sx={{borderRadius:'2%',padding:'2px 4px'}}>
 {/*<Typography>Medication Notification</Typography>*/}
 
 {medications?.map((medication) => (
        <Card key={medication._id} sx={{backgroundColor:alt,my:2,px:isNonMobile?4:5,py:1,textAlign:'left'}}>
          <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='body1' fontWeight='500' color='primary' sx={{py:1}}>Medication: {medication.name}</Typography>
            <Typography variant='body1' sx={{pb:0.4}}>Category: {medication.category}</Typography>
            <Typography variant='body1' sx={{pb:0.4}}>{medication.inStock?'in stock':'out of stock'}</Typography>

          </Grid>
       
        <Grid item xs={12} sx={{display:'flex', alignItems:'left',justifyContent:'left'}}>
         <Link to={`/Edit/Medication/${medication._id}`}>
        <Button>Update</Button>
         </Link>
          {/*possibly delete order?
          but that will result in junk medications.
            <Link to={`Edit/Order/${medications._id}`}>
         <Button>Cancel Order</Button>
         </Link>
          */}
          </Grid>
          </Grid>
        </Card>
      ))}
      <Link to={`/manage/medications?inStock=${encodeURIComponent('false')}`} style={{ textDecoration: 'none' }}>
      <Button>View More</Button>
      </Link>
    </Box>
  );
};

export default MedicationNotification;
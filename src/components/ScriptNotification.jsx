import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { Grid, Card, Box, useMediaQuery, Typography, Button, useTheme } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ScriptNotification = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const token = useSelector((state) => state.auth.token);
  const selectedPharmacy = useSelector((state) => state.auth.pharmacy);

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  const fetchNewScripts = async () => {
    let pharmacyId;
    pharmacyId = selectedPharmacy._id;
    console.log("pharmacy id: ", pharmacyId);
    try {
      const response = await fetch(`http://localhost:3001/prescription/getNewPrescriptions/${pharmacyId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const scriptsData = await response.json();
        console.log("scripts data:", scriptsData)
        setScripts(scriptsData);
      } else {
        console.log('Failed to fetch scripts');
      }
    } catch (error) {
      console.error('Error fetching scripts:', error);
    }
    finally {
      setLoading(false); // Set loading to false once data fetching is done
    }
  };

  useEffect(() => {
    fetchNewScripts();
  }, [token]);

  const updateApprovedScript = async (id) => {
    try {
      const scriptApprovedResponse = await fetch(`http://localhost:3001/prescription/updatePrescription/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ approved:true}),
      });
      const updatedScript = await scriptApprovedResponse.json();

      if (updatedScript) {
      
          toast.success('Script Approved.', { 
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
       
          fetchNewScripts();
      } else {
        toast.error('Script Approval Request Unsuccessful', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error('Error updating script approval:', error);
    }
  }
  if (loading) {
    return <Typography>Loading...</Typography>; // Display loading indicator while fetching data
  }

  if (scripts.length === 0) {
    return <Typography>No orders found.</Typography>; // Display message when no orders are found
  }


  return (
    <Box sx={{ borderRadius: '2%', padding: '2px 4px' }}>
      <Typography>Script Notification</Typography>
      {scripts?.slice(0,2).map((script) => (
        <Card key={script._id} sx={{ backgroundColor:alt,my: 2, px: isNonMobile ? 4 : 5, py: 1, textAlign: 'left' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='body1' fontWeight='500' color='primary' sx={{ py: 1 }}>Prescription ID: {script._id}</Typography>
              <Typography variant='body1' sx={{ pb: 0.4 }}>Customer: {script.user?.firstName} {script.user?.lastName}</Typography>
            <Typography variant='body1' fontWeight='bold'> Medication: </Typography>
              {script.medications && script.medications.map((medication) => (
                <Typography key={medication._id} variant='body2' sx={{ pl: 2 }}>{medication.medication.name}</Typography>
              ))}
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
                <Button onClick={() => updateApprovedScript(script._id)} >Approve</Button>
            </Grid>
          </Grid>
        </Card>
      ))}
      <Link to='/manage/prescriptions'>
      <Button>View More</Button>
      </Link>
    </Box>
  );
};

export default ScriptNotification;

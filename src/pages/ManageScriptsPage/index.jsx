import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Card, Box,useMediaQuery, Typography, Button, useTheme,  CircularProgress,Select, MenuItem,FormControl  } from '@mui/material';
import EditButton from "components/buttons/EditButton";
import DeleteButton from "components/buttons/DeleteButton";
import AddButton from "components/buttons/AddButton";
import BackButton from "components/buttons/BackButton";
import { Link } from 'react-router-dom';
import DeleteItem from "components/DeleteItem";
import { FaNotesMedical } from "react-icons/fa";
import Navbar from "components/navbar";
import NotPermitted from "components/NotPermitted";
import PrescriptionFilter from "components/PrescriptionFilter";
import SearchWidget from "components/widgets/Search";
import Loading from "components/Loading";
import NoDataFound from "components/widgets/NoDataFound";
import { useLocation } from 'react-router-dom';


const ManageScriptsPage = () => {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;
//
  const token = useSelector((state) => state.auth.token);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicationName, setMedicationName] = useState('');
  const[filteredScripts,setFilteredScripts]=useState(false);
  const [sortedPrescriptions,setSortedPrescriptions]=useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateAsc');
  const selectedPharmacy=useSelector((state)=>state.auth.pharmacy);
  const role= useSelector((state) => state.auth.role);
const [userName,setUserName]=useState('');
const [deleteItemId,setDeleteItemId]=useState(null);
const [showFilters, setShowFilters] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const isNonMobile = useMediaQuery("(min-width:600px)");
const isLargeScreen= useMediaQuery("(min-width:900px)");
const isMediumScreen = useMediaQuery("(min-width:500px) and (max-width:800px)");
const isPermitted=role==='pharmacist'||role==='admin';

const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const approvedOutcome = searchParams.get('approved');
console.log("search params scripts:",approvedOutcome);

const fetchScripts = async () => {
  setIsLoading(true);
  try {
    let apiUrl;
      let pharmacyId;
      pharmacyId = selectedPharmacy?._id;
      console.log("pharmacy id: ",pharmacyId);
      if(role==='pharmacist'&&selectedPharmacy){
        apiUrl=`http://localhost:3001/prescription/getPrescriptions/${pharmacyId}` 
      }
      else if (role==='admin'){
        apiUrl="http://localhost:3001/prescription/getPrescriptions"
      }
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const prescriptionsData = await response.json();
      console.log('Prescription data: ',prescriptionsData);
      let prescriptionsFilterData;
     if (approvedOutcome==='false') {
        prescriptionsFilterData = prescriptionsData.filter(script => script.approved === false);
        setPrescriptions(prescriptionsFilterData);
      } else {
        setPrescriptions(prescriptionsData);
      }
   
   } else {
      console.log("Failed to fetch prescriptions");
    }
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
  }
  finally {
    setIsLoading(false); 
  }
};


  useEffect(() => {
    fetchScripts();
  }, [token]);

  const handleDelete = async () => {
    if (deleteItemId) {
        const id=deleteItemId
        
        const response = await fetch(`http://localhost:3001/prescription/deletePrescription/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    
        if (response.ok) {
        setDeleteItemId(null);
        fetchScripts();
        } else {
            // Handle error case
            console.log("Error deleting item:", response.statusText);
        }
    }
      console.log(deleteItemId);
     
    }

    useEffect(() => {
  
      let searchScripts;
      let sortedScripts;

      searchScripts = prescriptions.filter(prescription => {
        const searchQueryLower = searchQuery.toLowerCase();
        const fullName = `${prescription?.user?.firstName} ${prescription?.user?.lastName}`.toLowerCase();
        return (
          fullName.includes(searchQueryLower) ||
          prescription?._id.includes(searchQuery)
        );
      });

      // Sort medications based on selected criteria
      if(filteredScripts)
      {
        searchScripts = prescriptions.filter(prescription => {
          const searchQueryLower = searchQuery.toLowerCase();
          const fullName = `${prescription?.user?.firstName} ${prescription?.user?.lastName}`.toLowerCase();
          return (
            fullName.includes(searchQueryLower) ||
            prescription?._id.includes(searchQuery)
          );
        });

    sortedScripts = searchScripts.slice().sort((a, b) => {
          switch (sortBy) {
            case 'dateAsc': 
              return new Date(a.startDate) - new Date(b.startDate);
            case 'dateDesc':
              return new Date(b.startDate) - new Date(a.startDate);
            default:
              return 0;
          }
        });
      }
      else{

       sortedScripts = searchScripts.slice().sort((a, b) => {
          switch (sortBy) {
            case 'dateAsc': 
              return new Date(a.startDate) - new Date(b.startDate);
            case 'dateDesc':
              return new Date(b.startDate) - new Date(a.startDate);
            default:
              return 0;
          }
        });
      }
    
      // Update sortedMedications state
      setSortedPrescriptions(sortedScripts);
    }, [prescriptions, searchQuery, sortBy]);


    const applyFilter = (filter) => {
      let filteredPrescriptions = prescriptions.slice(); // Create a shallow copy of the prescriptions array
    
      // Apply filter based on approved status
      if (filter.approved !== undefined) {
        filteredPrescriptions = filteredPrescriptions.filter(prescription => prescription.approved === filter.approved);
      }
    
      // Apply filter based on date range
      if (filter.startDate && filter.endDate) {
        // Convert start and end dates to Date objects
        const startDate = new Date(filter.startDate);
        const endDate = new Date(filter.endDate);
    
        // Filter prescriptions within the date range
        filteredPrescriptions = filteredPrescriptions.filter(prescription => {
          const prescriptionDate = new Date(prescription.startDate);
          return prescriptionDate >= startDate && prescriptionDate <= endDate;
        });
      }
    
      // Update the prescriptions after applying filter
      setSortedPrescriptions(filteredPrescriptions);
      setFilteredScripts(true); // Ensure this triggers a re-render
    };
    
    
    if(isLoading)
    {
      return <Loading/>
    }
    

  return (
    <>
    {isPermitted?(
      <>

    <Box sx={{textAlign:'center'}}>
      <Typography variant={isNonMobile?'h1':'h3'} sx={{mt:isNonMobile?5:2}}>Manage Prescriptions</Typography>
      <SearchWidget searchQuery={searchQuery} setSearchQuery={setSearchQuery} isNonMobile={isNonMobile}/>
      <Box sx={{alignItems:'left',justifyContent:'left',display:'flex',px:isNonMobile?'3rem':'0.5rem'}}>
      {
        role=='pharmacist'?
        <Link to={'/Pharmacist'}>
        <BackButton/>
        </Link>
        :
        <Link to={'/Admin'}>
        <BackButton/>
        </Link>
      }
      </Box>
      <Box sx={{alignItems:'left',justifyContent:'left',width:'30%',display:'flex',px:isNonMobile?'3rem':'0.5rem',py:1}}>
      <Link to={'/Add/Prescription'}>
      <AddButton/>
      </Link>
      </Box>

      <Card sx={{alignItems:'left',justifyContent:'left',backgroundColor:alt, width:isNonMobile?'30%':'60%',display:'flex',px:'3rem',py:0.8}}>
      <FormControl variant="outlined" sx={{width:'full'}}>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            displayEmpty
          >
            <MenuItem value="dateAsc">Date (old-new)</MenuItem>
            <MenuItem value="dateDesc">Date (new-old)</MenuItem>
          </Select>
        </FormControl>
      </Card>
      <Box sx={{width:'40%',justifyContent:'left',display:'flex',flexDirection:'column'}}>
  <Button
  sx={{
    width: isNonMobile?'40%':'70%',
    bgcolor: 'primary.main',
    px:2,
    py:1,
    mx:'1rem',
    ml:'-0.8rem',
    color: alt, // Set the text color to white
    '&:hover': {
      bgcolor: 'primary.dark', // Darken the background color on hover
    },
  }}
  onClick={() => setShowFilters(prevState => !prevState)}
  variant="contained" // Use the contained variant for a colored button
>
  Filter
</Button>
{showFilters&&(
 <Card sx={{alignItems:'left',justifyContent:'left',backgroundColor:alt, width:isLargeScreen?'70%':isMediumScreen?'80%':'60%',minHeight:!isNonMobile&&'4rem', display:'flex',flexDirection:'column',px:isNonMobile?'3rem':'1rem',py:isNonMobile?0.8:1}}>
 {/* Sort by dropdown */}
 <PrescriptionFilter handleFilter={applyFilter}/>
</Card>
)}

  </Box>
      

      {sortedPrescriptions?.length === 0 && (
        <NoDataFound name='Scripts' icon='FaNotesMedical'/>
        )}
     {sortedPrescriptions?.map((medication) => (
        <Card key={medication?._id}sx={{backgroundColor:alt,my:3,pl:isNonMobile?4:5,py:isNonMobile?5:3,textAlign:'left'}}>
          <Grid container spacing={2}>
          <Grid item xs={6}>
          <FaNotesMedical color='lightBlue' fontSize={isNonMobile?'4rem':'2rem'}/>
          <Link to={`/view/prescription/${medication._id}`} style={{textDecoration:'none'}}>
          <Typography color='primary' fontWeight='500' variant={isNonMobile?'h4':'h5'} sx={{py:2}}>Prescription: {medication?._id}</Typography>
          </Link>
            <Typography fontWeight='500' variant='body1' sx={{py:2}}>Medication:</Typography>
            {medication.medications.map((medication, index) => (
          <Typography variant='body1' sx={{ fontSize: '12px',display:'flex' }}>
            {medication.medication.name} {'x'+medication.quantity},
          </Typography>
      ))}
          
            <Typography variant='body1'sx={{py:0.4}} >Name: {medication.user?.firstName+" "+medication.user?.lastName}</Typography>
          <Typography variant='body1'sx={{py:0.4}} >Start Date: {medication?.startDate}</Typography>
          <Typography variant='body1' sx={{py:0.4}}>Repeats: {medication?.repeats}</Typography>
          <Typography variant='body1' sx={{py:0.4}}>Doctor: {medication?.doctor}</Typography>
          <Typography variant='body1'sx={{py:0.4}} >Approved: {medication.approved ? 'Yes' : 'No'}</Typography>
          </Grid>
       
          <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:isNonMobile?'center':'left',justifyContent:isNonMobile?'center':'left',gap:isNonMobile?2:1}}>
  
          <Link to={`/Edit/Prescription/${medication?._id}`}>
          <EditButton/>
          </Link>
          <DeleteButton onClick={() => setDeleteItemId(medication?._id)}/>
          </Grid>
          </Grid>
        </Card>
      ))}
       <DeleteItem
        open={Boolean(deleteItemId)}
        onClose={() => setDeleteItemId(null)}
        onDelete={() => handleDelete(deleteItemId)}
        deleteItemId={deleteItemId}
    />
    </Box>
   
      </>
    ):(
      <Box sx={{justifyContent:'center',alignItems:'center',textAlign:'center'}}>
      <NotPermitted/>
    </Box>
    )}
      
    </>
  );
};

export default ManageScriptsPage;
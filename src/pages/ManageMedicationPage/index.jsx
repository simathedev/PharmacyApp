import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
  Grid,
  Card, 
  Box,
  useMediaQuery, 
  Typography, 
  Button, 
  useTheme, 
  FormControl, 
  Select, 
  MenuItem,
  CircularProgress
} from '@mui/material';
import EditButton from "components/buttons/EditButton";
import DeleteButton from "components/buttons/DeleteButton";
import AddButton from "components/buttons/AddButton";
import BackButton from "components/buttons/BackButton";
import { Link } from 'react-router-dom';
import DeleteItem from "components/DeleteItem";
import Navbar from "components/navbar";
import NotPermitted from "components/NotPermitted";
import SearchWidget from "components/widgets/Search";

const ManageMedicationPage = () => {
  const token = useSelector((state) => state.auth.token);
  const selectedPharmacy=useSelector((state)=>state.auth.pharmacy);
  const role= useSelector((state) => state.auth.role);
  const isLargeScreen= useMediaQuery("(min-width:900px)");
  console.log('role in manage medication page:',role)
  const [medications, setMedications] = useState([]);
  const [sortBy, setSortBy] = useState('nameAsc');
  const [deleteItemId,setDeleteItemId]=useState(null)
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isPermitted=role==='pharmacist'||role==='admin';

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;


  const fetchMedications = async () => {
    setLoading(true);
    try {
      let apiUrl;
      let pharmacyId;
      pharmacyId = selectedPharmacy._id;
      console.log("pharmacy id: ",pharmacyId);
      if(role==='pharmacist'&&selectedPharmacy){
        apiUrl=`http://localhost:3001/medication/getMedications/${pharmacyId}`
      }
      else if(role==='admin'){
        apiUrl="http://localhost:3001/medication/getMedications"
      }
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const medicationsData = await response.json();
        setMedications(medicationsData);
      } else {
        console.log("Failed to fetch medications");
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
    finally {
      setLoading(false); // Set loading to false when data fetching is completed
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [token]);

  const handleDelete = async () => {
    if (deleteItemId) {
        const id=deleteItemId
        
        const response = await fetch(`http://localhost:3001/medication/deleteMedication/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    
        if (response.ok) {
        setDeleteItemId(null);
        fetchMedications();
        } else {
            // Handle error case
            console.log("Error deleting item:", response.statusText);
        }
    }
      console.log(deleteItemId);
     
    }
    const searchMedications = medications.filter(medication => {
      return medication.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const sortedMedications = searchMedications.slice().sort((a, b) => {
    switch (sortBy) {
      case 'priceHigh':
          return b.price - a.price;
        case 'priceLow':
          return a.price - b.price;
      case 'nameAsc': 
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });



  return (
    <>
     {isPermitted?(
      <>
 {loading?(
 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
 <CircularProgress />
 <Typography variant='h4' color='primary' sx={{px:2}}>Loading...</Typography>
</Box>
    ):(
      <Box sx={{textAlign:'center'}}>
      <Typography variant={isNonMobile?'h1':'h2'} sx={{mt:isNonMobile?5:2}}>Manage Medication</Typography>
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
     <Link to='/Add/Medication'>
     <AddButton/>
     </Link>
{(isPermitted&&isLargeScreen)&&(
 <Link to='/Add/BulkMedication'>
 <Button>
  Add Bulk Medication
 </Button>
 </Link>
)}
    
    </Box>
    <Card sx={{alignItems:'left',justifyContent:'left',backgroundColor:alt, width:isNonMobile?'30%':'60%',display:'flex',px:'3rem',py:0.8}}>
    <FormControl variant="outlined" sx={{width:'full'}}>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            displayEmpty
          >
            <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
            <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
            <MenuItem value="priceHigh">Price (High to Low)</MenuItem>
            <MenuItem value="priceLow">Price (Low to High)</MenuItem>
          </Select>
        </FormControl>
    </Card>{medications.length === 0 && (
          <Typography variant="h4">No medications found...</Typography>
        )}
      
    
      {/* Render medications */}
      {sortedMedications.map((medication) => (
        <Card key={medication._id} sx={{backgroundColor:alt,my:2,px:4,py:6,textAlign:'left'}}>
          <Grid container spacing={2}>
          <Grid item xs={6}>
          {/* Display medication details */}
          <Grid item xs={12}>
          <img
            width="110px"
            height="110px"
            alt="medication"
            style={{marginTop: "0.75rem",borderRadius:'10%' }}
            src={`http://localhost:3001/assets/${medication.picture}`}
          />
            </Grid>
          <Typography color='primary' fontWeight='500' variant='h3' sx={{pb:2}}>{medication.name}</Typography>
          <Typography variant='body1'  sx={{py:0.4}} >Quantity: {medication.quantity}</Typography>
          <Typography variant='body1'  sx={{py:0.4}} >Price: {medication.price}</Typography>
          <Typography variant='body1'  sx={{py:0.4}} >Category: {medication.category}</Typography>
          <Typography variant='body1'  sx={{py:0.4}} >Availability: {medication.inStock?'in stock':'out of stock'}</Typography>
          {role==='admin'&&(
          <Typography variant='body1'  sx={{py:0.4}} >Pharmacy: {medication.pharmacy.name}</Typography>

          )}
          </Grid>
       
          {/* Add other medication details to display */}
          <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:isNonMobile?'center':'left',justifyContent:isNonMobile?'center':'left',gap:2}}>
         <Link to={`/Edit/Medication/${medication._id}`}>
         <EditButton/>
         </Link>
         
          <DeleteButton onClick={() => setDeleteItemId(medication._id)}/>
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
    )}
  
      </>
     ):(
      <Box sx={{justifyContent:'center',alignItems:'center',textAlign:'center'}}>
      <NotPermitted/>
    </Box>
     )}
   
    </>
  );
};

export default ManageMedicationPage;

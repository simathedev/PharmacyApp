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
import Loading from "components/Loading";
import NoDataFound from "components/widgets/NoDataFound";
import MedicationFilter from "components/MedicationFilter";
import { useLocation } from "react-router-dom";

const ManageMedicationPage = () => {
  const [showFilters,setShowFilters]=useState(false);
  const [filteredMedications,setFilteredMedications]=useState(false);
  const token = useSelector((state) => state.auth.token);
  const selectedPharmacy=useSelector((state)=>state.auth.pharmacy);
  const role= useSelector((state) => state.auth.role);
  const isLargeScreen= useMediaQuery("(min-width:900px)");
  console.log('role in manage medication page:',role)
  const [medications, setMedications] = useState([]);
  const [sortedMedications, setSortedMedications] = useState([]);
  const [sortBy, setSortBy] = useState('nameAsc');
  const [deleteItemId,setDeleteItemId]=useState(null)
  //const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isPermitted=role==='pharmacist'||role==='admin';
  const isMediumScreen = useMediaQuery("(min-width:500px) and (max-width:800px)");

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

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const inStockOutcome = searchParams.get('inStock');
  console.log("in stock: ",inStockOutcome);


  const fetchMedications = async () => {
    setIsLoading(true);
    try {
      let apiUrl;
     
      let pharmacyId;
      pharmacyId = selectedPharmacy._id;
      console.log("pharmacy id: ",pharmacyId);
      if(role==='pharmacist'&&selectedPharmacy){
        apiUrl=`${apiUrlSegment}/medication/getMedications/${pharmacyId}`
      }
      else if(role==='admin'){
        apiUrl=`${apiUrlSegment}/medication/getMedications`
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
        let medicationsFilterData;
        if(inStockOutcome==='false')
        {
          medicationsFilterData = medicationsData.filter(medication => medication.inStock === false);
          setMedications(medicationsFilterData);
        }
        else
        {
          setMedications(medicationsData);
        }
     
      } else {
        console.log("Failed to fetch medications");
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
    finally {
      setIsLoading(false); // Set loading to false when data fetching is completed
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [token]);

  const handleDelete = async () => {
    if (deleteItemId) {
        const id=deleteItemId
        
        const response = await fetch(`${apiUrlSegment}/medication/deleteMedication/${id}`, {
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

    useEffect(() => {
  
      let searchMedications;
      let sortedMeds;

     searchMedications = medications.filter(medication => {
        return medication.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      
      if(filteredMedications)
      {
        const searchMedications = medications.filter(medication => {
          return medication.name.toLowerCase().includes(searchQuery.toLowerCase());
        });

        sortedMeds = searchMedications.slice().sort((a, b) => {
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
      }
      else{

        sortedMeds = searchMedications.slice().sort((a, b) => {
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
      }
    
      // Update sortedMedications state
      setSortedMedications(sortedMeds);
    }, [medications,searchQuery, sortBy]);


    /*const searchMedications = medications.filter(medication => {
      return medication.name.toLowerCase().includes(searchQuery.toLowerCase());
    });*/

  /*const sortedMedications = searchMedications.slice().sort((a, b) => {
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
  });*/
  const applyFilter = (filter) => {
    let filteredMedications = medications.slice(); // Create a shallow copy of medications
  
    // Apply availability filter
    if (filter.availability) {
      const { instock, outofstock } = filter.availability;
      if (!instock) {
        filteredMedications = filteredMedications.filter((medication) => !medication.inStock);
      }
      if (!outofstock) {
        filteredMedications = filteredMedications.filter((medication) => medication.inStock);
      }
    }
  
    // Apply pharmacy filter
    if (filter.pharmacy) {
      filteredMedications = filteredMedications.filter((medication) => medication.pharmacy === filter.pharmacy);
    }
  
    // Update state with filtered medications
    setSortedMedications(filteredMedications);
    setFilteredMedications(true);
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
      <Typography variant={isNonMobile?'h1':'h3'} sx={{mt:isNonMobile?5:2}}>Manage Medication</Typography>
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
    </Card>

    <Box sx={{width:'40%',justifyContent:'left',display:'flex',flexDirection:'column'}}>
  <Button
  sx={{
    position:"relative",
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
 <Card sx={{zIndex:9999, alignItems:'left',justifyContent:'left',backgroundColor:alt, width:isLargeScreen?'70%':isMediumScreen?'80%':'60%',minHeight:!isNonMobile&&'4rem', display:'flex',flexDirection:'column',px:isNonMobile?'3rem':'1rem',py:isNonMobile?0.8:1}}>
 {/* Sort by dropdown */}
 <MedicationFilter handleFilter={applyFilter} />

</Card>
)}
</Box>

    {sortedMedications.length === 0 && (
          <NoDataFound name="Medication" icon='CgPill'/>
        )}
      
    
      {/* Render medications */}
      {sortedMedications.map((medication) => (
        <Card key={medication._id} sx={{backgroundColor:alt,my:isNonMobile?2:3,px:4,py:isNonMobile?6:3,textAlign:'left'}}>
          <Grid container spacing={2}>
          <Grid item xs={6}>
          {/* Display medication details */}
          <Grid item xs={12}>
          <img
            width="110px"
            height="110px"
            alt="medication"
            style={{marginTop: "0.75rem",borderRadius:'10%' }}
            src={`${apiUrlSegment}/assets/${medication.picture}`}
          />
            </Grid>
            <Link to={`/view/medication/${medication._id}` } style={{textDecoration:'none'}}>
            <Typography color='primary' fontWeight='500' variant={isNonMobile?'h3':'h4'} sx={{pb:2}}>{medication.name}</Typography>
            </Link>
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

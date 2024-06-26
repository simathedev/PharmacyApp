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

const Index = () => {
  const token = useSelector((state) => state.auth.token);
  const role=useSelector((state)=>state.auth.role);
  const [pharmacies, setPharmacies] = useState([]);
  const [sortBy, setSortBy] = useState('nameAsc');
  const [deleteItemId,setDeleteItemId]=useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isNonMobile = useMediaQuery("(min-width:600px)");
  //const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const isPermitted=role==='pharmacist'||role==='admin';

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  let apiUrlSegment=process.env.NODE_ENV === 'production' ?
    `https://pharmacy-app-api.vercel.app`
    :
    `http://localhost:3001`


  const fetchPharmacies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrlSegment}/pharmacy/getPharmacies`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
      
        const pharmacyData = await response.json();
        console.log("pharmacy data:", pharmacyData);
        setPharmacies(pharmacyData);
      } else {
        console.log("Failed to fetch pharmacies");
      }
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
    }
    finally {
      setIsLoading(false); // Set loading to false when data fetching is completed
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, [token]);

  const handleDelete = async () => {
    if (deleteItemId) {
        const id=deleteItemId
        
        const response = await fetch(`${apiUrlSegment}/pharmacy/deletePharmacy/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    
        if (response.ok) {
        setDeleteItemId(null);
        fetchPharmacies();
        } else {
            // Handle error case
            console.log("Error deleting item:", response.statusText);
        }
    }
      console.log(deleteItemId);
     
    }

    const searchPharmacies = pharmacies.filter(pharmacy => {
      return pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const sortedPharmacies = searchPharmacies.slice().sort((a, b) => {
    switch (sortBy) {
      case 'nameAsc': 
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  if(isLoading)
  {
    return <Loading/>
  }

  return (
    <>
     {isPermitted?(
      <>
 
    <Box sx={{textAlign:'center'}}>
      {/* Render pharmacies */}
      <Typography variant={isNonMobile?'h1':'h3'} sx={{mt:isNonMobile?5:2}}>Manage Pharmacies</Typography>
      <SearchWidget searchQuery={searchQuery} setSearchQuery={setSearchQuery} isNonMobile={isNonMobile}/>
      <Box sx={{alignItems:'left',justifyContent:'left',display:'flex',px:isNonMobile?'3rem':'0.5rem'}}>
      <Link to={'/Admin'} style={{textDecoration:'none'}}>
      <BackButton/>
      </Link>
      </Box>

      <Box sx={{alignItems:'left',justifyContent:'left',width:'30%',display:'flex',px:isNonMobile?'3rem':'0.5rem',py:1}}>
      <Link to={'/Add/Pharmacy'} style={{ textDecoration: 'none' }}>
      <AddButton/>
      </Link>
      </Box>

      <Card sx={{backgroundColor:alt,alignItems:'left',justifyContent:'left', width:isNonMobile?'30%':'60%',display:'flex',px:'3rem',py:0.8}}>
      <FormControl variant="outlined">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            displayEmpty
          >
            <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
            <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
          </Select>
        </FormControl>
      </Card>

      {pharmacies.length === 0 && (
          <NoDataFound name="Pharmacies" icon='MdLocalPharmacy'/>
        )}

      {sortedPharmacies.map((pharmacy) => (
        <Card key={pharmacy._id} sx={{backgroundColor:alt,my:isNonMobile?2:3,px:4,py:isNonMobile?6:3,textAlign:'left'}}>
          {/* Display pharmacy details */}
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
          <Grid item xs={12}>
          <img
            width="100px"
            height="100px"
            alt="medication"
            style={{marginTop: "0.75rem",borderRadius:'50%',objectFit:'cover'}}
            src={`${apiUrlSegment}/assets/${pharmacy.picture}`}
          />
            </Grid>
            <Link to={`/view/pharmacy/${pharmacy?._id}`} style={{textDecoration:'none'}}>
            <Typography variant={isNonMobile?'h3':'h4'} color='primary' fontWeight='500' sx={{pb:2}}>{pharmacy.name}</Typography>
            </Link>
          <Typography variant='body1'  sx={{py:0.4}}>Email Address: {pharmacy.email}</Typography>
          <Typography variant='body1'  sx={{py:0.4}}>Contact Number: {pharmacy.phoneNumber}</Typography>
          <Typography variant='body1'  sx={{py:0.4}}>Operating Hours: {pharmacy.openTime} - {pharmacy.closeTime}</Typography>
          </Grid>
       
          <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:isNonMobile?'center':'left',justifyContent:isNonMobile?'center':'left',gap:isNonMobile?2:1}}>
          <Link to={`/Edit/Pharmacy/${pharmacy._id}`} style={{textDecoration:'none'}}>
          <EditButton/>
          </Link>
          <DeleteButton onClick={() => setDeleteItemId(pharmacy._id)}/>
          </Grid>
          </Grid>
          {/* Add other pharmacy details to display */}
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

export default Index;
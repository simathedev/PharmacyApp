import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Card, Box,useMediaQuery, CircularProgress, Typography, Button, useTheme, FormControl, Select, MenuItem } from '@mui/material';
import EditButton from "components/buttons/EditButton";
import DeleteButton from "components/buttons/DeleteButton";
import AddButton from "components/buttons/AddButton";
import BackButton from "components/buttons/BackButton";
import { Link } from 'react-router-dom';
import DeleteItem from "components/DeleteItem";
import { FaUserDoctor } from "react-icons/fa6";
import Navbar from "components/navbar";
import NotPermitted from "components/NotPermitted";
import SearchWidget from "components/widgets/Search";
import Loading from "components/Loading";
import NoDataFound from "components/widgets/NoDataFound";

const Index = () => {
  const token = useSelector((state) => state.auth.token);
  const role= useSelector((state) => state.auth.role);
  const [pharmacists, setPharmacists] = useState([]);
  const [sortBy, setSortBy] = useState('nameAsc');
  const [deleteItemId,setDeleteItemId]=useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isNonMobile = useMediaQuery("(min-width:600px)");
  //const [loading, setLoading] = useState(true);
  const [isLoading,setIsLoading]=useState(true);
  const isPermitted=role==='pharmacist'||role==='admin';

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


  const fetchPharmacists = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrlSegment}/pharmacist/getPharmacists`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const pharmacistData = await response.json();
        console.log("pharmacistData: ",pharmacistData)
        setPharmacists(pharmacistData);
      } else {
        console.log("Failed to fetch pharmacists");
      }
    } catch (error) {
      console.error("Error fetching pharmacists:", error);
    }
    finally {
      setIsLoading(false); // Set loading to false when data fetching is completed
    }
  };

  useEffect(() => {
    
    fetchPharmacists();
  }, [token]);

  const handleDelete = async () => {
    if (deleteItemId) {
        const id=deleteItemId
        
        const response = await fetch(`${apiUrlSegment}/pharmacist/deletePharmacist/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    
        if (response.ok) {
        setDeleteItemId(null);
        fetchPharmacists();
        } else {
            // Handle error case
            console.log("Error deleting item:", response.statusText);
        }
    }
      console.log(deleteItemId);
     
    }

    const searchPharmacists = pharmacists.filter(pharmacist => {
      const searchQueryLower = searchQuery.toLowerCase();
      const fullName = `${pharmacist.firstName} ${pharmacist.lastName}`.toLowerCase();
      return (
        fullName.includes(searchQueryLower) ||
        pharmacist.firstName.toLowerCase().includes(searchQueryLower)
      );
    });
    
    

  const sortedPharmacists = searchPharmacists.slice().sort((a, b) => {
    switch (sortBy) {
      case 'nameAsc': 
        return a.firstName.localeCompare(b.firstName);
      case 'nameDesc':
        return b.firstName.localeCompare(a.firstName);
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
      <Typography variant={isNonMobile?'h1':'h3'} sx={{mt:isNonMobile?5:2}}>Manage Pharmacists</Typography>
      <SearchWidget searchQuery={searchQuery} setSearchQuery={setSearchQuery} isNonMobile={isNonMobile}/>
      <Box sx={{alignItems:'left',justifyContent:'left',display:'flex',px:isNonMobile?'3rem':'0.5rem'}}>
      <Link to={'/Admin'}>
      <BackButton/>
      </Link>
      </Box>
      <Box sx={{alignItems:'left',justifyContent:'left',width:'30%',display:'flex',px:isNonMobile?'3rem':'0.5rem',py:1}}>
      <Link to={'/Add/Pharmacist'}>
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

      {pharmacists.length === 0 && (
          <NoDataFound name='Pharmacists' icon='FaUserDoctor'/>

        )}

      {/* Render pharmacists */}
      {sortedPharmacists.map((pharmacist) => (
        
        <Card key={pharmacist._id} sx={{backgroundColor:alt,my:isNonMobile?2:3,pl:4,py:isNonMobile?5:3,textAlign:'left'}}>
          {/* Display pharmacist details */}
          <Grid container spacing={2}>
          <Grid item xs={12}>
          {pharmacist.picture?
            <img
            width="100px"
            height="100px"
            alt="medication"
            style={{marginTop: "0.75rem",borderRadius:'50%',objectFit:'cover' }}
            src={`${apiUrlSegment}/assets/${pharmacist.picture}`}
          />:
          <FaUserDoctor/>
         }
            </Grid>
          <Grid item xs={12} sm={6}>
            <Link to={`/view/pharmacist/${pharmacist?._id}`} style={{textDecoration:'none'}}>
            <Typography variant={isNonMobile?'h3':'h4'}  fontWeight='500' color='primary' sx={{py:2}}>{pharmacist.firstName} {pharmacist.lastName}</Typography>
            </Link>
          <Typography variant='body1' sx={{py:0.4}}>Pharmacy:{pharmacist.pharmacy.name}</Typography>
          <Typography variant='body1' sx={{py:0.4}}>StreetAddress:{pharmacist.pharmacy.streetAddress}</Typography>
          <Typography variant='body1' sx={{py:0.4}}>Contact Number:{pharmacist.pharmacy.phoneNumber}</Typography>
          <Typography variant='body1' sx={{py:0.4}}>Role: {pharmacist.role}</Typography>
          <Typography variant='body1' sx={{py:0.4}}>Email Address: {pharmacist.email}</Typography>
          {/* Add other pharmacist details to display */}
          </Grid>
       
          <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:isNonMobile?'center':'left',justifyContent:isNonMobile?'center':'left',gap:2}}>
       <Link to={`/Edit/Pharmacist/${pharmacist._id}`}>
       <EditButton/>
       </Link>
       <DeleteButton onClick={() => setDeleteItemId(pharmacist._id)}/>
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

export default Index;

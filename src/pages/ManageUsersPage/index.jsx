import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Card, Box,useMediaQuery, Typography, CircularProgress, Button, useTheme, FormControl, Select, MenuItem  } from '@mui/material';
import EditButton from "components/buttons/EditButton";
import DeleteButton from "components/buttons/DeleteButton";
import AddButton from "components/buttons/AddButton";
import BackButton from "components/buttons/BackButton";
import SortBy from "components/SortBy";
import { Link } from 'react-router-dom';
import DeleteItem from "components/DeleteItem";
import { FaUserCircle } from "react-icons/fa";
import Navbar from "components/navbar";
import SearchWidget from "components/widgets/Search";
import { ContactSupportOutlined } from "@mui/icons-material";
import NoDataFound from "components/widgets/NoDataFound";
import Loading from "components/Loading";

const Index = () => {
  const token = useSelector((state) => state.auth.token);
  const selectedPharmacy=useSelector((state)=>state.auth.pharmacy);
  const role= useSelector((state) => state.auth.role);
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState('nameAsc');
  const [deleteItemId,setDeleteItemId]=useState(null)
  //const [loading, setLoading] = useState(true);
  const [isLoading,setIsLoading]=useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isPermitted = role === 'admin' || role === 'pharmacist';

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

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrlSegment}/user/getUsers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const userData = await response.json();
        console.log("user information: ",userData)
        setUsers(userData);
      } else {
        console.log("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    finally {
      setIsLoading(false); // Set loading to false when data fetching is completed
    }
  };
  useEffect(() => {
    

    fetchUsers();
  }, [token]);

 /* const searchUsers = users.filter(user => {
    return user.firstName.toLowerCase().includes(searchQuery.toLowerCase());
  });*/
  const searchUsers = users.filter(user => {
    const searchQueryLower = searchQuery.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      fullName.includes(searchQueryLower) ||
      user.firstName.toLowerCase().includes(searchQueryLower) ||
      user.lastName.toLowerCase().includes(searchQueryLower) ||
      user.phoneNumber.includes(searchQuery) || 
      user.IDNumber.includes(searchQuery)
    );
  });
  
  const sortedUsers = searchUsers.slice().sort((a, b) => {
    switch (sortBy) {
      case 'nameAsc': 
        return a.firstName.localeCompare(b.firstName);
      case 'nameDesc':
        return b.firstName.localeCompare(a.firstName);
      default:
        return 0;
    }
  });
  const handleDelete = async () => {
    if (deleteItemId) {
        const id=deleteItemId
        
        const response = await fetch(`${apiUrlSegment}/user/deleteUser/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    
        if (response.ok) {
        setDeleteItemId(null);
        fetchUsers();
        } else {
            // Handle error case
            console.log("Error deleting item:", response.statusText);
        }
    }
      console.log(deleteItemId);
     
    }

if(isLoading)
{
  return <Loading/>
}

  return (
    <>
    {isPermitted?(
<>
    <Box sx={{textAlign:'center'}}>
      <Typography variant={isNonMobile?'h1':'h3'}  sx={{mt:5}}>Manage Users</Typography>
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
      <Link to={'/Add/User'}>
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
            <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
            <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
          </Select>
        </FormControl>
      </Card>
      <Box>
    
      {users.length === 0 && (
          <NoDataFound name='Users' icon='FaUser'/>
        )}
      {sortedUsers.map((user) => (
        <Card key={user._id} sx={{background:alt,my:3,pl:isNonMobile?4:5,py:isNonMobile?5:3,textAlign:'left'}}>
          <Grid container spacing={1}>
          <Grid item xs={6}>
          <FaUserCircle fontSize='5rem' color='lightBlue'/>
          <Link to={`/view/user/${user._id}`} style={{textDecoration:"none"}}>
          <Typography variant={isNonMobile?'h3':'h4'} fontWeight='500' color='primary' sx={{py:2}}>{user.firstName} {user.lastName}</Typography>
          </Link>
          <Typography variant='body1' sx={{py:0.4}} >Email Address: {user.email}</Typography >
          <Typography variant='body1' sx={{py:0.4}} >ID number: {user.IDNumber}</Typography >
          <Typography variant='body1' sx={{py:0.4}}>Phone number: {user.phoneNumber}</Typography>
          <Typography variant='body1' sx={{py:0.4}}>Address: {user.streetAddress}</Typography>
          </Grid>
       
          <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:isNonMobile?'center':'left',justifyContent:isNonMobile?'center':'left',gap:isNonMobile?2:1}}>
         <Link to={`/Edit/User/${user._id}`}>
         <EditButton/>
         </Link>
          {/*<Button variant="outlined" onClick={() => setDeleteItemId(user._id)}>Delete</Button>*/}
          <DeleteButton onClick={() => setDeleteItemId(user._id)}/>
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
    </Box>
</>
    ):(
      <>
      <Box>
      <Typography variant='h1'>You are not permitted to view this page</Typography>
      </Box>

      </>
    )}
    
    </>
  );
};

export default Index;


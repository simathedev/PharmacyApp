import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Card, Box,useMediaQuery, Typography, Button, useTheme,  CircularProgress, Select, MenuItem,FormControl } from '@mui/material';
import EditButton from "components/buttons/EditButton";
import DeleteButton from "components/buttons/DeleteButton";
import AddButton from "components/buttons/AddButton";
import BackButton from "components/buttons/BackButton";
import OrderProducts from "components/OrderProducts";
import { Link } from 'react-router-dom';
import DeleteItem from "components/DeleteItem";
import Navbar from "components/navbar";
import NotPermitted from "components/NotPermitted";
import SearchWidget from "components/widgets/Search";
import OrderFilter from "components/OrderFilter";


const ManageOrdersPage = () => {
  const token = useSelector((state) => state.auth.token);
  const selectedPharmacy=useSelector((state)=>state.auth.pharmacy);
  const role= useSelector((state) => state.auth.role);
  const [searchQuery, setSearchQuery] = useState('');
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [orders, setOrders] = useState([]);
  const [sortBy, setSortBy] = useState('dateAsc');
 // const [sortedOrders, setSortedOrders] = useState([]);
  const [deleteItemId,setDeleteItemId]=useState(null)
  const [loading, setLoading] = useState(true);
  const isPermitted=role==='pharmacist'||role==='admin';
  const [showFilters, setShowFilters] = useState(false);
  const isLargeScreen= useMediaQuery("(min-width:900px)");
    const isMediumScreen = useMediaQuery("(min-width:500px) and (max-width:800px)");
  
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    const primary=theme.palette.primary.main;
  

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let apiUrl;
      let pharmacyId;
      pharmacyId = selectedPharmacy._id;
      console.log("pharmacy id: ",pharmacyId);
      if(selectedPharmacy&&role==='pharmacist'){
        apiUrl=`http://localhost:3001/order/getOrders/${pharmacyId}`
      }
      else if(role==='admin')
      {
        apiUrl="http://localhost:3001/order/getOrders";
      }
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const ordersData = await response.json();
        console.log("orders data:",ordersData);
        setOrders(ordersData);
      } else {
        console.log("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    finally {
      setLoading(false); // Set loading to false when data fetching is completed
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleDelete = async () => {
    if (deleteItemId) {
        const id=deleteItemId
        
        const response = await fetch(`http://localhost:3001/order/deleteOrder/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    
        if (response.ok) {
        setDeleteItemId(null);
        fetchOrders();
        } else {
            // Handle error case
            console.log("Error deleting item:", response.statusText);
        }
    }
      console.log(deleteItemId);
     
    }
    const searchOrders = orders.filter(order => {
      const searchQueryLower = searchQuery.toLowerCase();
      const fullName = `${order.user.firstName} ${order.user.lastName}`.toLowerCase();
      return (
        fullName.includes(searchQueryLower) ||
        order.userPhoneNumber.includes(searchQuery)||
        order._id.includes(searchQuery)
      );
    });
    //please make changes to this apply filter:
    const applyFilter = (filter) => {
      //let filteredOrders = orders; // Use 'orders' instead of 'medications'
    let filteredOrders=searchOrders;

      if (filter.deliveryType && filter.deliveryType !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.deliveryType === filter.deliveryType);
      }
    
      if (filter.orderStatuses && filter.orderStatuses.length > 0) {
        filteredOrders = filteredOrders.filter(order => filter.orderStatuses.includes(order.orderStatus));
      }
    
      // Update the orders after applying filter
      setOrders(filteredOrders);
    };

    const sortedOrders = searchOrders.slice().sort((a, b) => {
      switch (sortBy) {
        case 'dateAsc': 
          return a.createdAt.localeCompare(b.createdAt);
        case 'dateDesc':
          return b.createdAt.localeCompare(a.createdAt);
        default:
          return 0;
      }
    });

    const handleClearFilter = async () => {

      try {
        await fetchOrders(); 
        searchOrders();
      } catch (error) {
        console.error("Error refetching orders:", error);
      }
    };
  


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
      <Typography variant={isNonMobile?'h1':'h2'} sx={{mt:5}}>Manage Orders</Typography>
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
      <Link to={'/Add/Order'}>
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
 <OrderFilter handleFilter={applyFilter} handleClearFilter={handleClearFilter}/>
</Card>
)}

  </Box>
      
      {orders.length === 0 && (
          <Typography variant="h4">No Orders found...</Typography>
        )}
        
      {sortedOrders?.map((orders) => (
        <Card key={orders._id} sx={{backgroundColor:alt,my:2,px:isNonMobile?4:5,py:5,textAlign:'left'}}>
          <Grid container spacing={2}>
            
          <Grid item xs={12} sm={6}>
            <Typography variant={isNonMobile?'h3':'h5'} fontWeight='500' color='primary' sx={{py:2}}>Order ID: {orders._id}</Typography>
            <Typography variant={isNonMobile?'h3':'h4'} sx={{pb:0.4}}>{orders.user?.firstName+" "+orders.user?.lastName}</Typography>
            <Typography variant='body1'  sx={{py:0.4}}>Address: {orders.userAddress}</Typography>
            <Typography variant='body1'  sx={{py:0.4}}>Contact Number: {orders.userPhoneNumber}</Typography>
          <Typography variant='body1' sx={{py:0.4}}>Delivery Type: {orders.deliveryType}</Typography>
          <Typography variant='body1'  sx={{py:0.4}}>Status: {orders.orderStatus}</Typography>
          <Typography variant='body1'  sx={{py:0.4}}>Order Date: {orders.createdAt}</Typography>
          <OrderProducts medications={orders.medications}/>
          </Grid>
       
          <Grid item xs={12} sm={6} sx={{display:'flex', alignItems:isNonMobile?'center':'left',justifyContent:isNonMobile?'center':'left',gap:2}}>
         <Link to={`/Edit/Order/${orders._id}`}>
         <EditButton/>
         </Link>
          <DeleteButton onClick={() => setDeleteItemId(orders._id)}/>
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

export default ManageOrdersPage;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Card, Box,useMediaQuery, Typography, Button, CircularProgress, useTheme } from '@mui/material';
import EditButton from "components/buttons/EditButton";
import DeleteButton from "components/buttons/DeleteButton";
import DeleteItem from "components/DeleteItem";
import AddButton from "components/buttons/AddButton";
import BackButton from "components/buttons/BackButton";
import OrderProducts from "components/OrderProducts";
import { Link } from 'react-router-dom';
import Navbar from "components/navbar";
import AvailableMedication from "components/AvailableMedication";
import Loading from "components/Loading";
import NoDataFound from "components/widgets/NoDataFound";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


const Index = () => {
    const {pageType,id}=useParams();
    console.log('page type: ',pageType);
    console.log ('id: ',id);
    const token = useSelector((state) => state.auth.token);
    const role= useSelector((state) => state.auth.role);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteItemId,setDeleteItemId]=useState(null)
    const [responseData,setResponseData]=useState([]);
    const navigate = useNavigate();

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

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLargeScreen= useMediaQuery("(min-width:900px)");
  const isMediumScreen = useMediaQuery("(min-width:500px) and (max-width:800px)");
  
  const getAddLink = (pageType) => {
    //console.log('pageType in add link: ',pageType)
    switch (pageType) {
      case 'order':
        return '/Add/Order';
      case 'prescription':
        return '/Add/Prescription';
      case 'medication':
        return '/Add/Medication';
      case 'pharmacy':
        return '/Add/Pharmacy';
      case 'pharmacist':
        return '/Add/Pharmacist';
      case 'user':
        return '/Add/User';
      default:
        console.error(`Invalid pageType: ${pageType}`);
        return null; 
        // or return a default link if needed
    }
  };

  const getBackLink = (pageType) => {
   // console.log('pageType in add link: ',pageType)
    switch (pageType) {
      case 'order':
        return '/Manage/Orders';
      case 'prescription':
        return '/Manage/Prescriptions';
      case 'medication':
        return '/Manage/Medications';
      case 'pharmacy':
        return '/Admin/Pharmacies';
      case 'pharmacist':
        return '/Admin/Pharmacists';
      case 'user':
        return '/Manage/Users';
      default:
        console.error(`Invalid pageType: ${pageType}`);
        return null; 
        // or return a default link if needed
    }
  };
  
  // Then use this function to get the addLink value
  const addLink = getAddLink(pageType);
  const backLink = getBackLink(pageType);

  const fetchData = async () => {
    try {
      let endpoint;
      switch (pageType) {
        case 'order':
          endpoint = `order/getOrder/${id}`;
          break;
        case 'prescription':
          endpoint = `prescription/getPrescription/${id}`;
          break;
        case 'medication':
          endpoint = `medication/getMedication/${id}`;
          break;
        case 'pharmacy':
          endpoint = `pharmacy/getPharmacy/${id}`;
          break;
        case 'pharmacist':
          endpoint = `pharmacist/getPharmacist/${id}`;
          break;
        case 'user':
            endpoint = `user/getUser/${id}`;
            break;
        default:
          console.error(`Invalid pageType: ${pageType}`);
          
          return;
      }
      
      const response = await fetch(`${apiUrlSegment}/${endpoint}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("data in view details page:", data);
        setResponseData(data);
      } else {
        console.log(`Failed to fetch ${pageType}`);
      }
    } catch (error) {
      console.error(`Error fetching ${pageType}:`, error);
    }
  };

  useEffect(() => {
    fetchData();

  }, [token, pageType, id]);

  const handleDelete = async () => {
    if (deleteItemId) {
        const id=deleteItemId
        let endpoint;
        switch (pageType) {
          case 'order':
            endpoint = `order/deleteOrder/${id}`;
            break;
          case 'prescription':
            endpoint = `prescription/deletePrescription/${id}`;
            break;
          case 'medication':
            endpoint = `medication/deleteMedication/${id}`;
            break;
          case 'pharmacy':
            endpoint = `pharmacy/deletePharmacy/${id}`;
            break;
          case 'pharmacist':
            endpoint = `pharmacist/deletePharmacist/${id}`;
            break;
          case 'user':
              endpoint = `user/deleteUser/${id}`;
              break;
          default:
            console.error(`Invalid pageType: ${pageType}`);
            
            return;
        }
        const response = await fetch(`${apiUrlSegment}/${endpoint}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    
        if (response.ok) {
        setDeleteItemId(null);
        toast.success('Item Deleted Successfully.', { 
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        navigate(backLink);

        } else {
            // Handle error case
            console.log("Error deleting item:", response.statusText);
            toast.error('Item Delete Unsuccessful.', { 
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
              });
        }
    }
      console.log(deleteItemId);
     
    }

  const updateOrderStatus = async (id, status) => {
    try {
      const orderStatusResponse = await fetch(`${apiUrlSegment}/order/updateOrder/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ orderStatus: status }),
      });
      const updatedOrder = await orderStatusResponse.json();

      if (updatedOrder) {
        if (status === 'order successful') {
          toast.success('Order Accepted.', { 
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        } else if (status === 'order cancelled') {
          toast.success('Order Cancelled.', { 
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        } else {
          console.log('Updated order response:', updatedOrder);
        }
        fetchData();
      } else {
        toast.error('Order Accept Request Unsuccessful', {
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
      console.error('Error updating order status:', error);
    }
  }

 const updateApprovedScript = async (id) => {
    try {
      const scriptApprovedResponse = await fetch(`${apiUrlSegment}/prescription/updatePrescription/${id}`, {
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
       fetchData();
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

  if(isLoading)
  {
return <Loading/>
  }

  
  return (
<Box sx={{minHeight:"100vh"}}>

<Box sx={{alignItems:'left',justifyContent:'left',display:'flex',px:isNonMobile?'3rem':'0.5rem'}}>
  <Link to={backLink} style={{textDecoration:'none'}}>
  <BackButton/>
  </Link>
</Box>
<Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
<Typography variant='h4'>Details Page:</Typography>
</Box>

<Box sx={{display:'flex', pl:2,flexDirection:isNonMobile?'row':'column', gap:1,alignItems:'left',justifyContent:'left',width:'30%',display:'flex',px:isNonMobile?'3rem':'0.5rem',py:1}}>
<Link to={addLink} style={{textDecoration:'none'}}>
<AddButton/>
</Link>


</Box>
  <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
  {pageType==='order'&&(
<>
<Card sx={{width:isNonMobile?'80%':'90%',p:4,borderRadius:6}}>
<Typography variant={isNonMobile?'h3':'h5'} sx={{py:1,color:primary,fontWeight:'bold'}}>
    Order:  ORD{responseData._id}
</Typography>

<Typography variant={isNonMobile?'h3':'h6'} sx={{color:primary}}>Customer Details</Typography>
<Box sx={{py:1}}>
<Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
   Customer Name: {responseData.user?.firstName+" "+responseData.user?.lastName}
</Typography>
<Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
   Delivery Type: {responseData.deliveryType}
</Typography>
<Typography variant='body1'sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
   {responseData.deliveryType==='delivery'&&' Address: '+responseData.userAddress}
</Typography>
<Typography variant='body1'sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
   Contact Number: {responseData.userPhoneNumber}
</Typography>
</Box>

<Typography variant={isNonMobile?'h3':'h6'} sx={{color:primary}}>Order Details</Typography>
<Box sx={{py:1}}>
<Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
    Order Date: {responseData.createdAt}
</Typography>
<Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
  Order Status: {responseData.orderStatus}
</Typography> 

</Box>



{isNonMobile?(
    <Box sx={{width:'70%'}}>
     <AvailableMedication medications={responseData.medications}/>
     </Box>

):(
    <Box>
        <Typography variant='body1' color='primary'>Can't Display Table On Small Screens</Typography>
    </Box>
)}
{responseData.orderStatus==='pending'&&(
    <>
    <Box sx={{display:'flex', alignItems:'center',gap:1,my:3, borderRadius:6,p:3,backgroundColor:primary,width:isNonMobile?'50%':'94%'}}>
    <Typography variant='body1' sx={{color:alt}}>This Order Has Not Been Accepted Yet.</Typography>
    <Button  variant='contained' sx={{color:alt}} onClick={() => updateOrderStatus(responseData._id, 'order successful')}>Accept</Button>
    <Button  variant='contained' sx={{color:alt}} onClick={() => updateOrderStatus(responseData._id, 'order cancelled')}>Decline</Button>
         
    </Box>
        
    </>
)}

<Box sx={{display:'flex',gap:1,my:1}}>
<Link to={`/edit/order/${responseData._id}`} style={{textDecoration:'none'}}>
<EditButton/>
</Link>
<DeleteButton onClick={() => setDeleteItemId(responseData._id)}/>
</Box>

</Card>

</>
  )}
    {pageType==='prescription'&&(

<>

<Card sx={{width:isNonMobile?'80%':'90%',p:4,borderRadius:6}}>
<Typography variant={isNonMobile?'h3':'h5'} sx={{color:primary,fontWeight:'bold',py:1}}>
    Script:  SCR{responseData?._id}
</Typography>

<Typography variant={isNonMobile?'h3':'h6'} sx={{color:primary}}>Customer Details</Typography>
<Box sx={{py:1}}>
<Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
   Customer Name: {responseData?.user?.firstName+" "+responseData?.user?.lastName}
</Typography>
<Typography variant='body1'sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
   Contact Number: {responseData?.user?.phoneNumber}
</Typography>
</Box>
<Typography variant={isNonMobile?'h3':'h6'} sx={{color:primary}}>Script Details</Typography>
<Box sx={{py:1}}>
<Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
Doctor: {responseData?.doctor}
</Typography>
<Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
    Start Date: {responseData?.startDate}
</Typography>
<Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
Approved: {responseData.approved?'Yes':'No'}
</Typography> 
{role==='admin'&&(
    <Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
Pharmacy: {responseData?.pharmacy?.name}
</Typography> 
)}


</Box>



{isNonMobile?(
    <Box sx={{width:'70%'}}>
     <AvailableMedication medications={responseData.medications}/>
     </Box>

):(
    <Box>
        <Typography variant='body1' color='primary'>Can't Display Table On Small Screens</Typography>
    </Box>
)}
{!responseData.approved&&(
    <>
    <Box sx={{display:'flex', alignItems:'center',gap:1,my:3, borderRadius:6,p:3,backgroundColor:primary,width:isNonMobile?'50%':'90%'}}>
    <Typography variant='body1' sx={{color:alt}}>This Script Is Not Approved Yet.</Typography>
    <Button variant='contained' sx={{color:alt}} onClick={() => updateApprovedScript(responseData._id)} >Approve</Button>
    </Box>
        
    </>
)}

<Box sx={{display:'flex',gap:1,my:1}}>
<Link to={`/edit/prescription/${responseData._id}`} style={{textDecoration:'none'}}>
<EditButton/>
</Link>
<DeleteButton onClick={() => setDeleteItemId(responseData._id)}/>
  </Box>
</Card>

</>
  )}
   {pageType==='medication'&&(
    <>

<Card sx={{width:isNonMobile?'80%':'90%',p:4,borderRadius:6}}>
<Typography variant={isNonMobile?'h3':'h5'} sx={{color:primary,fontWeight:'bold',py:1}}>
   Medicaton: {responseData?.name}
</Typography>

<Typography variant={isNonMobile?'h3':'h6'} sx={{color:primary}}>Medication Details</Typography>
<Box sx={{py:1}}>
<Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
   Quantity: {responseData?.quantity}
</Typography>
<Typography variant='body1'sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
   Category: {responseData?.category}
</Typography>

<Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
In Stock: {responseData.inStock?'Yes':'No'}
</Typography>
{role==='admin'&&(
    <Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
Pharmacy: {responseData?.pharmacy?.name}
</Typography> 
)}
</Box>

<Box sx={{display:'flex',gap:1,my:1}}>
<Link to={`/edit/medication/${responseData._id}`} style={{textDecoration:'none'}}>
<EditButton/>
</Link>
<DeleteButton onClick={() => setDeleteItemId(responseData._id)}/>
  </Box>

</Card>

</>
  )}

  {pageType==='user'&&(
  <>
  <Card sx={{width:isNonMobile?'80%':'90%',p:4,borderRadius:6}}>
  <Typography variant={isNonMobile?'h3':'h5'} sx={{color:primary,fontWeight:'bold',py:1}}>
    Name: {responseData?.firstName + " "+ responseData.lastName}
  </Typography>
  
  <Typography variant={isNonMobile?'h3':'h6'} sx={{color:primary}}>User Details</Typography>
  <Box sx={{py:1}}>
  <Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
     Email Address: {responseData?.email}
  </Typography>
  <Typography variant='body1'sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
     ID Number: {responseData?.IDNumber}
  </Typography>
  
  <Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
 Contact Number: {responseData.phoneNumber}
  </Typography>
      <Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
  Street Address: {responseData?.streetAddress}
  </Typography> 
  <Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
 Active: {responseData.active?'Yes':'No'}
  </Typography> 

  </Box>
  <Box sx={{display:'flex',gap:1,my:1}}>
  <Link to={`/edit/user/${responseData._id}`} style={{textDecoration:'none'}}>
<EditButton/>
</Link>
<DeleteButton onClick={() => setDeleteItemId(responseData._id)}/>
 
  </Box>
  </Card>
  
  </>
  )}

  {pageType==='pharmacy'&&(
 <>
 <Card sx={{width:isNonMobile?'80%':'90%',p:4,borderRadius:6}}>
 <Typography variant={isNonMobile?'h3':'h5'} sx={{color:primary,fontWeight:'bold',py:1}}>
   Pharmacy: {responseData?.name}
 </Typography>
 
 <Typography variant={isNonMobile?'h3':'h6'} sx={{color:primary}}>Pharmacy Details</Typography>
 <Box sx={{py:1}}>
 <Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
    Email Address: {responseData?.email}
 </Typography>
 <Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
Contact Number: {responseData.phoneNumber}
 </Typography>
     <Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
 Street Address: {responseData?.streetAddress}
 </Typography> 
 <Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
Operating times: {responseData.openTime+"-"+responseData.closeTime}
 </Typography> 

 </Box>
 
<Box sx={{display:'flex',gap:1,my:1}}>
<Link to={`/edit/pharmacy/${responseData._id}`} style={{textDecoration:'none'}}>
<EditButton/>
</Link>
<DeleteButton onClick={() => setDeleteItemId(responseData._id)}/>
 
  </Box>
 </Card>
 
 </>
  )}

  {pageType==='pharmacist'&&(
 <>
 <Card sx={{width:isNonMobile?'80%':'90%',p:4,borderRadius:6}}>
 <Typography variant={isNonMobile?'h3':'h5'} sx={{color:primary,fontWeight:'bold',py:1}}>
   Pharmacist: {responseData?.firstName+" "+responseData?.lastName}
 </Typography>
 
 <Typography variant={isNonMobile?'h3':'h6'} sx={{color:primary}}>Pharmacist Details</Typography>
 <Box sx={{py:1}}>
 <Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
    Email Address: {responseData?.email}
 </Typography>
 
     <Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
 Practice Number: {responseData?.practiceNumber}
 </Typography> 
 <Typography variant='body1' sx={{fontSize: isNonMobile?'1rem':'0.8rem'}}>
Pharmacy: {responseData?.pharmacy?.name}
 </Typography> 

 </Box>
<Box sx={{display:'flex',gap:1,my:1}}>
<Link to={`/edit/pharmacist/${responseData._id}`} style={{textDecoration:'none'}}>
<EditButton/>
</Link>
<DeleteButton onClick={() => setDeleteItemId(responseData._id)}/>
 
  </Box>
 </Card>
 
 </>
  )}
    <DeleteItem
        open={Boolean(deleteItemId)}
        onClose={() => setDeleteItemId(null)}
        onDelete={() => handleDelete(deleteItemId)}
        deleteItemId={deleteItemId}
    />
</Box>
  </Box>
  )
}

export default Index
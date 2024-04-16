import React, {useState, useEffect} from 'react'
import { Grid, Card, Container, Box,useMediaQuery, Typography, Button, useTheme, IconButton } from '@mui/material';
import Navbar from 'components/navbar';
import {useDispatch, useSelector } from 'react-redux';
import { FaPlus,FaMinus,FaTrashAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import BackButton from "components/buttons/BackButton";
import{increaseQuantity,decreaseQuantity,removeItem,clearCart} from 'cartState';
import CardWidget from 'components/widgets/Card';
import { MdLocalPharmacy } from "react-icons/md";
import { FaTruck } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";
import EditButton from 'components/buttons/EditButton';
import EditIcon from '@mui/icons-material/Edit';
import Form from './form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FcHome } from "react-icons/fc";
import { FcShop } from "react-icons/fc";
import { FcPhone } from "react-icons/fc";
import CloseIcon from '@mui/icons-material/Close';

const Index = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const token = useSelector((state) => state.auth.token);
  const items = useSelector((state) => state.cart.items);
  const count = useSelector((state) => state.cart.count);
  const total = useSelector((state) => (state.cart.total).toFixed(2));
  const user=useSelector((state)=>state.auth.user);
  const selectedPharmacy=useSelector((state)=>state.auth.pharmacy);
  const userID=user._id;
 
  const userNumber=user.phoneNumber;
  const userHomeAddress=user.streetAddress;
  console.log("USER:",user);
  console.log("Pharmacy:",selectedPharmacy);
  const [loading, setLoading] = useState(true);
  console.log("items from state in checkout page:",items);
  //console.log("total from state:",total)
  //console.log("count from state:",count)
  console.log("",)


  const increaseItemQuantity = (item) => {
    dispatch(increaseQuantity(item));
   };
   const decreaseItemQuantity = (item) => {
    dispatch(decreaseQuantity(item));
   };
   const removeMedicationItem = (item) => {
    dispatch(removeItem(item));
   };
   const clearItemsCart = () => {
    dispatch(clearCart());
   };


   const [deliveryType, setDeliveryType] = useState(null);
   const [addressDetails, setAddressDetails] = useState(false);
   const [pharmacyDetails, setPharmacyDetails] = useState(false);
   const [cardDetails, setCardDetails] = useState(false);
   const initialEditingState={
    address: false,
    pharmacy: false,
    card: false,
   }
   const [editing, setEditing] = useState(initialEditingState);
   const[formValues,setFormValues]=useState([]);
   const[addressStep,setAddressStep]=useState(1);
   const[userDetails,setUserDetails]=useState([]);
   const [editingSection, setEditingSection] = useState(null);
   const navigate = useNavigate();


   const handleDeliveryOption = (type) => {
    setEditing(initialEditingState);
     setDeliveryType(type);
     setEditingSection(null);
     setAddressStep(2);
   };
   const handleStep = (step) => {
    setAddressStep(step);

  };
  const handleStepData = (step) => {
    setAddressStep(step);

    
const stepValues={
  user:userID,
  medications: items.map(item => ({ medication: item.id, quantity: item.quantity })),
  userAddress: userHomeAddress,
  deliveryType: deliveryType,
  pharmacy:selectedPharmacy,
 userPhoneNumber: userNumber,
}
    setFormValues(stepValues);
   console.log("form values:",stepValues);
   
  };

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3001/user/getUser/${userID}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const userData = await response.json();
          console.log("userData in checkout page:",userData)
          setUserDetails(userData)
        
        } else {
          console.log('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
 
    fetchUser();
   
  }, [token]);

  const handleEditClick = (section) => {
    if (section === editingSection) {
      
      setEditingSection(null);
      //setEditing(false);
      setEditing((prevEditing) => ({
        ...prevEditing,
        [section]: !prevEditing[section],
      }));
    } else {
      
      setEditingSection(section);
      //setEditing(true);
      setEditing((prevEditing) => ({
        ...prevEditing,
        [section]: true,
      }));
      if(section==='pharmacy')
      {
        //setEditing(!editing);
        setPharmacyDetails(true);
        setAddressDetails(false);
        setCardDetails(false);
      }
      
      else if(section==='address'){
        //setEditing(!editing);
        setAddressDetails(true);
        setPharmacyDetails(false);
        setCardDetails(false);
      }
      else if(section==='card'){
       // setEditing(!editing);
        setAddressDetails(false);
        setPharmacyDetails(false);
        setCardDetails(true);
      }
    }
 
   
  };
  let values;

  const handleSubmit = async (values) => {
    try {
      let updatedValues;
      

     if(values.streetAddress){
      const concatenatedAddress = `${values.streetAddress},${values.suburb},${values.city},${values.province},${values.postalCode}`;
      updatedValues = {
        ...values,
        user:userID,
        userPhoneNumber:userNumber,
        userAddress: concatenatedAddress,
        deliveryType: deliveryType,
      };
      setFormValues(updatedValues);
      //userDetails.streetAddress=concatenatedAddress
    //  const updatedUserDetails = [...userDetails]; // Create a copy of the array
//if (updatedUserDetails.length > 0) {
  //updatedUserDetails[0] = {
   // ...updatedUserDetails[0], // Copy the existing object
   // streetAddress: concatenatedAddress, // Update the streetAddress property
  //};
  //setUserDetails(updatedUserDetails); // Update the state with the new array
//}
     }
     else
     {
      updatedValues = {
        ...values,
        user:userID,
        userPhoneNumber:userNumber,
        userAddress:userHomeAddress,
        deliveryType: deliveryType,
        pharmacy:selectedPharmacy._id,
      };
      setFormValues(updatedValues);

     }
  

      //const values
      
        console.log('Submitting checkout details:', formValues);
      } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const order=async(formValues)=>{
    try {
    const orderResponse=await fetch(
      `http://localhost:3001/order/addOrder`,
      {
        method:"POST",
        headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
          },
        body:JSON.stringify(formValues),
      });
    if(orderResponse.ok){
      dispatch(clearCart());
        navigate("/user");
        toast.success('Order Successfully Created.', { 
          // Position of the notification
          autoClose: 5000, // Duration before the notification automatically closes (in milliseconds)
          hideProgressBar: true, // Whether to hide the progress bar
          closeOnClick: true, // Whether clicking the notification closes it
          pauseOnHover: true, // Whether hovering over the notification pauses the autoClose timer
          draggable: true, // Whether the notification can be dragged
          progress: undefined,
          theme:'colored', // Custom progress bar (can be a React element)
          // Other options for customizing the notification
        });
    }
    //if (goalData)
    else{
        console.log("failed to submit the order form");
        toast.error('Order Creation Unsuccessful', {
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

        // ...rest of the code
      } 
      catch (error) {
        console.error("Error in order function:", error);
        toast.error('Order Creation Unsuccessful', {
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
  
  }
  

  return (
    <Box sx={{minHeight:'100vh'}}>
    <Box sx={{width:'50%',display:'flex',justifyContent:'left',pl:2}}>
       <Link to={'/buy/medication'}>
           <BackButton />
         </Link>
       </Box> 
     <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center',my:2}}>
         
           <Typography variant='h3' sx={{my:3}}>1. Confirm Order Details</Typography>
           <Grid container spacing={2} sx={{mx:4,width:isNonMobile?'50%':'90%'}}>
 
           <Grid item xs={12} sm={12} md={12} lg={12} >
              <Card sx={{ backgroundColor:alt, mx: 2, px: 4, py: 1, display:'flex', flexDirection:'column', gap:1, width:'90%',textAlign: 'left', borderRadius:6 }}>
              <Typography variant='body2' sx={{fontWeight:'Bold'}}>{count} Items: R{total}</Typography>
              <Box sx={{display:'flex', flexDirection:'row'}}>
           {items.map((item) => (
          <Box>
                 <img
                   width={isNonMobile?"50px":"60px"}
                   height={isNonMobile?"50px":"60px"}
                   alt="item"
                   style={{marginTop: "0.75rem",borderRadius:'10%', }}
                   src={`http://localhost:3001/assets/${item.picture}`}
                 />
          </Box>
           ))}
       
           </Box>
            </Card>
             </Grid>
         </Grid>
         {/*when the button is selected it should set delivery type and also */}
         <Typography variant='h3' sx={{my:3}}>2. Choose Delivery Option</Typography>
         <Box display="flex" width={isNonMobile?'50%':'90%'} alignItems='center' justifyContent='center' >
        
           <Button
           sx={{width:'40%',py:3,gap:1,
           '&.MuiButton-contained': {
            color: 'white',
          },
          }}
            variant={deliveryType === 'collection' ? 'contained' : 'outlined'}
          onClick={() => handleDeliveryOption('collection')}>  <MdLocalPharmacy />Collection</Button>
           
           <Button 
             sx={{width:'40%',py:3,gap:1,
             '&.MuiButton-contained': {
              color: 'white',
            },
            }}
            variant={deliveryType === 'delivery' ? 'contained' : 'outlined'}
           onClick={() => handleDeliveryOption('delivery')}><FaTruck/> Delivery</Button>
         </Box>
 
         <Typography variant='h3' sx={{my:3}}>3. Confirm Address Details</Typography>
         {addressStep>=2&&(
          
           <>
         <Box sx={{width:'90%',display:'flex',gap:2,flexDirection:'column',alignItems:'center',borderRadius:6,justifyContent:'center'}}>
          {
           deliveryType==='delivery'?
 (
  
 <Card sx={{ backgroundColor:alt,display: 'flex',width:isNonMobile?'50%':'80%', minHeight: '15vh', borderRadius:6, px: 4, py: 2, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', textAlign: 'left' }}>
        {/*<IoIosHome fontSize='1.5rem' />*/}
        <FcHome fontSize='2.4rem' />           
        <Typography variant="body1" fontWeight='bold' fontSize='1rem' color='primary'>Home Address Details:</Typography>
      </Box>
      <Box>
      
     
         {editing.address ? (
        <IconButton onClick={()=>handleEditClick('address')} color='primary'>
          <CloseIcon />
        </IconButton>
      ) : (
        <IconButton onClick={()=>handleEditClick('address')} color='primary'>
          <EditIcon />
        </IconButton>
      )}
          {/*<EditIcon onClick={() => handleEditClick('address')} color='primary'/>*/} 
         </Box>
       </Box>
       {(!editingSection||!addressDetails)&&(
        <>
         <Typography variant='h5' sx={{py:2}}>
 {userDetails?userHomeAddress:userDetails.streetAddress}
</Typography>
<Typography sx={{pb:2}}>
<FcPhone />
{userDetails?userNumber:userDetails.phoneNumber}
   </Typography>
<Button variant='outlined' onClick={()=>handleStepData(3)}>
     Confirm
    </Button>
        
        </>

       )}
      
            {(editingSection&&addressDetails) && (
         <Form section={editingSection} values={values} onSubmit={handleSubmit} />
       )}
     </Card>
 )
           :
           (
             <Card sx={{backgroundColor:alt,display:'flex', width:isNonMobile?'50%':'90%',minHeight:'15vh', px: 4, py: 2, borderRadius:6, gap:2,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: '100%' }}>
         <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', textAlign: 'left' }}>
         
         {/*<MdLocalPharmacy  fontSize='1.5rem' />*/}
         <FcShop fontSize="2.4rem" />
          <Typography variant="body1" fontWeight="bold" fontSize='1rem' color="primary">Pharmacy Details:</Typography>
         </Box>
         <Box>
         {editing.pharmacy ? (
        <IconButton onClick={()=>handleEditClick('pharmacy')} color='primary'>
          <CloseIcon />
        </IconButton>
      ) : (
        <IconButton onClick={()=>handleEditClick('pharmacy')} color='primary'>
          <EditIcon />
        </IconButton>
      )}
          {/*
                    <EditIcon onClick={() => handleEditClick('pharmacy')} color='primary' />

          */} 
         </Box>
       </Box>
       {(!editingSection||!pharmacyDetails)&&(
                <>
                <Box sx={{gap:1, py:2, textAlign:'center',justifyContent:'center'}}>
           
           <Typography variant='h5'>
              {selectedPharmacy.name}
              </Typography>
              <Typography variant='h5'>
              {selectedPharmacy.streetAddress}
              </Typography>
           </Box>
           <Typography>
           <FcPhone /> {userDetails?userNumber:userDetails.phoneNumber}
          </Typography>
           <Button variant='outlined' onClick={()=>handleStepData(3)}>
            Confirm
           </Button>
                </>
              )}
            
            {(editingSection&&pharmacyDetails) && (
         <Form section={editingSection} values={values} onSubmit={handleSubmit}/>
            )}
             </Card>
           )
          }
 
         
         </Box>
           </>
         )}

      <Typography variant='h3' sx={{my:3}}>4. Confirm Card Details</Typography>
         {addressStep>=3&&(
          <>
            <CardWidget handleStepData={handleStepData} values={values} editing={editing} cardDetails={cardDetails} editingSection={editingSection} handleEditClick={handleEditClick} handleSubmit={handleSubmit} />
          {  addressStep>=4&&(

          <Button variant='contained' sx={{my:2}} onClick={() => order(formValues)}>Create order</Button>
          )}
      </>
      )}
      </Box>
     </Box>
  )
}

export default Index
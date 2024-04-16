import React, {useState, useEffect} from 'react'
import { Grid, Card, Container, Box,useMediaQuery, Typography, Button, useTheme } from '@mui/material';
import Navbar from 'components/navbar';
import {useDispatch, useSelector } from 'react-redux';
import { FaPlus,FaMinus,FaTrashAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import BackButton from "components/buttons/BackButton";
import{increaseQuantity,decreaseQuantity,removeItem,clearCart} from 'cartState';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Index = () => {
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const token = useSelector((state) => state.auth.token);
  const items = useSelector((state) => state.cart.items);
  const count = useSelector((state) => state.cart.count);
  const total = useSelector((state) => (state.cart.total).toFixed(2));
  const navigate =useNavigate();
  const [loading, setLoading] = useState(true);
  console.log("items from state:",items)
  console.log("total from state:",total)
  console.log("count from state:",count)

  
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  const increaseItemQuantity = (item) => {
    dispatch(increaseQuantity(item));
   };
   const decreaseItemQuantity = (item) => {
    dispatch(decreaseQuantity(item));
   };
   const removeMedicationItem = (item) => {
    dispatch(removeItem(item));
   };
   const handleCheckout = (items) => {
    if (items.length>0){
      navigate('/checkout');
    }
    else{
      console.log("No items to checkout");
      toast.error("No items to checkout. Please add items.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
 navigate('/buy/medication');
    }    
  };

  return (
    <Box sx={{minHeight:'100vh'}}>
   <Box sx={{width:'100%',display:'flex',justifyContent:'left',pl:2}}>
      <Link to={'/buy/medication'}>
          <BackButton />
        </Link>
      </Box> 
    <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center',my:2}}>
        
          <Typography variant='h2' sx={{my:3}}>Cart</Typography>
          {items.length===0&&(
            <Typography variant='h4' color='primary' fontStyle='italic'>No items in cart.</Typography>
          )}
          <Grid container spacing={2} sx={{mx:4,width:isNonMobile?'60%':'90%'}}>
          {items.map((item) => (
            <Grid item xs={12} sm={12} md={12} lg={12} key={item.title}>
             <Card sx={{ backgroundColor:alt,mx: 2, px: 4, py: 3, display:'flex', gap:6, width:'90%',textAlign: 'left', borderRadius:6 }}>
                <img
                  width={isNonMobile?"100px":"60px"}
                  height={isNonMobile?"100px":"60px"}
                  alt="item"
                  style={{marginTop: "0.75rem",borderRadius:'10%', }}
                  src={`http://localhost:3001/assets/${item.picture}`}
                />
                {/* Display item details */}
                <Box sx={{display:'flex',flexDirection:'column'}}>
                <Typography variant="h4" sx={{fontWeight:'bold',fontSize:!isNonMobile&&'14px'}}>{item.title}</Typography>
                <Typography variant='h6'>R {item.price}</Typography>
                <Box sx={{display:'flex', gap:2,fontSize:!isNonMobile&&'10px'}}>
                <FaMinus onClick={() => decreaseItemQuantity(item)}/>
                  {/*<button onClick={() => increaseItemQuantity(item)}>increase</button>*/}
                <Typography variant='h5'>{item.quantity}</Typography>
                <FaPlus onClick={() => increaseItemQuantity(item)}/>
                {/*<button onClick={() => decreaseItemQuantity(item)}>decrease</button>*/}
                </Box>
                <FaTrashAlt onClick={() => removeMedicationItem(item)}/>
                </Box>
                
                </Card>
            </Grid>
          ))}
           {/* <Cart/> */}
           {/*  </Card> */}
         
        </Grid>
        {/*<Typography variant='h6'>Total Items: {count}</Typography>*/}
     <Typography variant='h4' sx={{mt:4,mb:2}}>Total: R{total}</Typography>
  {items.length>0&&(
     <Button onClick={()=>handleCheckout(items)}>Checkout</Button>
  )}
    </Box>
    </Box>
  )
}

export default Index
import React, {useState, useEffect} from 'react'
import { Grid, Card, Container, Box,useMediaQuery, Typography, Button, useTheme } from '@mui/material';
import Navbar from 'components/navbar';
import {useDispatch, useSelector } from 'react-redux';
import { FaPlus,FaMinus,FaTrashAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import BackButton from "components/buttons/BackButton";
import{increaseQuantity,decreaseQuantity,removeItem,clearCart} from 'cartState';
import CartNavbar from 'components/cartnavbar';

const Index = () => {
  const dispatch = useDispatch();

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
  const token = useSelector((state) => state.auth.token);
  const items = useSelector((state) => state.cart.items);
  const count = useSelector((state) => state.cart.count);
  const total = useSelector((state) => (state.cart.total).toFixed(2));
  const [loading, setLoading] = useState(true);
  console.log("items from state:",items)
  console.log("total from state:",total)
  console.log("count from state:",count)

  const increaseItemQuantity = (item) => {
    dispatch(increaseQuantity(item));
   };
   const decreaseItemQuantity = (item) => {
    dispatch(decreaseQuantity(item));
   };
   const removeMedicationItem = (item) => {
    dispatch(removeItem(item));
   };

  return (
    <Box sx={{minHeight:'100vh'}}>
    
   <Box sx={{width:'100%',display:'flex',justifyContent:'left',pl:2}}>
      <Link to={'/buy/medication'} style={{textDecoration:'none'}}>
          <BackButton />
        </Link>
      </Box> 
    <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center',my:2}}>
        
          <Typography variant='h2' sx={{my:3}}>Cart</Typography>
          <Grid container spacing={2} sx={{mx:4,width:isNonMobile?'60%':'90%'}}>
          {items.map((item) => (
            <Grid item xs={12} sm={12} md={12} lg={12} key={item.title}>
             <Card sx={{ backgroundColor:alt,mx: 2, px: 4, py: 3, display:'flex', gap:6, width:'90%',textAlign: 'left', borderRadius:6 }}>
                <img
                  width={isNonMobile?"100px":"60px"}
                  height={isNonMobile?"100px":"60px"}
                  alt="item"
                  style={{marginTop: "0.75rem",borderRadius:'10%', }}
                  src={`${apiUrlSegment}/assets/${item.picture}`}
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
  
     <Button>Checkout</Button>
    </Box>
    </Box>
  )
}

export default Index
import React from 'react'
import { Grid, Card, Container, Box,useMediaQuery, Typography, Button, useTheme } from '@mui/material';
import Navbar from 'components/navbar';
import {useDispatch, useSelector } from 'react-redux';
import { FaPlus,FaMinus,FaTrashAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import{increaseQuantity,decreaseQuantity,removeItem,clearCart} from 'cartState';

const Cart = () => {

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const items = useSelector((state) => state.cart.items);
  const count = useSelector((state) => state.cart.count);
  const total = useSelector((state) => state.cart.total);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLargeScreen= useMediaQuery("(min-width:900px)");
  const isMediumScreen = useMediaQuery("(min-width:500px) and (max-width:899px)");
  console.log("items from state:",items)
  console.log("total from state:",total)
  console.log("count from state:",count)

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


  return (
    <>
    <Box sx={{zIndex:998, backgroundColor:alt,width:isLargeScreen?'35%':isMediumScreen?'45%':'68%',display:'flex',flexDirection:'column', textAlign:'center',height:isNonMobile?'600px':'490px',background:alt,padding:'2px 4px',position:'absolute',right:2,display:'hidden',boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
          
          <Box sx={{display:'flex',flexDirection:'column',textAlign:'center',alignItems:'center',position:'relative'}}>
            <Box sx={{display:'flex', flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <Typography variant={isNonMobile?'h2':'h4'} sx={{my:2,alignItems:'center',textAlign:'center'}}>Cart</Typography>
            </Box>
            <Box sx={{
  height: '200px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px', // Width of the scrollbar
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent', // Track color
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main, // Scrollbar color
    borderRadius: '8px', // Scrollbar border radius
  },
}}>
  {items.length === 0 && (
    <Box sx={{ pl: 4, pt: 2 }}>
      <Typography variant='body1' color='primary' fontStyle='italic'>No items in cart</Typography>
    </Box>
  )}
  {items.map((item) => (
    <Box key={item.title} sx={{ px: 1, py: 2, gap: 3, display: 'flex', width: '100%', textAlign: 'left', borderRadius: 6, position: 'relative' }}>
      <img
        width={isNonMobile ? "100px" : "70px"}
        height={isNonMobile ? "100px" : "70px"}
        alt="item"
        style={{ marginTop: "0.75rem", borderRadius: '10%', }}
        src={`${apiUrlSegment}/assets/${item.picture}`}
      />
      {/* Display item details */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant={isNonMobile ? "h4" : "h6"} sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
        <Typography variant={isNonMobile ? "h6" : "h7"}>R {item.price}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FaMinus onClick={() => decreaseItemQuantity(item)} />
          <Typography variant='h5'>{item.quantity}</Typography>
          <FaPlus onClick={() => increaseItemQuantity(item)} />
        </Box>
        <FaTrashAlt onClick={() => removeMedicationItem(item)} />
      </Box>
    </Box>
  ))}
</Box>


                  {items.length>0&&(
                   <Box sx={{textAlign:'center'}}>
                     <Typography variant={isNonMobile?'h4':'h6'} sx={{mt:4,mb:2}}>Total: R{total.toLocaleString('en-ZA', {minimumFractionDigits: 2, maximumFractionDigits: 2,  minimumIntegerDigits: 1, }).replace(/\,/g, '##').replace(/##/g, '.')}</Typography>
                     <Box sx={{display:'flex',textAlign:'center',gap:1}}>
                    <Button variant='outlined' onClick={() => clearItemsCart()}>Clear Cart</Button>
                    <Link to='/cart' style={{textDecoration:'none'}}>
                    <Button variant='contained' sx={{color:alt}}>Checkout</Button>
                    </Link>
                    </Box>
                    </Box>
                  )}
      
      
      
    
          </Box>
    
    </Box>
     
       </>
  );
};
export default Cart;
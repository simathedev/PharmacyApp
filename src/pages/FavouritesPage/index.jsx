import React, {useState, useEffect} from 'react'
import { Grid, Card, Container, Box,useMediaQuery, Typography, Button, useTheme } from '@mui/material';
import Navbar from 'components/navbar';
import {useDispatch, useSelector } from 'react-redux';
import { FaPlus,FaMinus,FaTrashAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import BackButton from "components/buttons/BackButton";
import{increaseQuantity,decreaseQuantity,removeItem,clearCart} from 'cartState';
import { addToCart,addToFavorite,removeFavorite,clearFavorites } from "cartState";
import { useNavigate } from 'react-router-dom';
import AddToCartButton from 'components/buttons/AddToCartButton';
import CartNavbar from 'components/cartnavbar';

const Index = () => {
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const token = useSelector((state) => state.auth.token);
  const items = useSelector((state) => state.cart.items);
  const count = useSelector((state) => state.cart.count);
  const favorite = useSelector((state) => state.cart.favorite);
  const total = useSelector((state) => (state.cart.total).toFixed(2));
  let apiUrlSegment=process.env.NODE_ENV === 'production' ?
    `https://pharmacy-app-api.vercel.app`
    :
    `http://localhost:3001`
  
  const navigate =useNavigate();
  const [loading, setLoading] = useState(true);
 // console.log("items from state:",items)
 // console.log("total from state:",total)
  console.log("favourites from state:",favorite);

  const increaseItemQuantity = (item) => {
    dispatch(increaseQuantity(item));
   };
   const decreaseItemQuantity = (item) => {
    dispatch(decreaseQuantity(item));
   };
   const removeFavouritesItem = (item) => {
    dispatch(removeFavorite(item));
   };
   const handleCheckout = () => {
    navigate('/checkout');
  };
  const addItemToCart = ({ name, price, picture }) => {
    dispatch(addToCart({title:name,price:price,picture:picture}));
   };

  return (
    <Box sx={{minHeight:'100vh'}}>
      <CartNavbar/>
   <Box sx={{width:'100%',display:'flex',justifyContent:'left',pl:2}}>
      <Link to={'/buy/medication'}>
          <BackButton />
        </Link>
      </Box> 
    <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center',my:2}}>
        
          <Typography variant='h2' sx={{my:3}}>Favourites</Typography>
          {/*
          If pharmacy is not the same then the add to cart button
          should not work and the cart should be cleared.
          */}
          <Grid container spacing={2} sx={{mx:4,width:isNonMobile?'60%':'90%'}}>
          {favorite.map((item) => (
            <Grid item xs={12} sm={12} md={12} lg={12} key={item.title}>
             <Card sx={{ mx: 2, px: 4, py: 3, display:'flex', gap:6, width:'90%',textAlign: 'left', borderRadius:6 }}>
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
                <Box>
                <AddToCartButton
                onClick={() => addItemToCart({ name: item.title, price: item.price, picture: item.picture })}
                />
                </Box>
                <FaTrashAlt onClick={() => removeFavouritesItem(item)}/>
                </Box>
                </Card>            
                </Grid>
          ))}         
        </Grid>
    </Box>
    </Box>
  )
}

export default Index
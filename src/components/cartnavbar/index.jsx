import { useState,useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Card,
  Grid
} from "@mui/material";
import { FaCartShopping } from "react-icons/fa6";
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  DarkMode,
  LightMode,
  Menu,
  Close,
  CenterFocusStrong
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import FlexBetween from "../../components/FlexBetween";
import { setMode, setLogout } from "../../state/index";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Cart from "components/Cart";
import CartPopup from "components/widgets/CartPopup";


const CartNavbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [isCartVisible, setIsCartVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const count=useSelector((state)=>state.cart.count);
  console.log("count in cart navbar: ",count)
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;
  const toggleCartVisibility = () => {
    setIsCartVisible(prevState => !prevState);
  };

  return (
    <>
      <Box sx={{ position:'sticky',top:75,zIndex:998,display: 'flex', px:'2px', backgroundColor:primary, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end', textAlign: 'right' }}>
        <FlexBetween padding="0.5rem 10%"  justifyContent="flex-end" alignItems="center">
        {/*<IconButton >
          <Link to='/favourites' color='dark'>
          <FavoriteIcon variant='contained' color='dark'/>
          </Link>
          </IconButton>*/}
        <IconButton onClick={toggleCartVisibility}>
        <CartPopup count={count}/>
            <FaCartShopping />

          </IconButton>

        
        </FlexBetween>
        
      </Box>
    
      {isCartVisible && <Cart />}
     
    </>
  )
}

export default CartNavbar;

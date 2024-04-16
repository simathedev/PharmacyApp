import {useState} from "react";
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
    Card,Grid
  } from "@mui/material";
  import{
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
import { BiSolidCircleHalf } from "react-icons/bi";
import { FaPills } from "react-icons/fa";
  
  const Navbar=()=>{
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const isLargeScreen= useMediaQuery("(min-width:900px)");
    const isMediumScreen = useMediaQuery("(min-width:600px) and (max-width:800px)");
   
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const role = useSelector((state) => state.auth.role);
    const theme = useTheme();
    const {palette}=useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const primary=theme.palette.primary.main;
  const alt = theme.palette.background.alt;
 const primaryMain=theme.palette.primary.hovered;
  
    const handleNavigate = () => {
      switch (role) {
        case 'user':
          navigate('/User');
          break;
        case 'pharmacist':
          navigate('/Pharmacist');
          break;
        case 'admin':
          navigate('/Admin');
          break;
        default:
          navigate('/');
          break;
      }
    };

  function capitalizeFirstLetter(string) {
    if(string)
    {
      return string.charAt(0).toUpperCase() + string.slice(1);

    }
  }
  const fullName = `${capitalizeFirstLetter(user?.firstName)} ${capitalizeFirstLetter(user?.lastName)}`;
  const handleLogout = () => {
   // dispatch(setLogout());
    navigate("/");
  };
  const roleLinks = {
    user: [
      { path: '/view/account', label: 'My Profile' },
      { path: '/Buy/Medication', label: 'Medication' },
      { path: '/user/view/orders', label: 'Orders' },
      { path: '/user/view/prescriptions', label: 'Scripts' }
    ],
    admin: [
      { path: '/view/account', label: 'My Profile' },
      { path: '/Manage/Medications', label: 'Medication' },
      { path: '/Manage/Orders', label: 'Orders' },
      { path: '/Manage/Prescriptions', label: 'Scripts' }
    ],
    pharmacist: [
      { path: '/view/account', label: 'My Profile' },
      { path: '/Manage/Medications', label: 'Medication' },
      { path: '/Manage/Orders', label: 'Orders' },
      { path: '/Manage/Prescriptions', label: 'Scripts' }
    ]
  };
// Function to render links based on the user's role
const renderLinksBasedOnRole = () => {
  const links = roleLinks[role] || [];

  return links.map(({ path, label }) => (
    <Link key={path} to={path} style={{ textDecoration: 'none', px: '2',color:palette.primary.main }}>
      <Typography>{label}</Typography>
    </Link>
  ));
};

    return(
      <Box>
      <Box sx={{zIndex:9999}}>
      <FlexBetween padding="1rem 6%">
            <FlexBetween gap="1rem">
            <FaPills color='#00A3FF' fontSize={isLargeScreen?'2.3rem':'1.6rem'}/>
            <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="primary"
             onClick={handleNavigate}
            sx={{
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
            >
       PharmConnect
        </Typography>
        </FlexBetween> 
      
        {/*DESKTOP NAV*/}
        {isNonMobileScreens? (
         <FlexBetween gap="2rem">
       
      
       {renderLinksBasedOnRole()}
            <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Select>
          </FormControl>
 
        </FlexBetween>
        ):(
            <IconButton
            onClick={()=>setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
                <Menu/>
            </IconButton>
        )}   

        {/*MOBILE NAV*/}
        {!isNonMobileScreens && isMobileMenuToggled && (
            <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="500px"
            minWidth="300px"
            backgroundColor={background}

          >
            {/* CLOSE ICON */}
            <Box display="flex" justifyContent="flex-end" p="1rem">
              <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
              >
                <Close />
              </IconButton>
            </Box>
  

                {/*MENU ITEMS */}
                <FlexBetween
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                gap="3rem"
               
                >
                  
          <Link to={'/view/account'} style={{ color:primary,textDecoration: 'none',px:'2' }}>
          <Typography>My Profile</Typography>
        </Link>
        <Link to={'/Buy/Medication'} style={{ color:primary,textDecoration: 'none' }}>  
         <Typography>Medication</Typography> 
        </Link>
        <Link to={'/user/view/orders'} style={{ color:primary,textDecoration: 'none' }}>
          <Typography>Orders</Typography>
        </Link>
        <Link to={'/user/view/prescriptions'} style={{color:primary, textDecoration: 'none' }}>
         <Typography>Scripts</Typography>
        </Link>
                    <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton> 
           
                <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  textAlign:"center",
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl> 
                </FlexBetween>
            </Box>
        )}
        </FlexBetween>
      </Box>
        </Box>
    )
  }

  export default Navbar;
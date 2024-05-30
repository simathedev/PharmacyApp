import {Box,Typography,useTheme,useMediaQuery} from "@mui/material";
import Form from './form';
import { BiSolidCircleHalf } from "react-icons/bi";
import { FaPills } from "react-icons/fa";
import { Link } from "react-router-dom";
import BackButton from "components/buttons/BackButton";

const LoginPage=()=>{
    const theme=useTheme();
    const isNonMobileScreens= useMediaQuery("(min-width:600px)");
    const isLargeScreen= useMediaQuery("(min-width:900px)");
    const isMediumScreen = useMediaQuery("(min-width:600px) and (max-width:800px)");
   
    return<Box display='flex' flexDirection={isLargeScreen?"row":"column"} minHeight='100vh'>
        <Box width={isLargeScreen?"50%":"100%"}
        backgroundColor={theme.palette.background.alt} 
        p="1rem 6%" textAlign="center"
        display='flex' flexDirection={isLargeScreen?'column':'row'}
        alignItems='center' justifyContent='center'
        >
        <FaPills color='#00A3FF' style={{paddingRight:'0.5rem'}} fontSize={isLargeScreen?'3.2rem':'1.9rem'}/>
<Box  display='flex' flexDirection='column' alignItems='center'>
<Typography
        fontWeight="bold"
        fontSize="32px"
        color="primary"
        >
        PharmConnect
        </Typography>
        {
        isLargeScreen&&
        <Typography fontWeight="500" variant="h5" sx={{mb:"2rem" }}>
        Get Meds Conveniently.
        </Typography>
       }
</Box> 
     
    </Box>
    <Box
      width={isLargeScreen?"50%":"100%"}
      display='flex' flexDirection='column'
     alignItems='center' justifyContent='center'
    >
        <Box sx={{ml:3}}>
        <Link to='/home' style={{textDecoration:'none'}}>
        <BackButton/>
        </Link>
      </Box>
    <Box
    width={isLargeScreen ? "70%" : isMediumScreen ? "65%" : "85%"}
    p="2rem"
    m="2rem auto"
    borderRadius="1.5rem"
    backgroundColor={theme.palette.background.alt}
    >
        
        {
        !isLargeScreen&&
        <Typography fontWeight="500" variant="h5" sx={{mb:"1.5rem" }}>
        Get Meds Conveniently.
        </Typography>
       }
        <Form/> {/*create a form component and import it*/}
    </Box>
    </Box>
    </Box>
}
export default LoginPage;
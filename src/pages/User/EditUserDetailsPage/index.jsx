import {Box,Typography,useTheme,useMediaQuery} from "@mui/material";
import Form from './form';
import Navbar from "components/navbar";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import BackButton from "components/buttons/BackButton";


const EditUserDetailsPage=()=>{
    const theme=useTheme();
    const isNonMobileScreens= useMediaQuery("(min-width:600px)");
    const role= useSelector((state) => state.auth.role);
    return (
    <Box>
      <Box sx={{ml:3}}>
        <Link to='/view/account' >
        <BackButton/>
        </Link>
      </Box>  
    <Box
    width={isNonMobileScreens?"50%":"80%"}
    p="2rem"
    m="2rem auto"
    borderRadius="1.5rem"
    backgroundColor={theme.palette.background.alt}
    >
        <Form/>
    </Box>
    </Box>
    )
}
export default EditUserDetailsPage;
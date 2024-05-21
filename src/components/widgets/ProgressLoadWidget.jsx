import { Button,Typography,useTheme,Box } from "@mui/material";
import WidgetWrapper from "../WidgetWrapper";
import { useDispatch,useSelector } from "react-redux";
import {setBalance} from "../../state";
import {CurrencyExchange,Poll,Savings,QuestionMark} from '@mui/icons-material';
import { GiMedicinePills } from "react-icons/gi";


const ProgressLoadWidget=({name,text})=>{
const theme=useTheme();
const{palette}=useTheme();
const dark =palette.neutral.dark;
const primary=theme.palette.primary.main

return(
    <Box sx={{
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center",
            height:'200px',
            zIndex:99999,
            
            }}>
          <GiMedicinePills fontSize='3rem' style={{ color: palette.primary.main }}/>
          <Typography
            variant="h5"
            padding="1rem"
            color="primary"
            fontWeight="bold"
            zIndex="9999999"
            >
            {text} {name} ...
            </Typography> 
    </Box>
)
}
export default ProgressLoadWidget;
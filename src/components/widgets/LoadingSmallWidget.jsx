import { Button,Typography,useTheme,Box } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useDispatch,useSelector } from "react-redux";
import { GiMedicinePills } from "react-icons/gi";



const LoadingSmallWidget=({name,text,height})=>{
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
            height:height,
            }}>
                <Typography
             variant="h2"
             color={dark}
             fontWeight="500"
             sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
             >
                {name}
             </Typography>
            < GiMedicinePills style={{fontSize:'1rem'}}  color='primary'/>
          <Typography
            variant="h5"
            padding="1rem"
            color="primary"
            fontWeight="bold"
            >
          {text}
            </Typography> 
    </Box>
)
}
export default LoadingSmallWidget;
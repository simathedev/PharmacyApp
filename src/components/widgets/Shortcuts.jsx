import { useEffect,useState } from "react";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { CgPill } from "react-icons/cg";
import { MdLocalPharmacy } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { BiPackage } from "react-icons/bi";
import { FaNotesMedical } from "react-icons/fa";
import { Grid, Card, Box,useMediaQuery, Typography, Button, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';


const MobileShortcuts=()=>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;
    useEffect(()=>{
    },[]);
    
    return(
        <WidgetWrapper
        display="flex"
        flexDirection="row"
        alignItems="center"
        textAlign="center"
        position="sticky"
        bottom='0'
        zIndex='1000'
        >
            <Grid container spacing={1} justifyContent="center" alignItems="center">
  {(() => {
    const items = role === 'user' ? [
      { icon: <FaUser />, text: 'Profile', link: '/view/account' },
      { icon: <CgPill />, text: 'Shop', link: '/buy/medication' },
      { icon: <BiPackage />, text: 'Orders', link: '/user/view/orders' },
      { icon: <FaNotesMedical />, text: 'Scripts', link: '/user/view/prescriptions' }
    ] : [
      { icon: <FaUser />, text: 'Users', link: '/manage/users' },
      { icon: <CgPill />, text: 'Medication', link: '/manage/medications' },
      { icon: <BiPackage />, text: 'Orders', link: '/manage/orders' },
      { icon: <FaNotesMedical />, text: 'Scripts', link: '/manage/prescriptions' }
    ];

    return items.map((item, index) => (
      <Grid item key={index} xs={3}>
        <Link to={item.link} style={{ textDecoration: 'none' }}>
          <Card
            sx={{
              width: "100%", px: 2, borderRadius: '10px',
              height: "55px", mb: 1, display: 'flex',
              flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', textAlign: 'center',
              backgroundColor: alt,
              '&:hover': {
                backgroundColor: primary,
                color: alt,
              }
            }}
          >
            {item.icon}
            <Typography variant="subtitle1" mt={1} fontSize='10px'>
              {item.text}
            </Typography>
          </Card>
        </Link>
      </Grid>
    ));
  })()}
</Grid>
        </WidgetWrapper>
       
    )
}

export default MobileShortcuts;
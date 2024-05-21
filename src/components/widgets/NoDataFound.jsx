import React from 'react';
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
    Button,
    Grid
  } from "@mui/material";
import WidgetWrapper from 'components/WidgetWrapper';
import { GiMedicinePills } from "react-icons/gi";
import { CgPill } from "react-icons/cg";
import { MdLocalPharmacy } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUser , FaNotesMedical} from "react-icons/fa";
import { BiPackage } from "react-icons/bi";

const NoDataFound = ({ name, icon }) => {
    const { palette } = useTheme();
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    const primary=theme.palette.primary.main;

    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLargeScreen= useMediaQuery("(min-width:900px)");
    const isMediumScreen = useMediaQuery("(min-width:500px) and (max-width:800px)");
   

    let selectedIcon;

    // Determine which icon to render based on the 'icon' prop
    switch (icon) {
        case 'FaUser':
            selectedIcon = <FaUser fontSize={isNonMobile?'3rem':'2rem'} style={{ color: primary }} />;
            break;
            case 'FaNotesMedical':
                selectedIcon = <FaNotesMedical fontSize={isNonMobile?'3rem':'2rem'} style={{ color: primary }} />;
                break;
                case 'FaUserDoctor':
                    selectedIcon = <FaUserDoctor fontSize={isNonMobile?'3rem':'2rem'} style={{ color: primary }} />;
                    break;
                case 'BiPackage':
                    selectedIcon = <BiPackage fontSize={isNonMobile?'3rem':'2rem'} style={{ color: primary }} />;
                    break;
        case 'CgPill':
            selectedIcon = <CgPill fontSize={isNonMobile?'3rem':'2rem'} style={{ color: primary }} />;
            break;
        case 'MdLocalPharmacy':
            selectedIcon = <MdLocalPharmacy fontSize={isNonMobile?'3rem':'2rem'} style={{ color: primary }} />;
            break;
        // Add more cases for other icons as needed
        default:
            selectedIcon = null;
    }

    return (
        <>
            <Box sx={{ Width: '100%', mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {selectedIcon}
                <Typography variant={isNonMobile?'h1':'h4'} color='primary' sx={{ my: 2, fontWeight: 'bold' }}>No {name} Found</Typography>
                <Button  sx={{fontSize:!isNonMobile&&'0.6rem'}} >
                    Return to homepage
                </Button>
            </Box>
        </>
    );
};

export default NoDataFound;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { Grid, Card, Box,useMediaQuery,TextField, Typography,InputAdornment, Button, useTheme, FormControl, Select, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FlexBetween from "./FlexBetween";
import {setPharmacy} from 'state';
import{clearCart} from 'cartState';

const NearbyPharmacy = () => {
    const { palette } = useTheme();
    const token = useSelector((state) => state.auth.token);
    const [pharmacies, setPharmacies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const selectedPharmacy=useSelector((state)=>state.auth.pharmacy);
    const dispatch = useDispatch();
    const navigate=useNavigate();

    const handlePharmacyClick = (pharmacy) => {
        dispatch(setPharmacy({ pharmacy }));
    };
    useEffect(() => {
        const fetchPharmacies = async () => {
            try {
                const response = await fetch("http://localhost:3001/pharmacy/getPharmacies", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const pharmacyData = await response.json();
                    console.log("pharmacy data:", pharmacyData);
                    setPharmacies(pharmacyData);
                } else {
                    console.log("Failed to fetch pharmacies");
                }
            } catch (error) {
                console.error("Error fetching pharmacies:", error);
            }
        };

        fetchPharmacies();
    }, [token]);

    const filteredPharmacies = pharmacies.filter(pharmacy => {
        return pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Display only the first three pharmacies if search query is empty
    const displayedPharmacies = searchQuery ? filteredPharmacies : pharmacies.slice(0, 3);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    return (
        <Box width={isNonMobile?'60%':'80%'} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
           <Box width={isNonMobile?'60%':'100%'}>
           <Typography textAlign='left'  >
                Find Pharmacy
            </Typography>
            <TextField
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    sx: { borderRadius: 10 } 
                }}
                sx={{ mb: 4, width:'100%' }}
            />
           </Box>
           

            <Box sx={{ display: 'flex', gap: 2 }}>
                {displayedPharmacies.map((pharmacy) => (
                    <Card key={pharmacy._id} 
                    sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                     justifyContent: 'center', 
                     textAlign: 'center',
                      alignItems: 'center',
                       p: 2 ,
                       cursor: 'pointer',
                       backgroundColor: selectedPharmacy?._id == pharmacy._id ? palette.primary.hovered :palette.background.alt, // Conditionally set background color
                      color:selectedPharmacy?._id == pharmacy._id && palette.background.alt,
                       }}
                       onClick={() => handlePharmacyClick(pharmacy)} 
                       >
                        <img
                            width={isNonMobile?"80px":"45px"}
                            height={isNonMobile?"80px":"45px"}
                            alt="pharmacy"
                            style={{ marginTop: "0.75rem", marginBottom:"0.35rem",borderRadius: '10%' }}
                            src={`http://localhost:3001/assets/${pharmacy.picture}`}
                        />
                        <Typography variant="body1" fontWeight='bold' fontSize={!isNonMobile&&'10px'}>{pharmacy.name}</Typography>
                        <Typography variant="body1" fontSize={!isNonMobile&&'10px'}>{pharmacy.openTime}-{pharmacy.closeTime}</Typography>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default NearbyPharmacy;

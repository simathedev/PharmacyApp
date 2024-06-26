import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Card, Box, Typography, TextField, InputAdornment, Button, useTheme, FormControl, Select, MenuItem, useMediaQuery, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import AddToCartButton from "components/buttons/AddToCartButton";
import SearchIcon from '@mui/icons-material/Search';
import { addToCart, addToFavorite, removeFavorite } from "cartState";
import { useLocation } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NoProductsFound from "components/widgets/NoProductsFound";
import { FaFilter } from "react-icons/fa";
import Loading from "components/Loading";
import CartNavbar from "components/cartnavbar";
import FilterComponent from "components/Filter";
import BackButton from "components/buttons/BackButton";
import { toast } from "react-toastify";

const MedicationPage = () => {
    const token = useSelector((state) => state.auth.token);
    const selectedPharmacy = useSelector((state) => state.auth.pharmacy);
    const selectedFavorites = useSelector((state) => state.cart.favorite);
    const dispatch = useDispatch();
    const [medications, setMedications] = useState([]);
    const [filteredMedicationData, setFilteredMedicationData] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [sortedMedications, setSortedMedications] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('nameAsc');
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLargeScreen = useMediaQuery("(min-width:900px)");
    const isMediumScreen = useMediaQuery("(min-width:500px) and (max-width:800px)");

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    const primary=theme.palette.primary.main;

    let apiUrlSegment = process.env.NODE_ENV === 'production' ?
        `https://pharmacy-app-api.vercel.app`
        :
        `http://localhost:3001`

    useEffect(() => {
        setIsLoading(true);
        const fetchMedications = async () => {
            try {
                let apiUrl;
                let pharmacyId = selectedPharmacy ? selectedPharmacy._id : null;
                if (selectedPharmacy) {
                    apiUrl = `${apiUrlSegment}/medication/getMedications/${pharmacyId}`
                } else {
                    apiUrl = `${apiUrlSegment}/medication/getMedications`
                }
                const response = await fetch(
                    apiUrl, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                if (response.ok) {
                    const medicationsData = await response.json();
                    let medicationsfilterData
                    if (category) {
                        medicationsfilterData = medicationsData.filter(medication => medication.category == category);
                        setMedications(medicationsfilterData);

                    } else {
                        setMedications(medicationsData);

                    }


                } else {
                    console.log("Failed to fetch medications");
                }
            } catch (error) {
                console.error("Error fetching medications:", error);
            } finally {
                setIsLoading(false); // Set isLoading to false when data fetching is completed
            }
        };

        fetchMedications();
    }, [token]);


    useEffect(() => {

        let searchMedications;
        let sortedMeds;
        searchMedications = medications.filter(medication => {
            return medication.name.toLowerCase().includes(searchQuery.toLowerCase());
        });

        // Sort medications based on selected criteria
        if (filteredMedicationData) {
            searchMedications = sortedMedications.filter(medication => {
                return medication.name.toLowerCase().includes(searchQuery.toLowerCase());
            });
            sortedMeds = sortedMedications.slice().sort((a, b) => {
                switch (sortBy) {
                    case 'priceHigh':
                        return b.price - a.price;
                    case 'priceLow':
                        return a.price - b.price;
                    case 'nameAsc':
                        return a.name.localeCompare(b.name);
                    case 'nameDesc':
                        return b.name.localeCompare(a.name);
                    default:
                        return 0;
                }
            });
        } else {

            sortedMeds = searchMedications.slice().sort((a, b) => {
                switch (sortBy) {
                    case 'priceHigh':
                        return b.price - a.price;
                    case 'priceLow':
                        return a.price - b.price;
                    case 'nameAsc':
                        return a.name.localeCompare(b.name);
                    case 'nameDesc':
                        return b.name.localeCompare(a.name);
                    default:
                        return 0;
                }
            });
        }

        // Update sortedMedications state
        setSortedMedications(sortedMeds);
    }, [medications, filteredMedicationData, searchQuery, sortBy]);

    const applyFilter = (filter) => {
        let filteredMeds = medications;

        if (filter.inStock) {
            filteredMeds = filteredMeds.filter(med => med.inStock);
        }
        if (filter.categories && filter.categories.length > 0) {
            filteredMeds = filteredMeds.filter(med => filter.categories.includes(med.category));
        }
        if (filter.priceRange && filter.priceRange.min && filter.priceRange.max) {
            filteredMeds = filteredMeds.filter(med => med.price >= filter.priceRange.min && med.price <= filter.priceRange.max);
        }

        // Update the sorted medications after applying filter

        // Set the filtered and sorted medications
        setSortedMedications(filteredMeds);
        setFilteredMedicationData(true);
    };


    const addItemToCart = ({ id, name, price, picture }) => {
        dispatch(addToCart({ id: id, title: name, price: price, picture: picture }));
        toast.success(`${name} added to cart`, {
            autoClose: 1000,
            position: "bottom-right",
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });
    };

    const toggleFavorite = (id, name, price, picture) => {
        if (selectedFavorites.some(favorite => favorite.title === name)) {
            // Medication is already in favorites, so remove it
            dispatch(removeFavorite({ title: name, price: price, picture: picture }));
        } else {
            // Medication is not in favorites, so add it
            dispatch(addToFavorite({ id: id, title: name, price: price, picture: picture }));
        }
    };

    const renderMedicationName = (name) => {
        const MAX_LENGTH = 20; // Maximum length of medication name before truncation
        if (name.length > MAX_LENGTH) {
            // Truncate name and include parentheses
            return `${name.substring(0, MAX_LENGTH - 3)}...`;
        }
        return name; // Return original name if it's within the maximum length
    };

    if (isLoading) {
        return <Loading />
    }

    return (
        <Box sx={{ minHeight: '100vh', position: 'relative' }}>
          <CartNavbar />

            <Box sx={{ textAlign: 'center', mt: 2, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'left', pl: 2 }}>
                    <Link to={'/User'} style={{textDecoration:'none'}}>
                        <BackButton />
                    </Link>
                </Box>

                <Typography variant={isNonMobile ? 'h1' : 'h2'}>Shop</Typography>

                {/* Search bar */}
                <Box sx={{ my: 4 }}>
                    <TextField
                        label="Search Medication"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 10 } // Customize input field style
                        }}
                        sx={{ mb: 2, width: isNonMobile ? "50%" : "70%" }}
                    />
                </Box>

                <Card sx={{ alignItems: 'center', my: 2, justifyContent: 'left', backgroundColor: alt, width: isNonMobile ? '30%' : '64%', height: !isNonMobile && '4rem', display: 'flex', px: isNonMobile ? '3rem' : '1rem', py: isNonMobile ? 0.8 : 1 }}>
                    {/* Sort by dropdown */}
                    <Typography variant={isNonMobile && 'h4'} sx={{ width: '40%', px: !isNonMobile && 0 }}>Sort By:</Typography>
                    <FormControl variant="outlined" sx={{ px: isNonMobile ? 2 : 0, width: "60%" }}>
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
                            <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
                            <MenuItem value="priceHigh">Price (High to Low)</MenuItem>
                            <MenuItem value="priceLow">Price (Low to High)</MenuItem>
                        </Select>
                    </FormControl>
                </Card>
                
                <Box sx={{ position: 'relative' }}>
    <Box sx={{ width: '40%', justifyContent: 'left', display: 'flex', flexDirection: 'column' }}>
        <Button
            sx={{
                width: isNonMobile ? '40%' : '70%',
                bgcolor: 'primary.main',
                position: 'relative',
                px: 2,
                py: 1,
                mx: '1rem',
                ml: '-0.8rem',
                color: 'white',
                '&:hover': {
                    bgcolor: 'primary.dark',
                },
            }}
            onClick={() => setShowFilters(prevState => !prevState)}
            variant="contained"
        >
            {isNonMobile ? 'Filter' : <FaFilter />}
        </Button>
    </Box>

    {showFilters && (
        <Card sx={{
            position: 'absolute',
            zIndex: 99,
            top:isNonMobile?40:32,
            left: 0,
            alignItems: 'left',
            justifyContent: 'left',
            backgroundColor: 'white',
            width: isLargeScreen ? '30%' : isMediumScreen ? '80%' : '72%',
            minHeight: !isNonMobile && '4rem',
            display: 'flex',
            flexDirection: 'column',
            px: isNonMobile ? '3rem' : '1rem',
            py: isNonMobile ? 0.8 : 1
        }}>
            <FilterComponent handleFilter={applyFilter} />
        </Card>
    )}
</Box>

                <Box sx={{ px: 2 }}>
                    {!sortedMedications.length > 0 && (
                        <NoProductsFound />
                    )}
                    <Grid container spacing={isNonMobile ? 2 : 1} sx={{ mx: -2, mt: !isNonMobile && 1 }}>
                        {sortedMedications.map((medication) => (
                            <Grid item xs={6} sm={4} md={3} lg={3} key={medication._id}>
                                <Card sx={{ backgroundColor: alt, minHeight: isNonMobile ? '19.5rem' : '16rem', maxHeight: isNonMobile ? '19.5rem' : '16rem', my: isNonMobile ? 2 : 1, mx: 1, px: 2, py: 3, textAlign: 'left', borderRadius: 6 }}>
                                    <Box>
                                        {selectedFavorites.some(favorite => favorite.title === medication.name) ? (
                                            <FavoriteIcon color="primary" onClick={() => toggleFavorite(medication._id, medication.name, medication.price, medication.picture)} />
                                        ) : (
                                            <FavoriteBorderIcon onClick={() => toggleFavorite(medication._id, medication.name, medication.price, medication.picture)} />
                                        )}
                                    </Box>
                                    <img
                                        width={isNonMobile ? "120px" : "60px"}
                                        height={isNonMobile ? "120px" : "60px"}
                                        alt="medication"
                                        style={{ marginTop: "0.75rem", borderRadius: '10%', }}
                                        src={`${apiUrlSegment}/assets/${medication.picture}`}
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Link to={`/medication/details/${medication._id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', color: 'inherit' }}>
                                            <Typography variant={isNonMobile ? "h5" : "h6"}>{renderMedicationName(medication.name)}</Typography>
                                            <Typography variant={isNonMobile ? 'h6' : "h7"}>R {medication.price}</Typography>
                                            <Typography variant={isNonMobile ? "h6" : "h7"}>{medication.inStock ? 'in stock' : 'out of stock'}</Typography>
                                        </Link>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'left', gap: 2, pt: 1 }}>
                                        {medication.inStock && <AddToCartButton onClick={() => addItemToCart({ id: medication._id, name: medication.name, price: medication.price, picture: medication.picture })} />}
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default MedicationPage;

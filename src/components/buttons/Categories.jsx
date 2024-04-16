import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, useTheme, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const Categories = () => {
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  
  const categories = [
    { name: 'Pain Relief', title: 'Pain Relief',link:'/buy/medication' },
    { name: 'Allergy', title: 'Allergy',link:'/buy/medication' },
    { name: 'Cold & Flu', title: 'Cold & Flu',link:'/buy/medication' },
    { name: 'Digestive Health', title: 'Digestive Health',link:'/buy/medication' },
    { name: 'Heart Health', title: 'Heart Health',link:'/buy/medication' },
    { name: 'Vitamins/Supplements', title: 'Vitamins/Supplements',link:'/buy/medication' },
    { name: 'Women Health', title: 'Women Health',link:'/buy/medication' },
    { name: 'Other', title: 'Other',link:'/buy/medication' }
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Typography variant={isNonMobile?'h3':'h4'} sx={{py:4}}>
       Shop Based On Categories
      </Typography>
      <Grid container spacing={1} justifyContent="center" alignItems="center" width={isNonMobile ? '70%' : '80%'}>
        {categories.map((category) => (
          <Grid item key={category.name}>
 <Link to={`${category.link}?category=${encodeURIComponent(category.title)}`} style={{ textDecoration: 'none' }}>            
 <Grid item
              sx={{
                //border: `1px solid ${palette.primary.main}`,
                backgroundColor: `${palette.primary.main}`,
                borderRadius: { xs: 4, md: 8 },
                padding: { xs: 1.2, md: 2.6 },
                m: { xs: 0.2, md: 1 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                height: 'auto',//{ xs: '105px', md: '150px' },
                width: { xs: '7rem', sm:'10rem',md: '13rem' },
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor:palette.primary.hovered,
               
                },
              }}
            >
              <Typography variant='body1' sx={{color:palette.background.alt,
             
                 fontWeight:'500', fontSize: { md: 15, sm: 12, xs: 9 } }}>
                  {category.name}
                  </Typography>
            </Grid>
            </Link>           
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Categories;


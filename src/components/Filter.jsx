import React, { useState } from "react";
import { Box, Typography, FormControl, Select, MenuItem, TextField, Button, Checkbox, FormGroup, FormControlLabel, Slider } from '@mui/material';

const FilterComponent = ({ handleFilter }) => {
  const [inStock, setInStock] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = [
    { name: 'Pain Relief', title: 'Pain Relief', link: '/buy/medication' },
    { name: 'Allergy', title: 'Allergy', link: '/buy/medication' },
    { name: 'Cold & Flu', title: 'Cold & Flu', link: '/buy/medication' },
    { name: 'Digestive Health', title: 'Digestive Health', link: '/buy/medication' },
    { name: 'Heart Health', title: 'Heart Health', link: '/buy/medication' },
    { name: 'Vitamins/Supplements', title: 'Vitamins/Supplements', link: '/buy/medication' },
    { name: 'Women Health', title: 'Women Health', link: '/buy/medication' },
    { name: 'Other', title: 'Other', link: '/buy/medication' }
  ];

  const handleApplyFilter = () => {
    // Construct the filter object based on the selected options
    const filter = {};
    if (inStock) {
      filter.inStock = true;
    }
    if (selectedCategories.length > 0) {
      filter.categories = selectedCategories;
    }
    filter.priceRange = { min: priceRange[0], max: priceRange[1] };
    // Pass the filter object to the parent component
    handleFilter(filter);
  };

  const handleClearFilter = () => {
    // Clear all selected filters
    setInStock(false);
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    // Pass an empty filter object to remove all filters
    handleFilter({});
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent:'left',textAlign:'left', gap: 2 }}>
        <Typography sx={{fontWeight:'bold'}}  gutterBottom>In Stock</Typography>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={inStock} onChange={(e) => setInStock(e.target.checked)} />}
          label="In Stock"
        />
      </FormGroup>
      <Typography sx={{fontWeight:'bold'}}  gutterBottom>Categories:</Typography>
      <FormGroup>
        {categories.map((category) => (
          <FormControlLabel
            key={category.name}
            control={<Checkbox checked={selectedCategories.includes(category.name)} onChange={(e) => {
              if (e.target.checked) {
                setSelectedCategories([...selectedCategories, category.name]);
              } else {
                setSelectedCategories(selectedCategories.filter((cat) => cat !== category.name));
              }
            }} />}
            label={category.title}
          />
        ))}
      </FormGroup>
      <Typography id="price-range-slider" sx={{fontWeight:'bold',alignItems:'left'}} gutterBottom>
        Price Range
      </Typography>
      <Slider
        value={priceRange}
        onChange={(e, newValue) => setPriceRange(newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={100}
        aria-labelledby="price-range-slider"
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={handleApplyFilter}>Apply Filter</Button>
        <Button variant="contained" onClick={handleClearFilter}>Clear Filter</Button>
      </Box>
    </Box>
  );
};

export default FilterComponent;

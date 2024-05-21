import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';
import {
  Button,
  TableCell,
  TextField,
  Grid,
  Card, 
  Box,
  useMediaQuery, 
  Typography, 
  useTheme, 
  FormControl, 
  Select, 
  MenuItem,
  CircularProgress,
  Autocomplete,

} from '@mui/material';
import { toast } from 'react-toastify';
import { useDispatch,useSelector } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import NotPermitted from "components/NotPermitted";
import { Rowing } from '@mui/icons-material';



const Form = () => {
  const [csvData, setCsvData] = useState(null);
  const [editedData, setEditedData] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const role= useSelector((state) => state.auth.role);
  const selectedPharmacy=useSelector((state)=>state.auth.pharmacy);
  const [pharmacies, setPharmacies] = useState([]);
  const [ selectedPharmacyData,  setSelectedPharmacyData] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isPermitted=role==='pharmacist'||role==='admin';
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const handleFileUpload = (acceptedFiles) => {
    setLoading(true);
    try{
      const file = acceptedFiles[0];
      Papa.parse(file, {
        header: true,
        complete: (parsedData) => {
          // Set the parsed CSV data to state
          setCsvData(parsedData.data);
          // Initialize edited data state with parsed data
          setEditedData(parsedData.data);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        },
      });
    }
    catch(error)
    {
      console.error("Error parsing CSV", error);
    }
    finally{
  setLoading(false);
    }
    
   
  };

  const handleInputChange = (event, rowIndex, columnName) => {
    const updatedData = [...editedData];
    updatedData[rowIndex][columnName] = event.target.value;
    setEditedData(updatedData);
  };

  /*const handlePictureUpload = (acceptedFiles, rowIndex) => {
    const updatedData = [...editedData];
    updatedData[rowIndex]['picture'] = acceptedFiles[0];
    setEditedData(updatedData);
  };*/

  const handlePictureUpload = (acceptedFiles, rowIndex) => {
  const updatedData = [...editedData];
  // Assuming acceptedFiles is an array of File objects
  const file = acceptedFiles[0]; // Assuming only one file is uploaded
  // Handle the file upload and get the file path or URL
  const picture = file.path; // Update this to get the correct file path or URL
  updatedData[rowIndex]['picture'] = picture;
  //console.log('picture name: ', updatedData[rowIndex]['picture'])
  //console.log('accepted files: ', acceptedFiles[0])
  //console.log('picture: ',file.path)

  setEditedData(updatedData);
};
useEffect(() => {
  const fetchPharmacies = async () => {
    try {
      const response = await fetch('http://localhost:3001/pharmacy/getPharmacies', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const pharmaciesData = await response.json();
        setPharmacies(pharmaciesData);
      } else {
        console.log('Failed to fetch pharmacies');
      }
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    }
  };

  fetchPharmacies();
}, [token]);
  const medication=async(values)=>{
    try {
      console.log("values in medication fetch:",values)
      console.log('testing: ',JSON.stringify(values, null, 2));
   const medicationResponse=await fetch(
      `http://localhost:3001/medication/addBulkMedication`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values), // Serialize the values to JSON
      }
    )
    if(medicationResponse.ok){
        toast.success('Medication Successfully Created.', { 
          // Position of the notification
          autoClose: 5000, // Duration before the notification automatically closes (in milliseconds)
          hideProgressBar: true, // Whether to hide the progress bar
          closeOnClick: true, // Whether clicking the notification closes it
          pauseOnHover: true, // Whether hovering over the notification pauses the autoClose timer
          draggable: true, // Whether the notification can be dragged
          progress: undefined, // Custom progress bar (can be a React element)
        theme:'colored',
        });
        navigate('/manage/medications')
    }
    
    //if (goalData)
    else{
        console.log("failed to submit the medication form");
        toast.error('Medication Creation Unsuccessful', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
    }
      } 
      catch (error) {
        console.error("Error in medication function:", error);
        toast.error('Medication Creation Unsuccessful', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
      }

  }
let values;
const handleSubmit = async() => {
  try {
    // Add the pharmacy ID to each medication object
    let updatedData;
if(role==='pharmacist')
{
  updatedData = editedData.map(item => ({
    ...item,
   pharmacy: selectedPharmacy._id // Add the pharmacy ID here
  }));
}
else{
  updatedData = editedData.map(item => ({
    ...item,
   pharmacy: selectedPharmacyData // Add the pharmacy ID here
  }));
}
    console.log('Edited Data:', updatedData);
//
    // Call the medication function with the updated data
    await medication(updatedData);
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};


  const handleDeleteRow = (rowIndex) => {
    const updatedData = editedData.filter((row, index) => index !== rowIndex);
    setEditedData(updatedData);
  };

  return (
    <>
   
     {isPermitted ? (
      isNonMobile ? (
        <>
        {(role==='admin')&&(
 <>
<Typography variant='h6' color='primary' fontWeight='bold' sx={{pb:'0.9rem'}}> Choose A Pharmacy </Typography>
<Autocomplete
                options={pharmacies}
                getOptionLabel={(option) => option.name}
                value={pharmacies.find((pharmacy) => pharmacy._id === selectedPharmacyData) || null}
                onChange={(event, newValue) => {
                  setSelectedPharmacyData(newValue ? newValue._id : null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pharmacy"
                    error={false} // Set error state as needed
                    helperText={null} // Helper text for errors
                    variant="outlined"
                    fullWidth
                  />
                )}
                sx={{ gridColumn: "span 3",mb:'1rem' }}
              />
</>
        )}
       
        <div>
        <Typography variant='h6' color='primary' fontWeight='bold' sx={{my:'0.4rem'}}>Choose Medication File </Typography>

      <Dropzone onDrop={handleFileUpload} accept=".csv">
        {({ getRootProps, getInputProps }) => (
          <Box {...getRootProps()}
          sx={{
            marginY:'1rem',
            border: '2px dashed #ccc',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              borderColor: primary,
            },
          }}
          >
            <input {...getInputProps()} />
            <p>click to select a file - only csv</p>
          </Box>
        )}
      </Dropzone>

      {/* Display the CSV data */}
      {editedData.length>0 && (
        <>
      <Typography variant='h6' color='primary' fontWeight='bold' sx={{pb:'0.4rem'}}>Medication Details </Typography>

        <table>
          <tbody>
            {editedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.entries(row).map(([columnName, cell], cellIndex) => (
                  <TableCell key={cellIndex}>
                    {columnName === 'picture' ? (
                      <Dropzone
                        onDrop={(acceptedFiles) => handlePictureUpload(acceptedFiles, rowIndex)}
                        accept="image/*"
                        multiple={false}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {/* Display the name of the selected picture file */}
                            {!editedData[rowIndex]['picture'] ?(
                            <p>Click to select image</p>
                            ): (
                              <p>{editedData[rowIndex]['picture']}</p>
                            )}
                          </div>
                        )}
                      </Dropzone>
                    ) : (
                      <TextField
                        value={cell}
                        onChange={(event) => handleInputChange(event, rowIndex, columnName)}
                      />
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Button onClick={() => handleDeleteRow(rowIndex)}>Delete</Button>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}

      {/* Submit button */}
      {editedData.length>0&&(
        <>
              <Button variant="contained" onClick={handleSubmit} sx={{color:alt}}>Submit</Button>
        </>
      )}
    </div>
  
        </>
      ) : (
        <Box>
          <Typography variant='body1'>Mobile devices not supported.</Typography>
        </Box>
      )
    ) : (
      <NotPermitted />
    )}

    </>
   
    
   
  );
};

export default Form;

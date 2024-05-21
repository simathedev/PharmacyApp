import React from 'react'
import { useEffect, useState } from "react";
import { Formik } from "formik";
import Dropzone from 'react-dropzone';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FlexBetween from "components/FlexBetween";
import * as yup from "yup";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    IconButton,
    Collapse,
    Alert,
    AlertTitle,
    useTheme,
    MenuItem,
    Card
  } from "@mui/material";
  import { useDispatch,useSelector } from "react-redux";
import BackButton from 'components/buttons/BackButton';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import ProgressLoadWidget from 'components/widgets/ProgressLoadWidget';
import Loading from 'components/Loading';

 
  
  const Form = () => {
    const navigate = useNavigate();
    const selectedPharmacy=useSelector((state)=>state.auth.pharmacy);
    const role= useSelector((state) => state.auth.role);
    const [image, setImage] = useState(null);
    const [pharmacies, setPharmacies] = useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [isSaving,setIsSaving]=useState(false);
    const { palette } = useTheme();
    const medicationSchema = yup.object().shape({
      name: yup.string().required('medication name is required'),
      quantity: yup.number(),
      price: yup.string(),
      category: yup.string().required('Category is required'),
      inStock: yup.boolean().required('Stock availability is required'),
      pharmacy: yup.string().required('Pharmacy is required'),
      picture: yup.string(),
    });
    const token = useSelector((state) => state.auth.token);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const initialValuesMedication = {
      name: '',
      quantity: '',
      price: '',
      category: '',
      inStock: true,
      pharmacy: '', 
      picture: '',
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
            setIsLoading(false);
            const pharmaciesData = await response.json();
            setPharmacies(pharmaciesData);
          } else {
            setIsLoading(false);
            console.log('Failed to fetch pharmacies');
          }
        } catch (error) {
          setIsLoading(false);
          console.error('Error fetching pharmacies:', error);
        }
      };
  
      fetchPharmacies();
    }, [token]);

    const medication=async(values,onSubmitProps)=>{
      try {
        console.log("values in medication fetch:",values)
       const formData = new FormData();
        for (let value in values) {
          formData.append(value, values[value]);
        }
       formData.append("picture", values.picture.name);
        //console.log ("formData medication:",formData)
     const medicationResponse=await fetch(
        `http://localhost:3001/medication/addMedication`,
        {
          method:"POST",
          headers: { Authorization: `Bearer ${token}` },
          body:formData,
        }
      )
      if(medicationResponse.ok){
        setIsSaving(false);
          onSubmitProps.resetForm();
          navigate("/manage/medications");
          toast.success('Medication Successfully Created.', { 
            // Position of the notification
            autoClose: 5000, // Duration before the notification automatically closes (in milliseconds)
            hideProgressBar: true, // Whether to hide the progress bar
            closeOnClick: true, // Whether clicking the notification closes it
            pauseOnHover: true, // Whether hovering over the notification pauses the autoClose timer
            draggable: true, // Whether the notification can be dragged
            progress: undefined, // Custom progress bar (can be a React element)
            theme:"colored",
          });
      }
      //if (goalData)
      else{
        setIsSaving(false);
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

          // ...rest of the code
        } 
        catch (error) {
          setIsSaving(false);
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
   
    const handleSubmit = async (values, onSubmitProps) => {
      try {
        // Perform the submission logic here
        setIsSaving(true);
        console.log('Submitting medication:', values);
        await medication(values, onSubmitProps);
        //resetForm(); // Reset the form after successful submission
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };

    if(isLoading)
    {
      return <Loading/>
    }
  
    return (
      <Formik
        initialValues={initialValuesMedication}
        validationSchema={medicationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box 
            display="grid"
            gap="30px"
            position="relative"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
           // display="flex" flexDirection="column" alignItems="center"
            >

{isSaving&&(
           <Card
           sx={{width:isNonMobile?'60%':'90%', 
position: 'absolute',
top: '50%',
left: '50%',
transform: 'translate(-50%, -50%)',
zIndex:9999,
borderRadius:4,
        }}>
          <ProgressLoadWidget name='Medication' text='Adding'/>

        </Card>
        )}

              
              <TextField
              label="Medication Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              margin="normal"
              variant="outlined"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={values.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.quantity && Boolean(errors.quantity)}
              helperText={touched.quantity && errors.quantity}
              margin="normal"
              variant="outlined"
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Price"
              name="price"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.price && Boolean(errors.price)}
              helperText={touched.price && errors.price}
              margin="normal"
              variant="outlined"
              sx={{ gridColumn: "span 2" }}
            />
             <TextField
              select
              label="Category"
              name="category"
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.category && Boolean(errors.category)}
              helperText={touched.category && errors.category}
              margin="normal"
              variant="outlined"
              sx={{ gridColumn: "span 4" }}
            >
              
              <MenuItem value="">Select Category</MenuItem>
              {['Antibiotics', 'Pain Relief', 'Allergy', 'Cold & Flu', 'Digestive Health', 'Heart Health', 'Vitamins/Supplements', 'Women Health', 'Other'].map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Pharmacy"
              name="pharmacy"
              select
              SelectProps={{
                native: true,
              }}
              value={values.pharmacy}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.pharmacy && Boolean(errors.pharmacy)}
              helperText={touched.pharmacy && errors.pharmacy}
              margin="normal"
              variant="outlined"
              sx={{ gridColumn: "span 4" }}
            >
              <option value="">Select Pharmacy</option>
              {pharmacies.map((pharmacy) => (
                <option key={pharmacy._id} value={pharmacy._id}>
                  {pharmacy.name}
                </option>
              ))}
            </TextField>
                <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                    
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ gridColumn: "span 4","&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
              <Button 
              fullWidth
              type="submit"
              sx={{
                m: "1rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
                gridColumn: "span 4"
              }}
              >
                Submit
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    );
  };
  
  export default Form;
  


import React from 'react'
import { useEffect, useState } from "react";
import { Formik } from "formik";
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
    Card
  } from "@mui/material";
  import { useDispatch,useSelector } from "react-redux";
  import Dropzone from 'react-dropzone';
  import FlexBetween from "components/FlexBetween";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import ProgressLoadWidget from 'components/widgets/ProgressLoadWidget';
import Loading from 'components/Loading';
 
  
  const Form = () => {
    const { palette } = useTheme();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [isSaving, setIsSaving]=useState(false);
    const pharmacySchema = yup.object().shape({
      name: yup.string().required('Pharmacy name is required').min(2, 'Name is too short').max(50, 'Name is too long'),
      email: yup.string().required('Email is required').email('Enter a valid email'),
      phoneNumber: yup.string().max(10, 'Phone number should be 10 digits or less'),
      streetAddress: yup.string().required('Street address is required'),
      openTime: yup.string().required('Opening time is required'),
      closeTime: yup.string().required('Closing time is required'),
      picture: yup.string(),
    });
    const token = useSelector((state) => state.auth.token);

    const initialValuesPharmacy = {
      name: '',
      email: '',
      phoneNumber: '',
      streetAddress: '',
      openTime: '',
      closeTime: '',
      picture:'',
    };
  
    const pharmacy=async(values,onSubmitProps)=>{
      try {
        const formData = new FormData();
        for (let value in values) {
          formData.append(value, values[value]);
        }
       formData.append("picture", values.picture.name);
      const pharmacyResponse=await fetch(
        `http://localhost:3001/pharmacy/addPharmacy`,
        {
          method:"POST",
          headers: { Authorization: `Bearer ${token}` },
          body:formData,
        }
      )
      if(pharmacyResponse.ok){
        isSaving(false);
          onSubmitProps.resetForm();
          navigate("/admin/pharmacies");
          toast.success('User Successfully Created.', { 
            // Position of the notification
            autoClose: 5000, // Duration before the notification automatically closes (in milliseconds)
            hideProgressBar: true, // Whether to hide the progress bar
            closeOnClick: true, // Whether clicking the notification closes it
            pauseOnHover: true, // Whether hovering over the notification pauses the autoClose timer
            draggable: true, // Whether the notification can be dragged
            progress: undefined, // Custom progress bar (can be a React element)
            theme:"colored"
          });
      }
     
      else{
        setIsSaving(false);
          console.log("failed to submit the pharmacy form");
          toast.error('Pharmacy Creation Unsuccessful', {
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
          setIsSaving(false);
          console.error("Error in pharmacy function:", error);
          toast.error('Pharmacy Creation Unsuccessful', {
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
        setIsSaving(true);
        const concatenatedAddress = `${values.streetAddress},${values.suburb},${values.city},${values.province},${values.postalCode}`;
        const updatedValues = {
          ...values,
          streetAddress: concatenatedAddress, // Add the concatenated address as streetAddress property
        };
        console.log('Submitting pharmacy:', updatedValues);
        await pharmacy(updatedValues, onSubmitProps);
      } 
      catch (error) 
      {
        console.error('Error submitting form:', error);
      }
    };

    return (
      <Formik
        initialValues={initialValuesPharmacy}
        validationSchema={pharmacySchema}
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
          <ProgressLoadWidget name='Pharmacy' text='Adding'/>

        </Card>
        )}

              <TextField
                label="Pharmacy Name"
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
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                margin="normal"
                variant="outlined"
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
                margin="normal"
                variant="outlined"
                sx={{ gridColumn: "span 4" }}
              />
          <TextField
                name="streetAddress"
                label="Street Address"
                value={values.streetAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.streetAddress && Boolean(errors.streetAddress)}
                helperText={touched.streetAddress && errors.streetAddress}
                sx={{ gridColumn: "span 4" }}
              />
               <TextField
                name="suburb"
                label="Suburb"
                value={values.suburb}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.suburb && Boolean(errors.suburb)}
                helperText={touched.suburb && errors.suburb}
                sx={{ gridColumn: "span 2" }}
              />
               <TextField
                name="city"
                label="City/Town"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.city && Boolean(errors.city)}
                helperText={touched.city && errors.city}
                sx={{ gridColumn: "span 2" }}
              />
               <TextField
                name="province"
                label="State/Province"
                value={values.province}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.province && Boolean(errors.province)}
                helperText={touched.province && errors.province}
                sx={{ gridColumn: "span 2" }}
              />
                <TextField
                name="postalCode"
                label="Postal Code"
                value={values.postalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.postalCode && Boolean(errors.postalCode)}
                helperText={touched.postalCode && errors.streetAddress}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Open Time"
                name="openTime"
                value={values.openTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.openTime && Boolean(errors.openTime)}
                helperText={touched.openTime && errors.openTime}
                margin="normal"
                variant="outlined"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Close Time"
                name="closeTime"
                value={values.closeTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.closeTime && Boolean(errors.closeTime)}
                helperText={touched.closeTime && errors.closeTime}
                margin="normal"
                variant="outlined"
                sx={{ gridColumn: "span 2" }}
              />
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
                        sx={{   gridColumn: "span 4","&:hover": { cursor: "pointer" } }}
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
              }}>
                Submit
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    );
  };
  
  export default Form;
  


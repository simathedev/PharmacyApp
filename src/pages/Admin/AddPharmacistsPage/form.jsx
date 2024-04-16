import React from 'react'
import { useEffect, useState } from "react";
import { Formik } from "formik";
import Dropzone from 'react-dropzone';
import FlexBetween from "components/FlexBetween";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
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
  } from "@mui/material";
  import { useDispatch,useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import { toast } from 'react-toastify';
 
  
  const Form = () => {
     const { palette } = useTheme();
     const navigate = useNavigate();
    const pharmacistSchema = yup.object().shape({
      firstName: yup.string().required('Pharmacist first name is required').min(2, 'first name is too short').max(50, 'first name is too long'),
      lastName: yup.string().required('Pharmacist last name is required').min(2, 'Last name is too short').max(50, 'last name is too long'),
      email: yup.string().required('Email is required').email('Enter a valid email'),
      password: yup.string().required('Password is required').min(5, 'Password should be at least 5 characters').max(10, 'Password should be at most 10 characters'),
      practiceNumber:yup.string(),
      role: yup.string().required('Role is required').oneOf(['admin', 'pharmacist']), // Use oneOf for role validation
      pharmacy: yup.string().required('Pharmacy is required'),
      picture: yup.string(),
    });

    const initialValuesPharmacy = {
      firstName: '',
      lastName:'',
      email: '',
      password: '', 
      role: '', 
      practiceNumber:'',
      pharmacy: '', 
      picture:'',

    };
    const [pharmacies, setPharmacies] = useState([]);

    const token = useSelector((state) => state.auth.token);
    const isNonMobile = useMediaQuery("(min-width:600px)");

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
  
    const pharmacist=async(values,onSubmitProps)=>{
      try {
        const formData = new FormData();
        for (let value in values) {
          formData.append(value, values[value]);
        }
       formData.append("picture", values.picture.name);
      const pharmacyResponse=await fetch(
        `http://localhost:3001/pharmacist/addPharmacist`,
        {
          method:"POST",
          headers: { Authorization: `Bearer ${token}` },
          body:formData,
        }
      )
      if(pharmacyResponse.ok){
          onSubmitProps.resetForm();
          toast.success('Pharmacist Successfully Created.', { 
            // Position of the notification
            autoClose: 5000, // Duration before the notification automatically closes (in milliseconds)
            hideProgressBar: true, // Whether to hide the progress bar
            closeOnClick: true, // Whether clicking the notification closes it
            pauseOnHover: true, // Whether hovering over the notification pauses the autoClose timer
            draggable: true, // Whether the notification can be dragged
            progress: undefined, // Custom progress bar (can be a React element)
            // Other options for customizing the notification
          });
          navigate("/admin/pharmacists");
      }
      //if (goalData)
      else{
          console.log("failed to submit the pharmacist form");
          toast.error('Pharmacist Creation Unsuccessful', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
      }

          // ...rest of the code
        } 
        catch (error) {
          console.error("Error in pharmacist function:", error);
          toast.error('Pharmacist Creation Unsuccessful', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        }
    
    }
   
    const handleSubmit = async (values, onSubmitProps) => {
      try {
        // Perform the submission logic here
        console.log('Submitting pharmacist:', values);
        await pharmacist(values, onSubmitProps);
        //resetForm(); // Reset the form after successful submission
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };
  
    return (
      <Formik
        initialValues={initialValuesPharmacy}
        validationSchema={pharmacistSchema}
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
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}>

              <TextField
                label="First Name"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                margin="normal"
                variant="outlined"
                sx={{ gridColumn: "span 2" }}
              />
               <TextField
                label="Last Name"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                margin="normal"
                variant="outlined"
                sx={{ gridColumn: "span 2" }}
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
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              margin="normal"
              variant="outlined"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Role"
              name="role"
              select
              SelectProps={{
                native: true,
              }}
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.role && Boolean(errors.role)}
              helperText={touched.role && errors.role}
              margin="normal"
              variant="outlined"
              sx={{ gridColumn: "span 4" }}
            >
              <option value="">Select Role</option>
              <option value="admin">admin</option>
              <option value="pharmacist">pharmacist</option>
            </TextField>
            <TextField
                  label="Practice Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.practiceNumber}
                  name="practiceNumber"
                  error={Boolean(touched.practiceNumber) && Boolean(errors.practiceNumber)}
                  helperText={touched.practiceNumber && errors.practiceNumber}
                  sx={{ gridColumn: "span 4" }}
                />
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
                        sx={{   gridColumn: "span 4" ,"&:hover": { cursor: "pointer" } }}
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
                gridColumn: "span 4"}}>
                Submit
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    );
  };
  
  export default Form;
  



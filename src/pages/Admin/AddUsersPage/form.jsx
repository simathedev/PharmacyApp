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
    Card,
  } from "@mui/material";
  import { useDispatch,useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import { toast } from 'react-toastify';
import ProgressLoadWidget from 'components/widgets/ProgressLoadWidget';

  
  const Form = () => {
    const navigate = useNavigate();
    const userSchema = yup.object().shape({
      firstName: yup.string().required('first name is required').min(2, 'first name is too short').max(50, 'first name is too long'),
      lastName: yup.string().required('last name is required').min(2, 'last name is too short').max(50, 'last name is too long'),
      IDNumber: yup.string().required('ID number is required').min(5, 'ID number is too short').max(15, 'ID number is too long'),
      email: yup.string().required('Email is required').email('Enter a valid email'),
      phoneNumber: yup.string().max(10, 'Phone number should be 10 digits or less'),
      streetAddress: yup.string().required('Street address is required'),
      password: yup.string().required('Password is required').min(5, 'Password is too short').max(10, 'Password is too long'),
    });

    const adminSchema = yup.object().shape({
      firstName: yup.string().required('first name is required').min(2, 'first name is too short').max(50, 'first name is too long'),
      lastName: yup.string().required('last name is required').min(2, 'last name is too short').max(50, 'last name is too long'),
      email: yup.string().required('Email is required').email('Enter a valid email'),
      password: yup.string().required('Password is required').min(5, 'Password is too short').max(10, 'Password is too long'),
    });

    const [Admin,setAdmin]=useState(false);
    const token = useSelector((state) => state.auth.token);
    const role = useSelector((state) => state.auth.role);
      
    let apiUrlSegment=process.env.NODE_ENV === 'production' ?
    `https://pharmacy-app-api.vercel.app`
    :
    `http://localhost:3001`

      const makeAdmin = () => {
        setAdmin((prevAdmin) => !prevAdmin);
      };
      

    const initialValuesUser = {
      firstName: '',
      lastName: '',
      IDNumber: '',
      email: '',
      phoneNumber: '',
      streetAddress: '',
      password:'',
    };
    const initialValuesAdmin = {
      firstName: '',
      lastName: '',      
      email: '',
      password:'',
    };

    const { palette } = useTheme();
    const isNonMobile = useMediaQuery("(min-width:600px)");
   const [isLoading,setIsLoading]=useState(true);
   const[isSaving,setIsSaving]=useState(false);
   
    const user=async(values,onSubmitProps)=>{
      try {
      const userResponse=await fetch(
        `http://localhost:3001/user/addUser`,
        {
          method:"POST",
          headers: {
             Authorization: `Bearer ${token}`,
             "Content-Type": "application/json",
            },
          body:JSON.stringify(values),
        }
      )
      if(userResponse.ok){
        setIsSaving(false)
          onSubmitProps.resetForm();
          navigate("/manage/users");
          toast.success('User Successfully Created.', { 
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
      else{
        setIsSaving(false)
          console.log("failed to submit the user form");
          toast.error('User Creation Unsuccessful', {
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
          setIsSaving(false)
          console.error("Error in user function:", error);
          toast.error('User Creation Unsuccessful', {
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
   
    const createAdmin=async(values,onSubmitProps)=>{
      try {
      const userResponse=await fetch(
        `${apiUrlSegment}/auth/registerAdmin`,
        {
          method:"POST",
          headers: {
             Authorization: `Bearer ${token}`,
             "Content-Type": "application/json",
            },
          body:JSON.stringify(values),
        }
      )
      if(userResponse.ok){
          onSubmitProps.resetForm();
          navigate("/manage/users");
          toast.success('Admin Successfully Created.', { 
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
      else{
          console.log("failed to submit the user form");
          toast.error('Admin Creation Unsuccessful', {
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
          console.error("Error in user function:", error);
          toast.error('Admin Creation Unsuccessful', {
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
        const concatenatedAddress = `${values.streetAddress},${values.suburb},${values.city},${values.province},${values.postalCode}`;
        setIsSaving(true);
        if(Admin)
        {
          await createAdmin(values,onSubmitProps);
        }
       else{
        const updatedValues = {
          ...values,
          streetAddress: concatenatedAddress, // Add the concatenated address as streetAddress property
        };
        console.log('Submitting user:', updatedValues);
        await user(updatedValues, onSubmitProps);
       }
        
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };

   
  
    return (
      <Formik
        initialValues={Admin?initialValuesAdmin:initialValuesUser}
        validationSchema={Admin?adminSchema:userSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box 
            display="grid"
            gap="30px"
            position= "relative"
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
          <ProgressLoadWidget name='user' text='creating'/>

        </Card>
        )}
  
              {role=='admin'&&(
 <Button 
 sx={{gridColumn:"span 4"}}
 onClick={makeAdmin}
 >
   {
     Admin?
     'Create General User':'Create Admin'
   }
  
   </Button>
              )}
           
              <TextField
                label="First name"
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
                label="Last name"
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
              {
                !Admin&&(
                  <>
<TextField
                label="Identification Number"
                name="IDNumber"
                type="IDNumber"
                value={values.IDNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.IDNumber && Boolean(errors.IDNumber)}
                helperText={touched.IDNumber && errors.IDNumber}
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
              </>
                )
              }
              
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
  



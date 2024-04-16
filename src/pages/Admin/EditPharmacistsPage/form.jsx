import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import Dropzone from 'react-dropzone';
import FlexBetween from "components/FlexBetween";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Box,
  Button,
  Typography,
  TextField,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate,useParams } from "react-router-dom";
import { toast } from 'react-toastify';



const Form = () => {
  let {id}=useParams();
  const { palette } = useTheme();

  const validationSchemaPharmacist = yup.object().shape({
    firstName: yup.string().required('Pharmacist first name is required').min(2, 'first name is too short').max(50, 'first name is too long'),
    lastName: yup.string().required('Pharmacist last name is required').min(2, 'Last name is too short').max(50, 'last name is too long'),
    email: yup.string().required('Email is required').email('Enter a valid email'),
    picture: yup.string(),
  });

  const validationSchemaPharmacy = yup.object().shape({
        pharmacy: yup.string().required('Pharmacy is required'),
  });

  const validationSchemaPassword = yup.object().shape({
    password: yup.string().required('Password is required').min(5, 'Password should be at least 5 characters').max(10, 'Password should be at most 10 characters'),
  });
  


  const [pharmacist, setPharmacist] = useState({});
  const [pharmacies, setPharmacies] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [validationSchema, setValidationSchema] = useState(yup.object());
  const [showPharmacistInfoFields, setShowPharmacistInfoFields] = useState(false);
  const [showPharmacyFields, setShowPharmacyFields] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate=useNavigate();

  useEffect(() => {
    const fetchPharmacist = async () => {
      try {
        const response = await fetch(`http://localhost:3001/pharmacist/getPharmacist/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const pharmacistData = await response.json();
          setPharmacist(pharmacistData);
        } else {
          console.log('Failed to fetch pharmacist');
        }
      } catch (error) {
        console.error('Error fetching pharmacist:', error);
      }
    };
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
    fetchPharmacist();
  }, [token]);

  const updatePharmacist = async (values, onSubmitProps) => {
    try {
      const pharmacistResponse = await fetch(`http://localhost:3001/pharmacist/updatePharmacist/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (pharmacistResponse.ok) {
        onSubmitProps.resetForm();
        navigate("/admin/pharmacists");
        toast.success('Pharmacist Successfully Updated.', { 
          autoClose: 5000, // Duration before the notification automatically closes (in milliseconds)
          hideProgressBar: true, // Whether to hide the progress bar
          closeOnClick: true, // Whether clicking the notification closes it
          pauseOnHover: true, // Whether hovering over the notification pauses the autoClose timer
          draggable: true, // Whether the notification can be dragged
          progress: undefined, // Custom progress bar (can be a React element)
          theme:"colored",
        });
      } else {
        console.log('Failed to submit the pharmacist form');
        toast.error('Pharmacist Update Unsuccessful', {
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
    } catch (error) {
      console.error('Error in pharmacist function:', error);
      toast.error('Pharmacist Update Unsuccessful', {
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
  };
  const setInitialValuesAndValidationSchema = (showPharmacistInfoFields, showPharmacyFields, showPasswordFields,pharmacist) => {
    if (!pharmacist || Object.keys(pharmacist).length === 0) {
      return;
    }

    if (!showPharmacistInfoFields && !showPharmacyFields && !showPasswordFields) {
      setInitialValues({
        firstName: pharmacist.firstName || '',
        lastName: pharmacist.lastName || '',
        email: pharmacist.email || '',
        picture: pharmacist.picture || '',
        pharmacy: pharmacist.pharmacy || '',
        password: '',
      });
      //setValidationSchema(validationSchemaBasicInfo);
    }
    else
    {
      switch (true) {
        case showPharmacistInfoFields:
          setInitialValues({
            firstName: pharmacist.firstName || '',
            lastName: pharmacist.lastName || '',
            email: pharmacist.email || '',
            picture: pharmacist.picture || '',
          })
          setValidationSchema(validationSchemaPharmacist);
          break;
        case showPharmacyFields:
          setInitialValues({
            pharmacy: pharmacist.pharmacy || '',
          })
          setValidationSchema(validationSchemaPharmacy);
          break;
        case showPasswordFields:
          setInitialValues({
            password: '',
          })
          setValidationSchema(validationSchemaPassword);
          break;
        default:
          setValidationSchema(yup.object());
      }
    }
  }


useEffect(() => {
  setInitialValuesAndValidationSchema(showPharmacistInfoFields, showPharmacyFields, showPasswordFields,pharmacist)
}, [showPharmacistInfoFields, showPharmacyFields, showPasswordFields,pharmacist]);

const capitalize = (value) => {
  //if (!value) return value;
 // return value.charAt(0).toUpperCase() + value.slice(1);
 if (!value) return value;
  return value
    .split(' ') // Split the sentence into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(' '); // Join the words back into a sentence
};

const handlePharmacistClick = () => {
  setShowPharmacistInfoFields(!showPharmacistInfoFields);
  setShowPasswordFields(false);
  setShowPharmacyFields(false);
};

const handlePharmacyClick = () => {
  setShowPharmacyFields(!showPharmacyFields);
  setShowPharmacistInfoFields(false);
  setShowPasswordFields(false);
};

const handlePasswordClick = () => {
  setShowPasswordFields(!showPasswordFields);
  setShowPharmacistInfoFields(false);
  setShowPharmacyFields(false);
};

  const handleSubmit = async (values, onSubmitProps) => {
    try {
      
      console.log('Submitting pharmacist:', values);
      await updatePharmacist(values, onSubmitProps);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
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
              }}
              >
                  <Button 
              onClick={handlePharmacistClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showPharmacistInfoFields ? "Hide Pharmacist Info" : "Edit Pharmacist Info"}
            </Button>

            <Button 
              onClick={handlePharmacyClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showPharmacyFields ? "Hide Pharmacy" : "Edit Pharmacy"}
            </Button>

            <Button 
              onClick={handlePasswordClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showPasswordFields ? "Hide Password" : "Edit Password"}
            </Button>
            {showPharmacistInfoFields&&(
              <>
 <TextField
                label="First Name"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={ (e)=>  
                  {const capitalizedValue = capitalize(e.target.value); // Capitalize the input value
                 setFieldValue('firstName', capitalizedValue); // Set the field value with the capitalized value
                 handleBlur(e);
                  }}
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
                onBlur={ (e)=>  
                  {const capitalizedValue = capitalize(e.target.value); // Capitalize the input value
                 setFieldValue('lastName', capitalizedValue); // Set the field value with the capitalized value
                 handleBlur(e);
                  }}
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
                            <Typography>{values.picture}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
              </>
            )}
             {showPharmacyFields&&(
              <>
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
              </>
            )}
             {showPasswordFields&&(
              <>
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
              </>
            )}
              
             
             
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
                Update
              </Button>
            </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
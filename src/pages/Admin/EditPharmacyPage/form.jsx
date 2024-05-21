import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  Typography,
  TextField,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  useTheme,
  Card
} from '@mui/material';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Dropzone from 'react-dropzone';
import FlexBetween from "components/FlexBetween";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useParams } from 'react-router-dom';
import ProgressLoadWidget from 'components/widgets/ProgressLoadWidget';
import Loading from 'components/Loading';

const Form = () => {
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const validationSchemaPharmacyInfo = yup.object().shape({
    name: yup.string().required('Pharmacy name is required').min(2, 'Name is too short').max(50, 'Name is too long'),
    email: yup.string().required('Email is required').email('Enter a valid email'),
    phoneNumber: yup.string().max(10, 'Phone number should be 10 digits or less'),
    picture: yup.string(),
   
  });
  const validationSchemaTime = yup.object().shape({
      openTime: yup.string().required('Opening time is required'),
      closeTime: yup.string().required('Closing time is required'),
   
  });
  const validationSchemaAddress = yup.object().shape({
    streetAddress: yup.string().required('Street address is required'),
    suburb: yup.string().required('Suburb is required'),
    city: yup.string().required('City/Town is required'),
    province: yup.string().required('State/Province is required'),
    postalCode: yup.string().required('Postal code is required'),
  });
  const [initialValues, setInitialValues] = useState({});
  const [validationSchema, setValidationSchema] = useState(yup.object());
 const navigate=useNavigate();

  const [users, setUsers] = useState([]);
  const [medications, setMedications] = useState([]);
  const [pharmacy, setPharmacy] = useState([]);
  const [isLoading,setIsLoading]=useState(true);
  const [isSaving,setIsSaving]=useState(false);
  const token = useSelector((state) => state.auth.token);
  const role=useSelector((state)=>state.auth.role);
  const [showPharmacyInfoFields, setShowPharmacyInfoFields] = useState(false);
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [showTimeFields, setShowTimeFields] = useState(false);
  const {id}=useParams();

  useEffect(() => {

    const fetchUsers = async () => {
      //code to fetch users//
      try {
        const response = await fetch('http://localhost:3001/user/getUsers', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData.map((user) => ({ id: user._id, firstName: user.firstName })));
        } else {
          console.log('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    const fetchMedications = async () => {
        try {
          const response = await fetch('http://localhost:3001/medication/getMedications', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const medicationData = await response.json();
            setMedications(medicationData.map((user) => ({ id: user._id, name: user.name })));
          } else {
            console.log('Failed to fetch users');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      
      const fetchPharmacy = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`http://localhost:3001/pharmacy/getPharmacy/${id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const pharmacyData = await response.json();
            console.log('pharmacy data id:',pharmacyData);
            setPharmacy(pharmacyData);
            const [streetAddress, suburb, city, province, postalCode] = pharmacyData.streetAddress.split(",");
setInitialValues({
      name: pharmacyData.name || '',
      email: pharmacyData.email || '',
      phoneNumber:pharmacyData.phoneNumber ||'',
      streetAddress:pharmacyData.streetAddress || '',
      openTime: pharmacyData.openTime || '',
      closeTime:pharmacyData.closeTime || '',
      picture:pharmacyData.picture || '',
      streetAddress:streetAddress || "",
      suburb: suburb || "",
      city: city || "",
      province: province || "",
      postalCode: postalCode || "",
})
          } else {
            console.log('Failed to fetch pharmacy');
          }
        } catch (error) {
          console.error('Error fetching pharmacy:', error);
        }
      };

    fetchPharmacy();
    fetchUsers();
    fetchMedications();
  }, [token]);

  const setInitialValuesAndValidationSchema = (showPharmacyInfoFields, showAddressFields, showTimeFields,pharmacy) => {
    if (!pharmacy || Object.keys(pharmacy).length === 0) {
      return;
    }

    if (!showPharmacyInfoFields && !showAddressFields && !showTimeFields) {
      const [streetAddress, suburb, city, province, postalCode] = pharmacy.streetAddress.split(",");
      setInitialValues({
        name: pharmacy.name || '',
        email: pharmacy.email || '',
        phoneNumber:pharmacy.phoneNumber ||'',
        streetAddress:pharmacy.streetAddress || '',
        picture:pharmacy.picture || '',
        streetAddress:streetAddress || "",
        suburb: suburb || "",
        city: city || "",
        province: province || "",
        postalCode: postalCode || "",
        openTime: pharmacy.openTime || '',
        closeTime:pharmacy.closeTime || '',

      });
      //setValidationSchema(validationSchemaBasicInfo);
    }
  else
  {
    switch (true) {
      case showPharmacyInfoFields:
        setInitialValues({
          name: pharmacy.name || '',
      email: pharmacy.email || '',
      phoneNumber:pharmacy.phoneNumber ||'',
      streetAddress:pharmacy.streetAddress || '',
      picture:pharmacy.picture || '',
        })
        setValidationSchema(validationSchemaPharmacyInfo);
        break;
      case showAddressFields:
        const [streetAddress, suburb, city, province, postalCode] = pharmacy.streetAddress.split(",");
        setInitialValues({
          streetAddress:streetAddress || "",
      suburb: suburb || "",
      city: city || "",
      province: province || "",
      postalCode: postalCode || "",
        })
        setValidationSchema(validationSchemaAddress);
        break;
      case showTimeFields:
        setInitialValues({
          openTime: pharmacy.openTime || '',
          closeTime:pharmacy.closeTime || '',
        })
        setValidationSchema(validationSchemaTime);
        break;
      default:
        setValidationSchema(yup.object());
    }
  }
  setIsLoading(false);
}

  useEffect(() => {
    setInitialValuesAndValidationSchema(showPharmacyInfoFields, showAddressFields, showTimeFields,pharmacy)
  }, [showPharmacyInfoFields, showAddressFields, showTimeFields,pharmacy]);

  const updatePharmacy = async (values, onSubmitProps) => {
    try {
      setIsSaving(true)
      const pharmacyResponse = await fetch(`http://localhost:3001/pharmacy/updatePharmacy/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (pharmacyResponse.ok) {
        setIsSaving(false);
        onSubmitProps.resetForm();
        navigate("/admin/pharmacies");
        toast.success('Pharmacy Successfully Updated.', { 
          // Position of the notification
          autoClose: 5000, // Duration before the notification automatically closes (in milliseconds)
          hideProgressBar: true, // Whether to hide the progress bar
          closeOnClick: true, // Whether clicking the notification closes it
          pauseOnHover: true, // Whether hovering over the notification pauses the autoClose timer
          draggable: true, // Whether the notification can be dragged
          progress: undefined,
          theme:"colored",

        });

      } else {
        setIsSaving(false)
        console.log('Failed to submit the pharmacy form');
        toast.error('Pharmacy Update Unsuccessful', {
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
      setIsSaving(false)
      console.error('Error in prescription function:', error);
      toast.error('Pharmacy Update Unsuccessful', {
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

  const handleSubmit = async (values, onSubmitProps) => {
    try {
      setIsSaving(true)
      console.log('updating pharmacy:', values);
      if(showAddressFields)
      {
        const concatenatedAddress = {streetAddress:`${values.streetAddress},${values.suburb},${values.city},${values.province},${values.postalCode}`};
        await updatePharmacy(concatenatedAddress, onSubmitProps);
      }
      else
    {
      await updatePharmacy(values, onSubmitProps);
    }
  

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const capitalize = (value) => {
    //if (!value) return value;
   // return value.charAt(0).toUpperCase() + value.slice(1);
   if (!value) return value;
    return value
      .split(' ') // Split the sentence into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(' '); // Join the words back into a sentence
};
  
  const handlePharmacyClick = () => {
    setShowPharmacyInfoFields(!showPharmacyInfoFields);
    setShowAddressFields(false);
    setShowTimeFields(false);
};

const handleAddressClick = () => {
    setShowAddressFields(!showAddressFields);
    setShowPharmacyInfoFields(false);
    setShowTimeFields(false);
};

const handleTimeClick = () => {
    setShowTimeFields(!showTimeFields);
    setShowPharmacyInfoFields(false);
    setShowAddressFields(false);
};
if(isLoading)
{
  return <Loading/>
}
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
          <ProgressLoadWidget name='Pharmacy' text='Updating'/>

        </Card>
        )}

{/*<Button 
              onClick={handlePharmacyClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showPharmacyInfoFields ? "Hide Pharmacy Info" : "Edit Pharmacy Info"}
            </Button>

            <Button 
              onClick={handleAddressClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showAddressFields ? "Hide Address" : "Edit Address"}
            </Button>

            <Button 
              onClick={handleTimeClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showTimeFields ? "Hide Time" : "Edit Time"}
            </Button> */}

            <Button
        onClick={handlePharmacyClick}
        sx={{ display: showAddressFields || showTimeFields ? 'none' : 'block', gridColumn: 'span 4' }}
      >
        {showPharmacyInfoFields ? 'Hide Pharmacy Info' : 'Edit Pharmacy Info'}
      </Button>

      <Button
        onClick={handleAddressClick}
        sx={{ display: showPharmacyInfoFields || showTimeFields ? 'none' : 'block', gridColumn: 'span 4' }}
      >
        {showAddressFields ? 'Hide Address' : 'Edit Address'}
      </Button>

      <Button
        onClick={handleTimeClick}
        sx={{ display: showPharmacyInfoFields || showAddressFields ? 'none' : 'block', gridColumn: 'span 4' }}
      >
        {showTimeFields ? 'Hide Time' : 'Edit Time'}
      </Button>

            {showPharmacyInfoFields&&(
              <>
              <TextField
                label="Pharmacy Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={ (e)=>  
                  {const capitalizedValue = capitalize(e.target.value); // Capitalize the input value
                 setFieldValue('name', capitalizedValue); // Set the field value with the capitalized value
                 handleBlur(e);
                  }}
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
                            <Typography>{values.picture}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
              </>
            )}
            {showAddressFields&&(
              <>
               <TextField
                name="streetAddress"
                label="Street Address"
                value={values.streetAddress}
                onChange={handleChange}
                onBlur={ (e)=>  
                  {const capitalizedValue = capitalize(e.target.value); // Capitalize the input value
                 setFieldValue('streetAddress', capitalizedValue); // Set the field value with the capitalized value
                 handleBlur(e);
                  }}
                error={touched.streetAddress && Boolean(errors.streetAddress)}
                helperText={touched.streetAddress && errors.streetAddress}
                sx={{ gridColumn: "span 4" }}
              />
               <TextField
                name="suburb"
                label="Suburb"
                value={values.suburb}
                onChange={handleChange}
                onBlur={ (e)=>  
                  {const capitalizedValue = capitalize(e.target.value); // Capitalize the input value
                 setFieldValue('suburb', capitalizedValue); // Set the field value with the capitalized value
                 handleBlur(e);
                  }}
                error={touched.suburb && Boolean(errors.suburb)}
                helperText={touched.suburb && errors.suburb}
                sx={{ gridColumn: "span 2" }}
              />
               <TextField
                name="city"
                label="City/Town"
                value={values.city}
                onChange={handleChange}
                onBlur={ (e)=>  
                  {const capitalizedValue = capitalize(e.target.value); // Capitalize the input value
                 setFieldValue('city', capitalizedValue); // Set the field value with the capitalized value
                 handleBlur(e);
                  }}
                error={touched.city && Boolean(errors.city)}
                helperText={touched.city && errors.city}
                sx={{ gridColumn: "span 2" }}
              />
               <TextField
                name="province"
                label="State/Province"
                value={values.province}
                onChange={handleChange}
                onBlur={ (e)=>  
                  {const capitalizedValue = capitalize(e.target.value); // Capitalize the input value
                 setFieldValue('province', capitalizedValue); // Set the field value with the capitalized value
                 handleBlur(e);
                  }}
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
            )}
            {showTimeFields&&(
              <>
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
              }}>
                Update
              </Button>
            </Box>
          </form>
        )}
      </Formik>
  );
};

export default Form;
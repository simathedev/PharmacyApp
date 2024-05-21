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
  useTheme,
  useMediaQuery,
  Card
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Loading from 'components/Loading';
import ProgressLoadWidget from 'components/widgets/ProgressLoadWidget';

const Form = () => {
  const navigate = useNavigate();
  const validationSchemaBasicInfo = yup.object().shape({
    firstName: yup.string().required('First name is required').min(2,'First name should atleast 2 characters'),
    lastName: yup.string().required('Last name is required').min(2,'Last name should atleast 2 characters'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().required('Phone number is required').min(10, 'Phone number must be at least 10 characters'),
  });

  const validationSchemaAddress = yup.object().shape({
    streetAddress: yup.string().required('Street address is required'),
    suburb: yup.string().required('Suburb is required'),
    city: yup.string().required('City/Town is required'),
    province: yup.string().required('State/Province is required'),
    postalCode: yup.string().required('Postal code is required'),
  });

  const validationSchemaPassword = yup.object().shape({
    password: yup.string().required('Password is required'),
  });

  const role = useSelector((state) => state.auth.role);
  const isNonMobile = useMediaQuery("(min-width:600px)");
 const [initialValues, setInitialValues] = useState({});
const [validationSchema, setValidationSchema] = useState(yup.object());
 const {id}=useParams();
  const [user, setUser] = useState([]);
  const [medications, setMedications] = useState([]);
  const [showBasicInfoFields, setShowBasicInfoFields] = useState(false);
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isLoading, setIsLoading]=useState(true);
  const [isSaving,setIsSaving]=useState(false);
  const token = useSelector((state) => state.auth.token);
  const { palette } = useTheme();
  useEffect(() => {

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3001/user/getUser/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const userData = await response.json();
          console.log("usersData in update page:",userData)
          setUser(userData)
        
        } else {
          console.log('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
 
    fetchUser();
   
  }, [token]);

  
  const setInitialValuesAndValidationSchema = (showBasicInfoFields, showAddressFields, showPasswordFields,user) => {
    if (!user || Object.keys(user).length === 0) {
      return;
    }

    if (!showBasicInfoFields && !showAddressFields && !showPasswordFields) {
      const [streetAddress, suburb, city, province, postalCode] = user.streetAddress.split(",");

      setInitialValues({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        streetAddress: streetAddress || '',
        suburb: suburb || '',
        city: city || '',
        province: province || '',
        postalCode: postalCode || '',
        password: '',
      });
      setValidationSchema(validationSchemaBasicInfo);
    }
    else
    {
      switch (true) {
        case showBasicInfoFields:
          setInitialValues({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',})
          setValidationSchema(validationSchemaBasicInfo);
          break;
        case showAddressFields:
          const [streetAddress, suburb, city, province, postalCode] = user.streetAddress.split(",");
          setInitialValues({
            streetAddress: streetAddress || '',
            suburb: suburb || '',
            city: city || '',
            province: province || '',
            postalCode: postalCode || '',
          })
          setValidationSchema(validationSchemaAddress);
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
    setIsLoading(false);
  }
  useEffect(() => {
    setInitialValuesAndValidationSchema(showBasicInfoFields, showAddressFields, showPasswordFields,user);
  }, [showBasicInfoFields, showAddressFields, showPasswordFields,user]);


  const handleBasicInfoClick = () => {
    setShowBasicInfoFields(!showBasicInfoFields);
    setShowAddressFields(false);
    setShowPasswordFields(false);
};

const handleAddressClick = () => {
    setShowBasicInfoFields(false);
    setShowAddressFields(!showAddressFields);
    setShowPasswordFields(false);
};

const handlePasswordClick = () => {
    setShowBasicInfoFields(false);
    setShowAddressFields(false);
    setShowPasswordFields(!showPasswordFields);
};


  const updateUser = async (values, onSubmitProps) => {
    try {
      const userResponse = await fetch(`http://localhost:3001/user/updateUser/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (userResponse.ok) {
        setIsSaving(false);
        onSubmitProps.resetForm();
        navigate("/manage/users");
        toast.success('User Successfully Updated.', { 
        
          autoClose: 5000, // Duration before the notification automatically closes (in milliseconds)
          hideProgressBar: true, // Whether to hide the progress bar
          closeOnClick: true, // Whether clicking the notification closes it
          pauseOnHover: true, // Whether hovering over the notification pauses the autoClose timer
          draggable: true, // Whether the notification can be dragged
          progress: undefined, // Custom progress bar (can be a React element)
          theme:"colored"
        });

      } else {
        setIsSaving(false);
        console.log('Failed to submit the user form');
        toast.error('User Update Unsuccessful', {
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
      setIsSaving(false);
      console.error('Error in user function:', error);
      toast.error('User Update Unsuccessful', {
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
  const capitalize = (value) => {
    //if (!value) return value;
   // return value.charAt(0).toUpperCase() + value.slice(1);
   if (!value) return value;
    return value
      .split(' ') // Split the sentence into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(' '); // Join the words back into a sentence
};

  const handleSubmit = async (values, onSubmitProps) => {
    try {
      setIsSaving(true);
      console.log('Submitting update user:', values);
      if(showAddressFields)
      {
        const concatenatedAddress = {streetAddress:`${values.streetAddress},${values.suburb},${values.city},${values.province},${values.postalCode}`};
      // console.log("user in handle submit: ",concatenatedAddress);
        await updateUser(concatenatedAddress, onSubmitProps);
      }
      else
    {
      ///console.log("user in handle submit: ",values)
      await updateUser(values, onSubmitProps);
    }
     
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
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={handleSubmit}
    enableReinitialize={true}
  >
    {({
      values,
      errors,
      touched,
      setFieldValue,
      handleChange,
      handleBlur,
      handleSubmit,
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
          <ProgressLoadWidget name='User' text='Updating'/>

        </Card>
        )}

           {/*<Button 
              onClick={handleBasicInfoClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showBasicInfoFields ? "Hide Basic Info" : "Edit Basic Info"}
            </Button>

            <Button 
             onClick={handleAddressClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showAddressFields ? "Hide Address" : "Edit Address"}
            </Button>

            <Button 
               onClick={handlePasswordClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showPasswordFields ? "Hide Password" : "Edit Password"}
      </Button>
      <Button
              onClick={handleButtonClick('basicInfo')}
              sx={{ gridColumn: "span 4" }}
            >
              {showBasicInfoFields ? "Hide Basic Info" : "Edit Basic Info"}
            </Button>

            <Button
              onClick={handleButtonClick('address')}
              sx={{ gridColumn: "span 4" }}
            >
              {showAddressFields ? "Hide Address" : "Edit Address"}
            </Button>

            <Button
              onClick={handleButtonClick('password')}
              sx={{ gridColumn: "span 4" }}
            >
              {showPasswordFields ? "Hide Password" : "Edit Password"}
            </Button>*/}

            
<Button
        onClick={handleBasicInfoClick}
        sx={{ gridColumn: 'span 4' }}
      >
        {showBasicInfoFields ? 'Hide Basic Info' : 'Edit Basic Info'}
      </Button>

      <Button
        onClick={handleAddressClick}
        sx={{ gridColumn: 'span 4', display: showBasicInfoFields ? 'none' : 'block' }}
      >
        {showAddressFields ? 'Hide Address' : 'Edit Address'}
      </Button>

      <Button
        onClick={handlePasswordClick}
        sx={{ gridColumn: 'span 4', display: showBasicInfoFields ? 'none' : 'block' }}
      >
        {showPasswordFields ? 'Hide Password' : 'Edit Password'}
      </Button>


         {showBasicInfoFields&&(
          <>
 <TextField
 label="First name"
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
 label="Last name"
 name="lastName"
 value={values.lastName}
 onChange={handleChange}
 onBlur={(e)=>  
  {const capitalizedValue = capitalize(e.target.value); // Capitalize the input value
 setFieldValue('lastName', capitalizedValue); // Set the field value with the capitalized value
 handleBlur(e);
  }
}
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
</>
         )}

      {showAddressFields&&(
<>
  <TextField
  name="streetAddress"
  label="Street Address"
  value={values.streetAddress}
  onChange={handleChange}
  onBlur={
  (e)=>{const capitalizedValue = capitalize(e.target.value); // Capitalize the input value
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
  onBlur={(e)=>  
    {const capitalizedValue = capitalize(e.target.value); // Capitalize the input value
   setFieldValue('suburb', capitalizedValue); // Set the field value with the capitalized value
   handleBlur(e);}}
  error={touched.suburb && Boolean(errors.suburb)}
  helperText={touched.suburb && errors.suburb}
  sx={{ gridColumn: "span 2" }}
/>
 <TextField
  name="city"
  label="City/Town"
  value={values.city}
  onChange={handleChange}
  onBlur={
    (e)=>{const capitalizedValue = capitalize(e.target.value); // Capitalize the input value
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
  onBlur={(e)=>  
    {const capitalizedValue = capitalize(e.target.value); // Capitalize the input value
   setFieldValue('province', capitalizedValue); // Set the field value with the capitalized value
   handleBlur(e);}}
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

         {showPasswordFields&&(
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
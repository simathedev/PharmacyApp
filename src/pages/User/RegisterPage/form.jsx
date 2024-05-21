import React, { useState,useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import FlexBetween from "components/FlexBetween";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import { toast } from 'react-toastify';
import ProgressLoadWidget from "components/widgets/ProgressLoadWidget";



const userSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  IDNumber: yup.string().required('ID number is required').min(5, 'ID number is too short').max(15, 'ID number is too long'),
  email: yup.string().required('Email is required').email('Enter a valid email'),
  phoneNumber: yup.string().max(10, 'Phone number should be 10 digits or less'),
  streetAddress: yup.string().required('Street address is required'),
  password: yup.string().required('Password is required').min(5, 'Password is too short').max(10, 'Password is too long'),
  picture: yup.string(),
});
const pharmacistSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup.string().required('Password is required').min(5, 'Password is too short').max(10, 'Password is too long'),
  practiceNumber:yup.string(),
  pharmacy:yup.string(),
  picture: yup.string(),
});
const initialValuesUser = {
    firstName: '',
    lastName: '',
    IDNumber: '',
    email: '',
    phoneNumber: '',
    streetAddress: '',
    password:'',
};
const initialValuesPharmacist = {
  firstName: '',
  lastName: '',
  email: '',
  password:'',
  practiceNumber:'',
  pharmacy:'',
  picture: '',
};

const Form = () => {
 const [pageType, setPageType] = useState("login");
  //const [userType, setUserType] = useState("user");
  const [pharmacies, setPharmacies] = useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let {userType}=useParams();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const isUser = userType === "user";
  const isPharmacist = userType === "pharmacist";
  const isAdmin=userType==="admin";
  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await fetch('http://localhost:3001/pharmacy/getPharmaciesRegistration', {
          method: "GET",
          /*headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },*/
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

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picture", values.picture.name);
    console.log("formdata in login: ", formData);
    let apiUrl;
    if (userType === "user") {
      apiUrl = "http://localhost:3001/auth/register";
    } else if (userType === "pharmacist") {
      apiUrl = "http://localhost:3001/auth/registerPharmacist";
    }
    console.log('apiurl: ', apiUrl);
    
    try {
      const savedUserResponse = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      const savedUser = await savedUserResponse.json();
      onSubmitProps.resetForm();
  
      if (savedUser) {
        setIsLoading('false');
        setPageType("login");
        //login code:
        navigate(`/signIn/${userType}`);
        toast.success('User Successfully Registered!', {
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
      else{
        toast.error('User Registration Unsuccessful. Please Try Again Later.', {
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
      console.error('Error saving user:', error);
      toast.error('Network Error! Failed To Register User. Please Try Again Later.', {
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
      setIsLoading(true);
      const concatenatedAddress = `${values.streetAddress},${values.suburb},${values.city},${values.province},${values.postalCode}`;
      const updatedValues = {
        ...values,
        streetAddress: concatenatedAddress, // Add the concatenated address as streetAddress property
      };
      console.log('Submitting registration:', updatedValues);
      await register(updatedValues, onSubmitProps);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  
  if (isLoading)
  {
    return <ProgressLoadWidget name='please wait' text='registering, '/>
  }
if(isAdmin)
{
  return <Typography variant='h5' color='primary' fontWeight='bold'>You Are Not Authorized To Perform This action.</Typography>
}
  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={ isUser?initialValuesUser:initialValuesPharmacist}
      validationSchema={isUser?userSchema:pharmacistSchema}
    >
      {({ 
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
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
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                  <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
            {isPharmacist&&(
              <>
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
              </>
            )} 
                {isUser&&(
                <>
                <TextField
                  label="Identification Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.IDNumber}
                  name="IDNumber"
                  error={Boolean(touched.IDNumber) && Boolean(errors.IDNumber)}
                  helperText={touched.IDNumber && errors.IDNumber}
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
                )}
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
                        sx={{ "&:hover": { cursor: "pointer" } ,gridColumn: "span 4"}}
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
                            </>
          
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {"REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                navigate(`/signIn/${userType}`);
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {"Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
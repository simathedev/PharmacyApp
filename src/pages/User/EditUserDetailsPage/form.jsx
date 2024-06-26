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
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import { toast } from 'react-toastify';
import ProgressLoadWidget from "components/widgets/ProgressLoadWidget";
import { DataArray } from "@mui/icons-material";
import Loading from "components/Loading";
import FlexBetween from "components/FlexBetween";



const passwordSchema = yup.object().shape({
  password: yup.string().required("Password is required").min(5,'password should be atleast 5 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match") 
    .required("Confirm Password is required"),
});

const basicInfoSchema= yup.object().shape({
    email: yup.string().required('Email is required').email('Enter a valid email'),
    phoneNumber: yup.string().max(10, 'Phone number should be 10 digits'),
    picture: yup.string(),
  });
  const addressSchema = yup.object().shape({
    streetAddress: yup.string().required('Street address is required'),
  });
  const paymentSchema = yup.object().shape({
    cardNumber: yup.string().max(16, 'card number should be 16 digits'),
    cardholder:yup.string(),
    expirationDate:yup.string(),
    cvv:yup.string(),
  });


/*const initialValuesAddress = {
  streetAddress: "",
};
const initialValuesBasicInfo = {
    email: "",
    phoneNumber: "",
  };
  const initialValuesPassword= {
    password: "",
  };*/

const Form = () => {
    const { field } = useParams();
    console.log('field: ',field);
  const { palette } = useTheme();
  const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    const primary=theme.palette.primary.main;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let apiUrlSegment=process.env.NODE_ENV === 'production' ?
  `https://pharmacy-app-api.vercel.app`
  :
  `http://localhost:3001`

  const[isLoading,setIsLoading]=useState(true);
  const[isSaving,setIsSaving]=useState(false);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const role=useSelector((state)=>state.auth.role);

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [responseData,setResponseData]=useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [validationSchema, setValidationSchema] = useState(yup.object());
  console.log("role in edit page: ",role);
  console.log("pharmacist in edit page")
  let id;
  id=user?._id;

  const password = async (values, onSubmitProps) => {
    let fetchStatement;
    if(role==='admin')
    {
     fetchStatement= `${apiUrlSegment}/admin/updateAdminInfo/${id}`
    }
    else if(role==='pharmacist')
    {
      fetchStatement=`${apiUrlSegment}/pharmacist/updatePharmacistInfo/${id}`
    }
    else
    {
      fetchStatement=`${apiUrlSegment}/user/updatePassword/${id}`

    }
    const passwordResponse = await fetch(fetchStatement, {
      method: "PUT",
      headers: {  Authorization: `Bearer ${token}`,"Content-Type": "application/json" },
      body: JSON.stringify(values),
  });
  const savedUser=await passwordResponse.json();
    onSubmitProps.resetForm();

    if (savedUser){
      //setPageType("login");
      navigate('/view/account');
      toast.success('Password Successfully Updated.', { 
        // Position of the notification
        autoClose: 5000, // Duration before the notification automatically closes (in milliseconds)
        hideProgressBar: true, // Whether to hide the progress bar
        closeOnClick: true, // Whether clicking the notification closes it
        pauseOnHover: true, // Whether hovering over the notification pauses the autoClose timer
        draggable: true, // Whether the notification can be dragged
        progress: undefined, // Custom progress bar (can be a React element)
        theme:"colored",
        // Other options for customizing the notification
      });
    }
    else{
      navigate('/view/account');
      toast.error('Password Update Unsuccessful.', { 
        // Position of the notification
        autoClose: 5000, // Duration before the notification automatically closes (in milliseconds)
        hideProgressBar: true, // Whether to hide the progress bar
        closeOnClick: true, // Whether clicking the notification closes it
        pauseOnHover: true, // Whether hovering over the notification pauses the autoClose timer
        draggable: true, // Whether the notification can be dragged
        progress: undefined, // Custom progress bar (can be a React element)
        theme:"colored",
        // Other options for customizing the notification
      });
    }
  }


    const basicInfo = async (values, onSubmitProps) => {
      let fetchStatement;
      if(role==='admin')
      {
       fetchStatement= `${apiUrlSegment}/admin/updateAdminInfo/${id}`
      }
      else if(role==='pharmacist')
      {
        fetchStatement=`${apiUrlSegment}/pharmacist/updatePharmacistInfo/${id}`
      }
      else
      {
        fetchStatement=`${apiUrlSegment}/user/updateBasicInfo/${id}`

      }
    
        const basicInfoResponse = await fetch(fetchStatement, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const savedUser=await basicInfoResponse.json();
        console.log("basic info reponse: ",savedUser);
    onSubmitProps.resetForm();

    if (savedUser){
      //setPageType("login");
        navigate('/view/account');
      toast.success('Basic Info Successfully Updated.', { 
        // Position of the notification
        autoClose: 5000, // Duration before the notification automatically closes (in milliseconds)
        hideProgressBar: true, // Whether to hide the progress bar
        closeOnClick: true, // Whether clicking the notification closes it
        pauseOnHover: true, // Whether hovering over the notification pauses the autoClose timer
        draggable: true, // Whether the notification can be dragged
        progress: undefined, // Custom progress bar (can be a React element)
        theme:"colored",
        // Other options for customizing the notification
      });
    }
    else{
      toast.error('Basic Info Update Unsuccessful', {
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


        const address = async (concatenatedAddress, onSubmitProps) => {
            const addressResponse = await fetch(`${apiUrlSegment}/user/updateAddress/${id}`, {
              method: "PUT",
              headers: {  Authorization: `Bearer ${token}`,"Content-Type": "application/json" },
              body: JSON.stringify(concatenatedAddress),
            });
            const savedUser=await addressResponse.json();
            onSubmitProps.resetForm();
        
            if (savedUser){
              //setPageType("login");
            }
          }

          const getUserDetails=async(id)=>{
            try{
              setIsLoading(true);
              console.log("id:",id)
              let fetchStatement;
              if(role==='admin')
              {
               fetchStatement= `${apiUrlSegment}/admin/${id}`
                         }
              else if(role==='pharmacist')
              {
                fetchStatement=`${apiUrlSegment}/pharmacist/getPharmacist/${id}`
                          }
              else
              {
                fetchStatement=`${apiUrlSegment}/user/getUser/${id}`
  
              }
              const apiUrl=fetchStatement;
                      const response = await fetch(
                        apiUrl, {
                          method: "GET",
                          headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json",
                          },
                      });
                      const data = await response.json();
          
                        if(response.ok)
                        {
                          setIsLoading(false);
                          setResponseData(data);
                          console.log("response data from update user page: ",data);
                       
                        }
            }
            catch(error)
            {
              setIsLoading(false);
              console.error("error fetching user details: ",error)
            }
            
                  
          
                 
            
                  
                }
            
               useEffect(()=>{
                getUserDetails(id);
            
                        },[id]);

                       /* const setInitialValuesAndValidationSchema = (orderInfo, showOrderInfoFields, showDeliveryTypeFields, showOrderStatusField) => {
                        })*/                  
                        const setInitialValuesBasedOnField = () => {
                          console.log("Field:", field);
                          console.log("Response Data in setInitialValuesBasedOnField:", responseData);
                          if (responseData){
                            //const [streetAddress, suburb, city, province, postalCode] = responseData?.streetAddress?.split(",");
                            setInitialValues({
                              email: responseData?.email || "",
                              phoneNumber: responseData?.phoneNumber || "",
                              cardNumber:"",
                              cardHolder:"",
                              expirationDate:"",
                              cvv:"",
                              streetAddress: "",
                              suburb:"",
                              city:"",
                              province:"",
                              postalCode:"",
                              password: "",
                              confirmPassword: "",
                              picture:responseData?.picture|| "",
                            })
                          
                            switch (field) {
                              case "basicInfo":
                                console.log("field is basic info")
                                setInitialValues({
                                  email: responseData?.email || "",
                                  phoneNumber: responseData?.phoneNumber || "",
                                  picture:responseData?.picture|| "",
                                });
                                setValidationSchema(basicInfoSchema);
                              
                                break;
                                case "payment":
                                  console.log("field is payment details")
                                  setInitialValues({
                                    cardNumber:"",
                                    cardHolder:"",
                                    expirationDate:"",
                                    cvv:"",
                                  });
                                  setValidationSchema(paymentSchema);
                               
                                  break;
                              case "address":
                                  console.log("field is address details")
                                if(responseData?.streetAddress){
                                  const [streetAddress, suburb, city, province, postalCode] = responseData.streetAddress.split(",");
                                
                                setInitialValues({
                                  streetAddress:streetAddress || "",
                                  suburb: suburb || "",
                                  city: city || "",
                                  province: province || "",
                                  postalCode: postalCode || "",
                                });
                              }
                                setValidationSchema(addressSchema);
                              
                                break;
                              case "password":
                                console.log("field is password details")
                                setInitialValues({
                                  password: "",
                                  confirmPassword: "",
                                });
                                setValidationSchema(passwordSchema);
                                break;
                              default:
                                break;
                            }
                          }
                          setIsLoading(false);
                        }
                          useEffect(() => {
                            //console.log("field in profile page: ",field)
                            setInitialValuesBasedOnField();
                          }, [field, responseData]);
                          

          const handleFormSubmit = async (values, onSubmitProps) => {
            setIsSaving(true);
            console.log("values: ", values)
            switch (field) {
              case "basicInfo":
                console.log("basic info: ",values)
                await basicInfo(values, onSubmitProps);
                break;
              case "address":
                const concatenatedAddress = {streetAddress:`${values.streetAddress},${values.suburb},${values.city},${values.province},${values.postalCode}`};
                await address(concatenatedAddress, onSubmitProps);
                break;
              case "password":
                await password(values, onSubmitProps);
                break;
              default:
                break;
            }
          };

  {/*const handleFormSubmit = async (values, onSubmitProps) => {
  await address(values, onSubmitProps);
  await password(values, onSubmitProps);
  await basicInfo(values, onSubmitProps);

  };*/}
  if (isLoading)
  {
    return <Loading/>
  }
  if(isSaving)
  {
    return (
      <>
       if(field==='address')
      {
        <ProgressLoadWidget name='address' text='saving' />

      }
      else if (field==='basicInfo')
      {
        <ProgressLoadWidget name='basic info' text='saving'/>

      }
      else if(field==='password')
      {
        <ProgressLoadWidget name='password' text='saving'/>

      }
      </>
     

    )
  }

  return (
    <Formik
    enableReinitialize={true}
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
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
        {field === "basicInfo" && (
            <Box sx={{display:'flex',flexDirection:'column',gap:2}}>
                  <Typography variant={isNonMobile?'h3':'h4'} color='primary'>Edit Basic Info</Typography>
              
              <TextField
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              {role==='user'&&(
                <TextField
                name="phoneNumber"
                label="Phone Number"
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
              />
              )}


  <Box>
  {/* Label for Profile Picture */}
  <Typography variant="subtitle2" sx={{ mb: 1 }}>Profile Picture</Typography>            
  <Dropzone
  acceptedFiles=".jpg,.jpeg,.png"
  multiple={false}
  onDrop={(acceptedFiles) =>
    setFieldValue("picture", acceptedFiles[0]?.name || "") // Set picture to file name
  }
>
  {({ getRootProps, getInputProps }) => (
    <Box
      {...getRootProps()}
      border={`2px dashed ${palette.primary.main}`}
      p="1rem"
      sx={{ gridColumn: "span 4", "&:hover": { cursor: "pointer" } }}
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
</Box>

              
            </Box>
          )}
          {field === "address" && (
            <Box sx={{display:'flex',flexDirection:'column',gap:2}}>
            <Typography variant={isNonMobile?'h3':'h4'} color='primary'>Edit Address</Typography>
              <TextField
                name="streetAddress"
                label="Street Address"
                value={values.streetAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.streetAddress && Boolean(errors.streetAddress)}
                helperText={touched.streetAddress && errors.streetAddress}
              />
               <TextField
                name="suburb"
                label="Suburb"
                value={values.suburb}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.suburb && Boolean(errors.suburb)}
                helperText={touched.suburb && errors.suburb}
              />
               <TextField
                name="city"
                label="City/Town"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.city && Boolean(errors.city)}
                helperText={touched.city && errors.city}
              />
               <TextField
                name="province"
                label="State/Province"
                value={values.province}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.province && Boolean(errors.province)}
                helperText={touched.province && errors.province}
              />
                <TextField
                name="postalCode"
                label="Postal Code"
                value={values.postalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.postalCode && Boolean(errors.postalCode)}
                helperText={touched.postalCode && errors.streetAddress}
              />
            </Box>
          )}
           {field === "payment" && (
            <Box sx={{display:'flex',flexDirection:'column',gap:2}}>
                  <Typography variant={isNonMobile?'h3':'h4'} color='primary'>Edit Payment Info</Typography>
                  <TextField
                name="cardNumber"
                label="Card Number"
                value={values.cardNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cardNumber && Boolean(errors.cardNumber)}
                helperText={touched.cardNumber && errors.cardNumber}
              />
               <TextField
                name="cardHolder"
                label="Card Holder Name"
                value={values.cardHolder}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cardHolder && Boolean(errors.cardHolder)}
                helperText={touched.cardHolder && errors.cardHolder}
              />
               <TextField
                name="expirationDate"
                label="Expiration Date"
                value={values.expirationDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.expirationDate && Boolean(errors.expirationDate)}
                helperText={touched.expirationDate && errors.expirationDate}
              />
               <TextField
                name="cvv"
                label="CVV"
                value={values.cvv}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cvv && Boolean(errors.cvv)}
                helperText={touched.cvv && errors.cvv}
              />
            </Box>
          )}
         {field === "password" && (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Typography variant={isNonMobile?'h3':'h4'} color='primary'>Edit Password</Typography>
    <TextField
      type="password"
      name="password"
      label="Password"
      value={values.password}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.password && Boolean(errors.password)}
      helperText={touched.password && errors.password}
    />
    <TextField
      type="password"
      name="confirmPassword"
      label="Confirm New Password"
      value={values.confirmPassword}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.confirmPassword && Boolean(errors.confirmPassword)}
      helperText={touched.confirmPassword && errors.confirmPassword} // Display validation errors for confirmPassword field
    />
  </Box>
)}
<Box sx={{py:2}}>
<Button type="submit" variant="contained" sx={{color:alt}}>Update</Button>
</Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
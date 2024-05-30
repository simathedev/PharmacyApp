import React from 'react'
import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import {
    Box,
    Button,
    useMediaQuery,
    Typography,
    TextField,
    Autocomplete,
    FormControlLabel,
    Checkbox,
    MenuItem,
    useTheme,
  } from '@mui/material';
  import { useDispatch,useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import { toast } from 'react-toastify';
  
  const Form = ({ section, values,onSubmit }) => {
const [initialValues, setInitialValues] = useState({});
const [validationSchema, setValidationSchema] = useState(yup.object());

    const deliverySchema = yup.object().shape({
      streetAddress: yup.string().required('Street address is required'),
      suburb: yup.string().required('Suburb is required'),
      city: yup.string().required('City/Town is required'),
      province: yup.string().required('State/Province is required'),
      postalCode: yup.string().required('Postal code is required'),
      userPhoneNumber:yup.string().required("Phone number is required."),
     });
    const collectionSchema = yup.object().shape({
        userPhoneNumber:yup.string().required("Phone number is required."),
        //pharmacy: yup.string(),
        });
        const cardSchema = yup.object().shape({
          cardNumber:yup.string().required("Phone number is required."),
          cardHolder: yup.string(),
          cardCVV:yup.string(),
          expirationDate:yup.string(),
          });

    /*const initialValues = {
     user:'',
     medication:'',
    userAddress:'',
    userPhoneNumber:'',
   deliveryType:'',
   pharmacy: '', 
  orderStatus:''
    };*/

    let apiUrlSegment=process.env.NODE_ENV === 'production' ?
    `https://pharmacy-app-api.vercel.app`
    :
    `http://localhost:3001`

    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [medications, setMedications] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);
    const token = useSelector((state) => state.auth.token);
    const user=useSelector((state)=>state.auth.user);
    const userID=user._id
    console.log('user: ',user);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const { palette } = useTheme();
    const navigate = useNavigate();


    useEffect(() => {
          const fetchPharmacies = async () => {
            try {
              const response = await fetch(`${apiUrlSegment}/pharmacy/getPharmacies`, {
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

      useEffect(() => {
        switch (section) {
          case 'pharmacy':
            setInitialValues({
            userPhoneNumber:user.phoneNumber||'',
            //pharmacy: '',
            })
            setValidationSchema(collectionSchema);
            break;
          case 'address':
            const [streetAddress, suburb, city, province, postalCode] = user.streetAddress.split(",");
            setInitialValues({
              streetAddress:streetAddress||'',
              suburb:suburb||'',
              city:city||'',
              province:province||'',
              postalCode:postalCode||'',
              userPhoneNumber:user.phoneNumber||'',
            })
            setValidationSchema(deliverySchema);
            break;
            case 'card':
         
            setInitialValues({
              cardNumber:'',
              cardHolder:'',
              cardCVV:'',
              expDate:'',
            })
            setValidationSchema(cardSchema);
            break;
          default:
            setValidationSchema(yup.object());
        }
      }, [section]);
  
   

   
    return (
      <Formik
      enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values)=>onSubmit(values)}
        //onSubmit={handleSubmit}
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
             marginY='1rem'
             gridTemplateColumns="repeat(4, minmax(0, 1fr))"
             sx={{
               "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
             }}
            >
                {section === 'pharmacy' && (
                    <>
            <TextField
                label="Phone Number"
                name="userPhoneNumber"
                value={values.userPhoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.userPhoneNumber && Boolean(errors.userPhoneNumber)}
                helperText={touched.userPhoneNumber && errors.userPhoneNumber}
                margin="normal"
                variant="outlined"
                sx={{ gridColumn: "span 4" }}
              />
                    </>
                )}
 {section === 'address' && (
    <>
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
                label="Phone Number"
                name="userPhoneNumber"
                value={values.userPhoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.userPhoneNumber && Boolean(errors.userPhoneNumber)}
                helperText={touched.userPhoneNumber && errors.userPhoneNumber}
                margin="normal"
                variant="outlined"
                sx={{ gridColumn: "span 4" }}
              />
    </>
 )}
{section === 'card'&&(
<>
<TextField
                name="cardHolder"
                label="Card Holder"
                value={values.cardHolder}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cardHolder && Boolean(errors.cardHolder)}
                helperText={touched.cardHolder && errors.cardHolder}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                name="cardNumber"
                label="card number"
                value={values.cardNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cardNumber && Boolean(errors.cardNumber)}
                helperText={touched.cardNumber && errors.cardNumber}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                name="expDate"
                label="Expiration Date"
                value={values.expDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.expDate && Boolean(errors.expDate)}
                helperText={touched.expDate && errors.expDate}
                sx={{ gridColumn: "span 2" }}
              /><TextField
              name="cardCVV"
              label="CVV"
              value={values.cardCVV}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.cardCVV && Boolean(errors.cardCVV)}
              helperText={touched.cardCVV && errors.cardCVV}
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
  




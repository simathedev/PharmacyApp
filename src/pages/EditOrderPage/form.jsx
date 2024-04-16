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
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import Dropzone from 'react-dropzone';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FlexBetween from "components/FlexBetween";
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Form = () => {

  const orderInfoSchema = yup.object().shape({
    //medication: yup.string().required("Medication is required"),
    //userAddress:yup.string().required("Delivery Address is required"),
    userPhoneNumber:yup.string().required("Phone number is required."),
     // pharmacy: yup.string(),
      });

      const deliveryTypeSchema = yup.object().shape({
        deliveryType:yup.string().required("Delivery type is required"),
      });

    const orderStatusSchema = yup.object().shape({
      orderStatus:yup.string().required("Order status is required"),
      });

  const { palette } = useTheme();
  const {id} = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({});
  const [validationSchema, setValidationSchema] = useState(yup.object());
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [pharmacies, setPharmacies] = useState([]);

  const [orderInfo, setOrderInfo] = useState([]);
  const [pharmacyMedications, setPharmacyMedications] = useState([]);
  const [showOrderInfoFields, setShowOrderInfoFields] = useState(false);
  const [showOrderCollectionFields, setShowOrderCollectionFields] = useState(false);
  const [showOrderDeliveryFields, setShowOrderDeliveryFields] = useState(false);
  const [showDeliveryTypeFields, setShowDeliveryTypeFields] = useState(false);
  const [showOrderStatusField, setShowOrderStatusField] = useState(false);
  const token = useSelector((state) => state.auth.token);
  let deliveryType='';

  useEffect(() => {
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
           setPharmacyMedications(medicationData);
           console.log("medication data in edit order page: ",medicationData)

          } else {
            console.log('Failed to fetch medication');
          }
        } catch (error) {
          console.error('Error fetching medication:', error);
        }
      };
      const fetchOrder = async () => {
        try {
          const response = await fetch(`http://localhost:3001/order/getPharmacyOrder/${id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const orderData = await response.json();
           
            setOrderInfo(orderData);
            console.log('order data: ',orderData);
            //setMedications(medicationData.map((user) => ({ id: user._id, name: user.name })));
          } else {
            console.log('Failed to fetch order');
          }
        } catch (error) {
          console.error('Error fetching order:', error);
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
      fetchOrder();
    fetchMedications();
  }, [token]);

  const setInitialValuesAndValidationSchema = (orderInfo, showOrderInfoFields, showDeliveryTypeFields, showOrderStatusField) => {
    if (!orderInfo || Object.keys(orderInfo).length === 0) {
      return;
    }
    const [streetAddress, suburb, city, province, postalCode] = orderInfo.userAddress.split(",");
    const initialMedications = orderInfo.medications.map(item => ({
      _id: item.medication._id,
      name: item.medication.name,
      quantity:item.quantity,
    }));
    
    if (!showOrderInfoFields && !showDeliveryTypeFields && !showOrderStatusField) {
    
      setInitialValues({
        medications: initialMedications|| [],
        pharmacy: orderInfo.pharmacy || '',
        userPhoneNumber: orderInfo.userPhoneNumber || '',
        streetAddress: streetAddress || '',
        suburb: suburb || '',
        city: city || '',
        province: province || '',
        postalCode: postalCode || '',
        deliveryType: orderInfo.deliveryType || '',
        orderStatus: orderInfo.orderStatus || '',
      });
      setValidationSchema(orderInfoSchema);
    } else {
      switch (true) {
        case showOrderInfoFields:
          console.log("this is the user address:", orderInfo.userAddress);
          const [streetAddress, suburb, city, province, postalCode] = orderInfo.userAddress.split(",");
          console.log("medication in order page: ",orderInfo.medications)
          setInitialValues({
            medications: initialMedications|| [],
            pharmacy: orderInfo.pharmacy._id || '', 
            userPhoneNumber: orderInfo.userPhoneNumber || '',
            streetAddress: streetAddress || '',
            suburb: suburb || '',
            city: city || '',
            province: province || '',
            postalCode: postalCode || '',
          });
          setValidationSchema(orderInfoSchema);
          break;
        case showDeliveryTypeFields:
          setInitialValues({
            deliveryType: orderInfo.deliveryType || '',
          });
          setValidationSchema(deliveryTypeSchema);
          break;
        case showOrderStatusField:
          setInitialValues({
            orderStatus: orderInfo.orderStatus || '',
          });
          setValidationSchema(orderStatusSchema);
          break;
        default:
          setValidationSchema(yup.object());
      }
    }
  };
  

  useEffect(() => {
    setInitialValuesAndValidationSchema(orderInfo, showOrderInfoFields, showDeliveryTypeFields, showOrderStatusField);
  }, [orderInfo, showOrderInfoFields, showDeliveryTypeFields, showOrderStatusField]);

  const updateOrder = async (values, onSubmitProps) => {
    try {
      const userResponse = await fetch(`http://localhost:3001/order/updateOrder/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (userResponse.ok) {
        onSubmitProps.resetForm();
        navigate("/manage/orders");
        toast.success('Order Successfully Updated.', { 
          autoClose: 5000,
          hideProgressBar: true, 
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true, 
          progress: undefined,
          theme:'colored'
        });

      } else {
        console.log('Failed to submit the order form');
        toast.error('Order Update Unsuccessful', {
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
      console.error('Error in order function:', error);
      toast.error('Order Update Unsuccessful', {
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
      const user=orderInfo.user;
      const concatenatedAddress = `${values.streetAddress},${values.suburb},${values.city},${values.province},${values.postalCode}`;
      console.log("user ID: ",user);
      const approved = values.approved && values.approved[0] === 'on';
      const dataToSend = {
        ...values,
        approved,
        user:user,
        userAddress:concatenatedAddress,
      };
      console.log('Submitting order:', dataToSend);
     await updateOrder(dataToSend, onSubmitProps);
     
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
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' '); // Join the words back into a sentence
  };
  
  const handleOrderInfoClick = () => {
    setShowOrderInfoFields(!showOrderInfoFields);
    setShowOrderStatusField(false);
    setShowDeliveryTypeFields(false);
  };
  
  const handleStatusClick = () => {
    setShowOrderStatusField(!showOrderStatusField);
    setShowOrderInfoFields(false);
    setShowDeliveryTypeFields(false);
  };
  
  const handleDeliveryClick = () => {
    setShowDeliveryTypeFields(!showDeliveryTypeFields);
    setShowOrderStatusField(false);
    setShowOrderInfoFields(false);
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
              onClick={handleOrderInfoClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showOrderInfoFields ? "Hide Order Info" : "Edit Order Info"}
            </Button>

            <Button 
              onClick={handleStatusClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showOrderStatusField ? "Hide Order Status":"Edit Order Status"}
            </Button>
            <Button 
              onClick={handleDeliveryClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showDeliveryTypeFields ? "Hide Delivery Type" : "Edit Delivery Type"}
            </Button>

       
          {showOrderInfoFields&&(
            <>


<Autocomplete
  multiple
  options={pharmacyMedications}
  getOptionLabel={(option) => option?.name || ''}
  onChange={(event, newValue) => {

    setFieldValue('medications', newValue ? newValue.map(med =>({ id:med._id,medication: med._id, name: med.name, quantity: med.quantity })) : []);
 
    console.log("new value in edit order form: ",newValue);
  }}
  value={values.medications}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Medications"
      name="medications"
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.medications && Boolean(errors.medications)}
      helperText={touched.medications && errors.medications}
      margin="normal"
      variant="outlined"
    />
  )}
  sx={{ gridColumn: "span 4" }}
/>

{values.medications.map((med, index) => (
    <Box key={index} display="flex" alignItems="center" gridColumn="span 4">
        <Typography>{med.name}</Typography>
        <TextField
            type="number"
            label="Quantity"
            value={med.quantity}
            onChange={(e) => {
                const updatedMedications = [...values.medications];
                updatedMedications[index].quantity = parseInt(e.target.value);
                setFieldValue('medications', updatedMedications);
            }}
            sx={{ ml: 2 }}
        />
    </Box>
))}


          
 <Autocomplete
              options={pharmacies}
              getOptionLabel={(option) => option.name}
              value={pharmacies.find((pharmacy) => pharmacy._id === values.pharmacy) || null}
              onChange={(event, newValue) => {
                handleChange({
                  target: {
                    name: 'pharmacy',
                    value: newValue ? newValue._id : '',
                  },
                });
               // (newValue ? newValue._id : '')
              }}
              onBlur={handleBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Pharmacy"
                  name="pharmacy"
                  error={touched.pharmacy && Boolean(errors.pharmacy)}
                  helperText={touched.pharmacy && errors.pharmacy}
                  margin="normal"
                  variant="outlined"
                />
              )}
              sx={{ gridColumn: "span 4" }}
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

          
         

{showOrderStatusField&&(
   <TextField
   select
   label="Order Status"
   name="orderStatus"
   value={values.orderStatus}
   onChange={handleChange}
   onBlur={handleBlur}
   error={touched.orderStatus && Boolean(errors.orderStatus)}
   helperText={touched.orderStatus && errors.orderStatus}
   margin="normal"
   variant="outlined"
   sx={{ gridColumn: "span 4" }}
 >
   <MenuItem value="">Select Order Status</MenuItem>
   {['pending', 'order successful', 'order cancelled', 'order being prepared', 'ready for collection', 'out for delivery', 'delivered', 'collected'].map((order) => (
     <MenuItem key={order} value={order}>
       {order}
     </MenuItem>
   ))}
 </TextField>
)}
       
{showDeliveryTypeFields&&(
 <TextField
 select
 label="Delivery Method"
 name="deliveryType"
 value={values.deliveryType}
 onChange={handleChange}
 onBlur={handleBlur}
 error={touched.deliveryType && Boolean(errors.deliveryType)}
 helperText={touched.deliveryType && errors.deliveryType}
 margin="normal"
 variant="outlined"
 sx={{ gridColumn: "span 4" }}
>
 <MenuItem value="">Select Delivery</MenuItem>
 {['collection', 'delivery'].map((delivery) => (
   <MenuItem key={delivery} value={delivery}>
     {delivery}
   </MenuItem>
 ))}
</TextField>
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



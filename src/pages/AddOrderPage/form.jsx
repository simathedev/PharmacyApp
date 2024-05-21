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
    Chip,
    MenuItem,
    useTheme,
    Card
  } from '@mui/material';
  import { useDispatch,useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import { toast } from 'react-toastify';
  import ProgressLoadWidget from 'components/widgets/ProgressLoadWidget';
  import Loading from 'components/Loading';


  const Form = () => {
    const orderSchema = yup.object().shape({
    user: yup.string().required("User is required"),
    medications: yup
   .array()
   .of(
     yup.object().shape({
       id: yup.string().required(),
       name: yup.string().required(),
     })
   )
   .required("Medication is required"),
   // userAddress:yup.string().required("Delivery Address is required"),
    userPhoneNumber:yup.string().required("Phone number is required."),
    deliveryType:yup.string().required("Delivery type is required"),
    pharmacy: yup.string(),
    orderStatus:yup.string().required("Order status is required"),
    });

    const initialValuesOrder = {
     user:'',
    medications:[],
    //userAddress:'',
    userPhoneNumber:'',
   deliveryType:'',
   pharmacy: '', 
  orderStatus:''
    };
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [isSaving,setIsSaving]=useState(false);
    const [medications, setMedications] = useState([]);
    const [pharmacies, setPharmacies] = useState([]);

    const [deliveryOption, setDeliveryOption] = useState('');
    const [selectedOrderPharmacy,setSelectedOrderPharmacy]=useState('');
    const [selectedPharmacyId, setSelectedPharmacyId] = useState('');
    const selectedPharmacy=useSelector((state)=>state.auth.pharmacy);
    const role= useSelector((state) => state.auth.role);
    const isPermitted=role==='pharmacist'||role==='admin';
    const isLargeScreen= useMediaQuery("(min-width:900px)");
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const token = useSelector((state) => state.auth.token);
    const { palette } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
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
              setUsers(usersData.map((user) => ({ id: user._id, firstName: user.firstName,lastName:user.lastName })));
            } else {
              console.log('Failed to fetch users');
            }
          } catch (error) {
            console.error('Error fetching users:', error);
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
        fetchUsers();
       
      
      }, [token]);

      useEffect(() => {
        const fetchMedications = async () => {
          try {
            let pharmacyId = '';
           //console.log('role chosen: ',role);
            if (role === 'admin') {
              pharmacyId = selectedPharmacyId;
            } 
            else if (role === 'pharmacist') {
              //console.log("pharmacy id in fetch medications: ",selectedPharmacy._id);
              pharmacyId = selectedPharmacy._id;
            }
            if (pharmacyId) {
              const response = await fetch(`http://localhost:3001/medication//getMedications/${pharmacyId}`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              if (response.ok) {
                const medicationData = await response.json();
                setMedications(medicationData.map((med) => ({ id: med._id, name: med.name })));
              } else {
                console.log('Failed to fetch medications');
              }
            }
          } catch (error) {
            console.error('Error fetching medications:', error);
          }
        };
      
        fetchMedications();
        setIsLoading(false);
      }, [token, role, selectedPharmacy,selectedPharmacyId])
  
    const order=async(values,onSubmitProps)=>{
      try {
      const orderResponse=await fetch(
        `http://localhost:3001/order/addOrder`,
        {
          method:"POST",
          headers: {
             Authorization: `Bearer ${token}`,
             "Content-Type": "application/json",
            },
          body:JSON.stringify(values),
        });
      if(orderResponse.ok){
        setIsSaving(false);
          onSubmitProps.resetForm();
          navigate("/manage/orders");
          toast.success('Order Successful', { 
            autoClose: 5000, // Duration before the notification automatically closes (in milliseconds)
            hideProgressBar: true, // Whether to hide the progress bar
            closeOnClick: true, // Whether clicking the notification closes it
            pauseOnHover: true, // Whether hovering over the notification pauses the autoClose timer
            draggable: true, // Whether the notification can be dragged
            progress: undefined, // Custom progress bar (can be a React element)
           theme:'colored',
          });
      }
      //if (goalData)
      else{
        setIsSaving(false);
          console.log("failed to submit the order form");
          toast.error('Order Unsuccessful', {
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

          // ...rest of the code
        } 
        catch (error) {
          setIsSaving(false);        
          console.error("Error in order function:", error);
          toast.error('Order Unsuccessful', {
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
        console.log('values in add order page: ',values);
   
       const concatenatedAddress = `${values.streetAddress},${values.suburb},${values.city},${values.province},${values.postalCode}`;
       if(role==='pharmacist'){
        const updatedValues = {
          ...values,
          userAddress: concatenatedAddress,
          pharmacy:selectedPharmacy._id, 
        };
        console.log('Submitting order values:', updatedValues);
      await order(updatedValues, onSubmitProps);
       }
       else{
        const updatedValues = {
          ...values,
          userAddress: concatenatedAddress, 
        };
        console.log('Submitting order values:', updatedValues);
      await order(updatedValues, onSubmitProps);
       }
      
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };

    return (
      <Formik
        initialValues={initialValuesOrder}
        validationSchema={orderSchema}
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
          <ProgressLoadWidget name='Order' text='Adding'/>

        </Card>
        )}
          {role==='admin'&&
            (
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
                setSelectedPharmacyId(newValue ? newValue._id : '')
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
            )}
              <Autocomplete
  options={users}
  getOptionLabel={(option) => (option && option.firstName+" "+option.lastName) || ''}
  onChange={(e, newValue) => {
    setFieldValue('user', newValue ? newValue.id : '');
  }}
    sx={{ gridColumn: "span 4" }}
  value={users.find((user) => user.id === values.user) || null}
  renderInput={(params) => (
    <TextField
      {...params}
      label="User"
      name="user"
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.user && Boolean(errors.user)}
      helperText={touched.user && errors.user}
      margin="normal"
      variant="outlined"
    
    />
  )}
  key={(option) => option.id} 
/>

<Autocomplete
  multiple
  options={medications}
  getOptionLabel={(option) => option.name}
  onChange={(event, newValue) => {
    setFieldValue('medications', newValue ? newValue.map(med => ({ id:med.id,medication: med.id, name: med.name, quantity: 1 })) : []);

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
  




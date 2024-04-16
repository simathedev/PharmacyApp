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
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Dropzone from 'react-dropzone';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FlexBetween from "components/FlexBetween";
import { useNavigate, useParams } from "react-router-dom";

const Form = () => {

  const medicationInfoSchema = yup.object().shape({
    name: yup.string().required('medication name is required'),
    quantity: yup.number(),
    price: yup.string(),
    category: yup.string().required('Category is required'),
    pharmacy: yup.string().required('Pharmacy is required'),
  });
  const medicationPictureSchema = yup.object().shape({
    picture: yup.string(),
  });
  const medicationInStockSchema = yup.object().shape({
    inStock: yup.boolean().required('Stock availability is required'),
  });

  const [medicationData, setMedicationData] = useState({});
  const [users, setUsers] = useState([]);
  const [medications, setMedications] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);

  const [showMedicationInfoFields, setShowMedicationInfoFields] = useState(false);
  const [showInStockFields, setShowInstockFields] = useState(false);
  const [showPharmacyFields, setShowPharmacyFields] = useState(false);
  const [showPictureFields, setShowPictureFields] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [validationSchema, setValidationSchema] = useState(yup.object());

  const token = useSelector((state) => state.auth.token);
  const { palette } = useTheme();
  const { id } = useParams();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();


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
  const fetchMedication = async () => {
    try {
      const response = await fetch(`http://localhost:3001/medication/getMedication/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const medications= await response.json();
        console.log("medication data:", medications)
        setMedicationData(medications);
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

  useEffect(() => {
    fetchPharmacies();
    fetchUsers();
    fetchMedications();
    fetchMedication();
  }, [token]);

  const setInitialValuesAndValidationSchema = (showMedicationInfoFields, showInStockFields, showPictureFields, medicationData) => {
    if (!medicationData || Object.keys(medicationData).length === 0) {
      return;
    }

    if (!showMedicationInfoFields && !showInStockFields && !showPictureFields) {
      setInitialValues({
        name: medicationData.name || '',
        quantity: medicationData.quantity || '',
        price: medicationData.price || '',
        category: medicationData.category || '',
        pharmacy: medicationData.pharmacy || '',
        picture: medicationData.picture || '',
        inStock: medicationData.inStock || '',
      });
      //setValidationSchema(validationSchemaBasicInfo);
    }
  else{
    switch (true) {
      case showMedicationInfoFields:
        setInitialValues({
          name: medicationData.name || '',
          quantity: medicationData.quantity || '',
          price: medicationData.price || '',
          category: medicationData.category || '',
          pharmacy: medicationData.pharmacy || '',
        })
        setValidationSchema(medicationInfoSchema);
        break;
      case showPictureFields:
        setInitialValues({
          picture: medicationData.picture || '',
        })
        setValidationSchema(medicationPictureSchema);
        break;
      case showInStockFields:
        setInitialValues({
          inStock: medicationData.inStock || '',
        })
        setValidationSchema(medicationInStockSchema);
        break;
      default:
        setValidationSchema(yup.object());
  }
}
  }

  useEffect(() => {
    setInitialValuesAndValidationSchema(showMedicationInfoFields, showInStockFields, showPictureFields, medicationData)
  }, [showMedicationInfoFields, showInStockFields, showPictureFields, medicationData]);
  
  const capitalize = (value) => {
    //if (!value) return value;
   // return value.charAt(0).toUpperCase() + value.slice(1);
   if (!value) return value;
    return value
      .split(' ') // Split the sentence into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(' '); // Join the words back into a sentence
  };
  
  const handleMedicationClick = () => {
    setShowMedicationInfoFields(!showMedicationInfoFields);
    setShowPictureFields(false);
    setShowInstockFields(false);
  };
  
  const handleInStockClick = () => {
    setShowInstockFields(!showInStockFields);
    setShowMedicationInfoFields(false);
    setShowPictureFields(false);
  };
  
  const handlePictureClick = () => {
    setShowPictureFields(!showPictureFields);
    setShowMedicationInfoFields(false);
    setShowInstockFields(false);
  };
  

  const updateMedication = async (values, onSubmitProps) => {
    try {
      const medicationResponse = await fetch(`http://localhost:3001/medication/updateMedication/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (medicationResponse.ok) {
        onSubmitProps.resetForm();
        navigate("/manage/medications");
        toast.success('Medication Successfully Updated.', { 
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
      } else {
        console.log('Failed to submit the medication form');
        toast.error('Medication Update Unsuccessful', {
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
      console.error('Error in medication function:', error);
      toast.error('medication Update Unsuccessful', {
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
      let dataToSend;
      let inStock;
      //when values.inStock is off it should change to out of stock
      //I should create additional buttons instead of just making
    //use of a checkbox
      if(showInStockFields){
inStock = values.inStock && values.inStock[0] === 'on';
dataToSend = {
  ...values,
  inStock,
};
      }
      else{
        dataToSend=values;
      }
      
      console.log('Submitting medication:', dataToSend);

      // Perform the submission logic here
     await updateMedication(dataToSend, onSubmitProps);
      //console.log('Submitting medication:', values);
      //await medication(values, onSubmitProps);
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
          // display="flex" flexDirection="column" alignItems="center"
          >

            <Button
              onClick={handleMedicationClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showMedicationInfoFields ? "Hide Medication Info" : "Edit Medication Info"}
            </Button>

            <Button
              onClick={handleInStockClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showInStockFields ? "Hide In Stock" : "Edit In Stock"}
            </Button>
            <Button
              onClick={handlePictureClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showPictureFields ? "Hide Picture" : "Edit Picture"}
            </Button>

            {showMedicationInfoFields && (
              <>
                <TextField
                  label="Medication Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  margin="normal"
                  variant="outlined"
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={values.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.quantity && Boolean(errors.quantity)}
                  helperText={touched.quantity && errors.quantity}
                  margin="normal"
                  variant="outlined"
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Price"
                  name="price"
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                  margin="normal"
                  variant="outlined"
                  sx={{ gridColumn: "span 2" }}
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
                <TextField
                  select
                  label="Category"
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.category && Boolean(errors.category)}
                  helperText={touched.category && errors.category}
                  margin="normal"
                  variant="outlined"
                  sx={{ gridColumn: "span 4" }}
                >

                  <MenuItem value="">Select Category</MenuItem>
                  {['Antibiotics', 'Pain Relief', 'Allergy', 'Cold & Flu', 'Digestive Health', 'Heart Health', 'Vitamins/Supplements', 'Women Health', 'Other'].map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </>

            )}

            {showInStockFields && (
              <>
<FormControlLabel
  control={
    <Checkbox
      checked={values.inStock}
      onChange={handleChange}
      name="inStock"
      color="primary"
    />
  }
  label="In Stock"
  sx={{ gridColumn: "span 4" }}
/>
    
              </>
            )}
            {showPictureFields && (
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

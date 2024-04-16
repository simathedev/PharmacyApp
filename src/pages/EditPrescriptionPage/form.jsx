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
  useMediaQuery
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate,useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { ContactSupportOutlined } from '@mui/icons-material';

const Form = () => {
  const { id } = useParams();
  console.log("id: ",id)
  const validationPrescriptionSchema = yup.object().shape({
    startDate:yup.date(),
    repeats:yup.string,
  });
  const validationPharmacySchema = yup.object().shape({
    pharmacy: yup.string().required('Pharmacy is required'),
  });
  const validationApprovedSchema = yup.object().shape({
    approved:yup.string(),
  });
  
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacyMedications, setPharmacyMedications] = useState([]);
  const [isLoading,setIsLoading]=useState(true)
  const [responseData, setResponseData]=useState([]);
  const [initialValues, setInitialValues] = useState({});
const [validationSchema, setValidationSchema] = useState(yup.object());
  const [showPrescriptionInfoFields, setShowPrescriptionInfoFields] = useState(false);
  const [showPharmacyFields, setShowPharmacyFields] = useState(false);
  const [showApprovedFields, setShowApprovedFields] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

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
       console.log("medication data in edit script page: ",medicationData)
      } else {
        console.log('Failed to fetch medication');
      }
    } catch (error) {
      console.error('Error fetching medication:', error);
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
  const fetchPrescription = async () => {
    try {
      const response = await fetch(`http://localhost:3001/prescription/getPharmacyPrescription/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const prescriptionData = await response.json();
        console.log("prescription data fetched:",prescriptionData);
        setPrescriptions(prescriptionData);
        
      setInitialValues({
        pharmacy: prescriptions.pharmacy || '',
        user: prescriptions.user || '',
        doctor: prescriptions.doctor || '',
        repeats: prescriptions.repeats||'',
        startDate:prescriptions.startDate||'',
        approved: prescriptions.approved || '',
      });
      } 
    } 
    catch (error) 
    {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {
    
      fetchPharmacies();
      fetchMedications();
      fetchPrescription();
  }, [token]);

  const setInitialValuesAndValidationSchema = (showPrescriptionInfoFields, showApprovedFields,showPharmacyFields,prescriptions) => {
    if (!prescriptions || Object.keys(prescriptions).length === 0) {
      return;
    }
    const initialMedications = prescriptions.medications.map(item => ({
      _id: item.medication._id,
      name: item.medication.name,
      quantity:item.quantity,
    }));

    if (!showPrescriptionInfoFields && !showApprovedFields && !showPharmacyFields) {
    
      setInitialValues({
        medications: initialMedications|| [],
        pharmacy: prescriptions.pharmacy || '',
        user: prescriptions.user || '',
        doctor: prescriptions.doctor || '',
        repeats: prescriptions.repeats||'',
        startDate:prescriptions.startDate||'',
        approved: prescriptions.approved || '',
      });
      //setValidationSchema(validationPrescriptionSchema);
    } else {
      switch (true) {
        case showPrescriptionInfoFields:
          setInitialValues({
            medications: initialMedications|| [],
            user: prescriptions.user || '',
            doctor: prescriptions.doctor || '',
            repeats: prescriptions.repeats||'',
            startDate:prescriptions.startDate||'',
            
          });
          setValidationSchema(validationPrescriptionSchema);
          break;
        case showPharmacyFields:
          setInitialValues({
            pharmacy: prescriptions.pharmacy || '',
          });
          setValidationSchema(validationPharmacySchema);
          break;
        case showApprovedFields:
          setInitialValues({
            approved: prescriptions.approved || '',
          });
          setValidationSchema(validationApprovedSchema);
          break;
        default:
          setValidationSchema(yup.object());
      }
    }
  };
  
  useEffect(() => {
    setInitialValuesAndValidationSchema(showPrescriptionInfoFields, showApprovedFields,showPharmacyFields,prescriptions);
  }, [showPrescriptionInfoFields, showApprovedFields,showPharmacyFields,prescriptions]);



  const updatePrescription = async (values, onSubmitProps) => {
    try {
      const prescriptionResponse = await fetch(`http://localhost:3001/prescription/updatePrescription/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (prescriptionResponse.ok) {
        onSubmitProps.resetForm();
        navigate("/manage/prescriptions");
        toast.success('Prescription Successfully Updated.', { 
          autoClose: 5000,
          hideProgressBar: true, 
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true, 
          progress: undefined,
          theme:'colored'
        });

      } else {
        console.log('Failed to submit the prescription form');
        toast.error('Prescription Update Unsuccessful', {
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
      console.error('Error in prescription function:', error);
      toast.error('Prescription Update Unsuccessful', {
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

  const handlePrescriptionInfoClick = () => {
    setShowPrescriptionInfoFields(!showPrescriptionInfoFields);
    setShowApprovedFields(false);
     setShowPharmacyFields(false);
   
};

const handlePharmacyClick = () => {
  setShowPharmacyFields(!showPharmacyFields);
  setShowPrescriptionInfoFields(false);
   setShowApprovedFields(false);
};

const handleApprovedClick = () => {
  setShowApprovedFields(!showApprovedFields);
  setShowPrescriptionInfoFields(false);
  setShowPharmacyFields(false);
};

  const handleSubmit = async (values, onSubmitProps) => {
    try {
      const user=prescriptions.user;
      const approved = values.approved && values.approved[0] === 'on';
      const dataToSend = {
        ...values,
        approved,
        user:user,
      };
  
      console.log('Submitting prescription:', dataToSend);
  
     // await prescription(dataToSend, onSubmitProps);
      
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Formik
    enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={validationSchema}
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
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
        >
  <Button 
              onClick={handlePrescriptionInfoClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showPrescriptionInfoFields ? "Hide Prescription Info" : "Edit Prescription Info"}
            </Button>

            <Button 
              onClick={handlePharmacyClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showPharmacyFields ? "Hide Pharmacy" : "Edit Pharmacy"}
            </Button>

            <Button 
              onClick={handleApprovedClick}
              sx={{ gridColumn: "span 4" }}
            >
              {showApprovedFields ? "Hide Approved" : "Edit Approved"}
            </Button>
        
          {showPrescriptionInfoFields&&(
            <>

<Autocomplete
  multiple
  options={pharmacyMedications}
  getOptionLabel={(option) => option?.name || ''}
  onChange={(event, newValue) => {
 
    setFieldValue('medications', newValue ? newValue.map(med =>({ id:med.medication, medication:med._id, name: med.name, quantity: med.quantity })) : []);
    console.log("values in medications autocomplete: ",values.medications)
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


<TextField
              label="Doctor Name"
              name="doctor"
              value={values.doctor}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.doctor && Boolean(errors.doctor)}
              helperText={touched.doctor && errors.doctor}
              margin="normal"
              variant="outlined"
              sx={{ gridColumn: "span 4" }}
            />
             <TextField
            label="Repeats"
            name="repeats"
            type="number"
            value={values.repeats}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.repeats && Boolean(errors.repeats)}
            helperText={touched.repeats && errors.repeats}
            margin="normal"
            variant="outlined"
            sx={{ gridColumn: "span 2" }}
          />
           <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={values.startDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.startDate && Boolean(errors.startDate)}
            helperText={touched.startDate && errors.startDate}
            margin="normal"
            variant="outlined"
            sx={{ gridColumn: "span 2" }}
          />
            </>  
          )}

   
{/*{values.medications.map((med, index) => (
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
))} */}     
           
{showPharmacyFields&&(
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
)}
         
          {showApprovedFields&&(
 <FormControlLabel
 control={
   <Checkbox
     checked={values.approved}
     onChange={handleChange}
     name="approved"
     color="primary"
   />
 }
 label="Approved"
 sx={{ gridColumn: "span 4" }}
/>
          )}
         
          {/* Add other fields here */}
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
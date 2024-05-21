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
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import LoadingSmallWidget from 'components/widgets/LoadingSmallWidget';
import Loading from 'components/Loading';
import ProgressLoadWidget from 'components/widgets/ProgressLoadWidget';

const Form = () => {
  const prescriptionSchema = yup.object().shape({
    medications: yup
    .array()
    .of(
      yup.object().shape({
        medication: yup.string().required(),
        quantity: yup.number().required().min(1).default(1),
      
      })
    )
    .required("Medication is required"),
   
  });

  const initialValuesPrescription = {
    medications:[],
  };
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [isSaving,setIsSaving]=useState(false)
  const token = useSelector((state) => state.auth.token);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const role= useSelector((state) => state.auth.role);
  const selectedPharmacy=useSelector((state)=>state.auth.pharmacy);
 const user=useSelector((state)=>state.auth.user)
  const { palette } = useTheme();
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
            setMedications(medicationData.map((med) => ({ medication: med._id, name: med.name,quantity:1 })));
          } else {
            console.log('Failed to fetch users');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      const fetchPharmacies = async () => {
        try {
            const response = await fetch("http://localhost:3001/pharmacy/getPharmacies", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const pharmacyData = await response.json();
                console.log("pharmacy data:", pharmacyData);
                setPharmacies(pharmacyData);
            } else {
                console.log("Failed to fetch pharmacies");
            }
        } catch (error) {
            console.error("Error fetching pharmacies:", error);
        }
    };

    fetchPharmacies();
    fetchMedications();
    setIsLoading(false);
    console.log('medications: ',medications);
  }, [token]);

  const prescription = async (values, onSubmitProps) => {
    try {
      const prescriptionResponse = await fetch('http://localhost:3001/prescription/addUserPrescription', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (prescriptionResponse.ok) {
        setIsSaving(false)
        onSubmitProps.resetForm();
        toast.success('Prescription Successfully Submitted. Awaiting Pharmacy Approval.', { 
          // Position of the notification
          autoClose: 5000, // Duration before the notification automatically closes (in milliseconds)
          hideProgressBar: true, // Whether to hide the progress bar
          closeOnClick: true, // Whether clicking the notification closes it
          pauseOnHover: true, // Whether hovering over the notification pauses the autoClose timer
          draggable: true, // Whether the notification can be dragged
          progress: undefined,
          theme:"colored",
        });
        navigate('/user/view/prescriptions')
      } else {
        setIsSaving(false)
        console.log('Failed to submit the prescription form');
        toast.error('Prescription Submission Unsuccessful', {
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
      toast.error('Prescription Submission Unsuccessful', {
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
      setIsSaving(true);
      const approved = !!values.approved
      const updatedValues = {
        ...values,
        user:user,
        //pharmacy: selectedPharmacy,
        approved,
      };
      console.log('Submitting prescription:', updatedValues);
     await prescription(updatedValues, onSubmitProps);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
if(isLoading)
{
  return <Loading/>
}
if (isSaving)
{
  return <ProgressLoadWidget name='prescription' text='submitting'/>
}
  return (
    <Formik
      initialValues={initialValuesPrescription}
      validationSchema={prescriptionSchema}
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
        <Autocomplete
              multiple
              options={medications}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setFieldValue('medications', newValue);
              }}
              value={values.medications}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Medications"
                  error={touched.medications && Boolean(errors.medications)}
                  helperText={touched.medications && errors.medications}
                  margin="normal"
                  variant="outlined"
                />
              )}
              sx={{ gridColumn: "span 4" }}
            />

<Autocomplete
  options={pharmacies}
  getOptionLabel={(option) => option.name}
  value={values.pharmacy}
  onChange={(event, newValue) => {
    setFieldValue('pharmacy', newValue ? newValue._id : '');
  }}
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
  sx={{ gridColumn: 'span 4' }}
/>

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
           {/* <FormControlLabel
              control={
                <Checkbox
                  checked={values.approved}
                  onChange={handleChange}
                  name="approved"
                  color="primary"
                />
              }
              label="Approved"
            />*/}
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
              Submit
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;

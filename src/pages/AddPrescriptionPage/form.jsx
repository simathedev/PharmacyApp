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
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Loading from 'components/Loading';
import ProgressLoadWidget from 'components/widgets/ProgressLoadWidget';

const Form = () => {

  const navigate = useNavigate();
  const prescriptionSchema = yup.object().shape({
    user: yup.string().required('User is required'),
    medications: yup.array().of(
      yup.object().shape({
        name: yup.string().required('Medication name is required'),
        quantity: yup.number().required('Quantity is required'),
      })
    ),
    pharmacy: yup.string()
  });

  const initialValuesPrescription = {
    user: '',
  medications:[],
  doctor: '',
  repeats: 0,
  startDate: '',
  pharmacy: '',
  approved: false, 
  };

  let apiUrlSegment=process.env.NODE_ENV === 'production' ?
  `https://pharmacy-app-api.vercel.app`
  :
  `http://localhost:3001`

  const [users, setUsers] = useState([]);
  const [medications, setMedications] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [isLoading,setIsLoading]=useState(true);
  const [isSaving,setIsSaving]=useState(false);
  const token = useSelector((state) => state.auth.token);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState('');
  const selectedPharmacy=useSelector((state)=>state.auth.pharmacy);
 //console.log("selected Pharmacy: ",selectedPharmacy._id)
  const role= useSelector((state) => state.auth.role);
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrlSegment}/user/getUsers`, {
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
    fetchUsers();
    //fetchMedications();
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
          const response = await fetch(`${apiUrlSegment}/medication//getMedications/${pharmacyId}`, {
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

  const prescription = async (values, onSubmitProps) => {
    try {
      const prescriptionResponse = await fetch(`${apiUrlSegment}/prescription/addPrescription`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (prescriptionResponse.ok) {
        setIsSaving(false);
        onSubmitProps.resetForm();
        if(role==='pharmacist'||role==='admin')
        {
          navigate("/manage/prescriptions");
        }
        if(role==='user')
        {
          navigate("/user/view/prescriptions");
        }
    
        toast.success('Prescription Successfully Created.', { 
         
          autoClose: 5000,
          hideProgressBar: true, 
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true, 
          progress: undefined,
          theme:"colored",
        });
      } else {
        setIsSaving(false);
        //setIsLoading(false);
        console.log('Failed to submit the prescription form');
        toast.error('Prescription Creation Unsuccessful', {
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
      console.error('Error in prescription function:', error);
      toast.error('Prescription Creation Unsuccessful', {
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
      //console.log('add prescriptions page:',values);
      setIsSaving(true);
      if(role==='pharmacist')
      {
        const approved = !!values.approved
        const dataToSend = {
          ...values,
          pharmacy:selectedPharmacy._id,
          approved,
        };
      console.log('Submitting prescription:', dataToSend);
     await prescription(dataToSend, onSubmitProps);
      }
      else
      {
        const approved = !!values.approved
        const dataToSend = {
          ...values,
          approved,
        };
        console.log('Submitting prescription:', dataToSend);
       await prescription(dataToSend, onSubmitProps);
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

  if(isLoading)
  {
    return <Loading/>
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
          <ProgressLoadWidget name='Prescription' text='Adding'/>

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

            {(role==='pharmacist'||role==='admin')&&(
 <Autocomplete
 options={users}
 sx={{ gridColumn: "span 4" }}
 getOptionLabel={(option) => (option && option.firstName+" "+option.lastName) || ''}
 onChange={(e, newValue) => {
   setFieldValue('user', newValue ? newValue.id : '');
 }}
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
            )}
           
           
  <Autocomplete
    multiple
    options={medications}
    getOptionLabel={(option) => (option && option.name) || ''}
    onChange={(e, newValue) => {
      setFieldValue('medications', newValue ? newValue.map(med => ({ id:med.id,medication: med.id, name: med.name, quantity: 1 })) : []);
    }}
    sx={{ gridColumn: "span 4" }}
    value={medications.filter(med => values.medications.map(item => item.medication).includes(med.id))}
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
    key={(option) => `${option.id}-${option.firstName}`} // Set a unique key for each user option
  />
            
             <TextField
                label="Doctor Name"
                name="doctor"
                value={values.doctor}
                onChange={handleChange}
                onBlur={ (e)=>  
                  {const capitalizedValue = capitalize(e.target.value); // Capitalize the input value
                 setFieldValue('doctor', capitalizedValue); // Set the field value with the capitalized value
                 handleBlur(e);
                  }}
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
  onChange={(e) => {
    const newValue = Math.max(0, parseInt(e.target.value)); // Ensure newValue is non-negative
    setFieldValue('repeats', newValue); // Update form field value
  }}
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
           
            {(role==='pharmacist'||role==='admin')&&(
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

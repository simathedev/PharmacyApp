import { useState } from "react";
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
import { useNavigate,useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin,setPharmacy } from "state";
import {addToCart} from "cartState";
import Dropzone from "react-dropzone";
import { toast } from 'react-toastify';
import LoadingComponent from "components/LoadingComponent/index";
import ProgressLoadWidget from "components/widgets/ProgressLoadWidget";


const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {

  const [isLoading,setIsLoading]=useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  let {userType}=useParams();
  console.log('usertype from useParams:',userType)

  let apiUrlSegment=process.env.NODE_ENV === 'production' ?
  `https://pharmacy-app-api.vercel.app`
  :
  `http://localhost:3001`

  const login = async (values, onSubmitProps) => {
    let apiUrl;
    if (userType === "user") {
      apiUrl = `${apiUrlSegment}/auth/login`;
    } else if (userType === "pharmacist") {
      apiUrl = `${apiUrlSegment}/auth/loginPharmacist`;
    } else if (userType === "admin") {
      apiUrl = `${apiUrlSegment}/auth/loginAdmin`;
    }
  
    try {
      const loggedInResponse = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const loggedIn = await loggedInResponse.json();
      onSubmitProps.resetForm();
      if (loggedIn) {
        setIsLoading(false);
        if (loggedIn.msg) {
          console.log("error:", loggedIn.msg);
          toast.error(`Email Or Password Incorrect`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else {

          console.log('logged in:',loggedIn)
          console.log('user type in successful response:',userType)
          toast.success('Successfully Logged In', { 
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          if (userType === "user") {
            console.log('the userType is user')
            dispatch(
              setLogin({
                user: loggedIn.user,
                token: loggedIn.token,
                role:'user',
              })
      
            );
           
          } else if (userType === "pharmacist") {
            console.log('the userType is pharmacist')
           dispatch(
              setLogin({
                user: loggedIn.pharmacist,
                token: loggedIn.token,
                role:'pharmacist',
              }),
      dispatch(
    setPharmacy({
      pharmacy:loggedIn.pharmacist.pharmacy,
    })
      )
    
            );
          }
          else if (userType==="admin")
          {
            
            console.log("loggedIn details Admin: ",loggedIn)
            console.log('the userType is admin')
            dispatch(
              setLogin({
               user: loggedIn.admin,
               token: loggedIn.token,
                role:'admin',
              })
      
            );
          }
        
          navigate(`/${userType}`);
        }
       
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error logging in:", error);
      toast.error("Network Error. Please Try Again Later.", {
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
  

  const handleFormSubmit = async (values, onSubmitProps) => {
    setIsLoading(true);
    await login(values, onSubmitProps);
  };

  if (isLoading)
  {
    return <ProgressLoadWidget name='please wait ' text='logging in, '/>
  }

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesLogin}
      validationSchema={loginSchema}
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
              {"LOGIN"}
            </Button>
            {userType!=='admin'&&(
 <Typography
 onClick={() => {
   navigate(`/register/${userType}`);
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
 
 {"Don't have an account? Sign Up here."}
</Typography>
            )}
           
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
import {Routes,Route} from 'react-router-dom';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import {CssBaseline,ThemeProvider} from "@mui/material";
import {useMemo} from "react";
import{useSelector} from "react-redux";
import { createTheme } from '@mui/material';
import { themeSettings } from './theme';
import ManageMedicationPage from './pages/ManageMedicationPage';
import ManageUsersPage from './pages/ManageUsersPage';
import ManageScriptsPage from './pages/ManageScriptsPage';
import ManageOrdersPage from './pages/ManageOrdersPage';
import ManagePharmacistsPage from './pages/Admin/ManagePharmacistsPage';
import ManagePharmaciesPage from './pages/Admin/ManagePharmaciesPage'
import AddOrderPage from './pages/AddOrderPage';
import PharmacistLoginPage from './pages/Pharmacists/LoginPage';
import HomePage from './pages/HomePage';
import UserRegisterPage from './pages/User/RegisterPage';
import UserLoginPage from './pages/User/LoginPage';
import UserHomePage from './pages/User/HomePage';
import PharmacistHomePage from './pages/Pharmacists/HomePage';
import AddPharmacyPage from './pages/Admin/AddPharmacyPage';
import AddMedicationPage from './pages/AddMedicationPage';
import AddUserPage from './pages/Admin/AddUsersPage';
import AddPharmacistPage from './pages/Admin/AddPharmacistsPage';
import AddPrescriptionPage from './pages/AddPrescriptionPage';
import MedicationPage from './pages/MedicationPage';
import UserOrderPage from './pages/User/OrderPage';
import AddUserPrescriptionPage from './pages/User/AddPrescriptionPage';
import UserPrescriptionPage from './pages/User/ViewPrescriptionPage';
import UserAccountPage from './pages/User/UserDetailsPage';
import OrderDetailsPage from './pages/User/OrderDetailsPage';
import EditUserDetailsPage from 'pages/User/EditUserDetailsPage';
import DeleteItem from 'components/DeleteItem';
import EditMedicationPage from './pages/EditMedicationPage';
import EditUserPage from './pages/EditUsersPage';
import EditOrderPage from './pages/EditOrderPage';
import EditPharmacistPage from './pages/Admin/EditPharmacistsPage';
import EditPrescriptionPage from './pages/EditPrescriptionPage';
import EditPharmacyPage from './pages/Admin/EditPharmacyPage';
import FavouritesPage from './pages/FavouritesPage';
import CartPage from './pages/User/CartPage';
import CheckoutPage from './pages/User/CheckoutPage';
import Layout from 'Layout';
import SplashPage from './pages/SplashPage';
import NotFound from './pages/NotFoundPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddBulkMedicationPage from './pages/AddBulkMedicationPage';
import userScriptPage from './pages/User/AddPrescriptionPage';
import MedicationDetailsPage from './pages/User/MedicationDetailsPage';


function App() {
  const mode=useSelector ((state)=>state.auth.mode);
  const theme=useMemo(()=>createTheme(themeSettings(mode)),[mode]);
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline/>
    <Layout>
    <Routes>
     
    <Route path="/" element={<HomePage/>}/>
    <Route path="/register/:userType?" element={<UserRegisterPage/>}/>
    <Route path="/signIn/:userType?" element={<UserLoginPage/>}/>
    <Route path="/admin/" element={<AdminDashboardPage/>}/>
    <Route path="/admin/pharmacies" element={<ManagePharmaciesPage/>}/>
    <Route path="/admin/pharmacists" element={<ManagePharmacistsPage/>}/>
    <Route path="/manage/medications" element={<ManageMedicationPage/>}/>
    <Route path="/manage/prescriptions" element={<ManageScriptsPage/>}/>
    <Route path="/manage/users" element={<ManageUsersPage/>}/>
    <Route path="/manage/orders" element={<ManageOrdersPage/>}/>
    <Route path="/pharmacist/signIn" element={<PharmacistLoginPage/>}/>
    <Route path="/pharmacist/" element={<PharmacistHomePage/>}/>
    <Route path="/Add/Medication" element={<AddMedicationPage/>}/>
    <Route path='/Add/BulkMedication' element={<AddBulkMedicationPage/>}/>
    <Route path="/Add/Pharmacy" element={<AddPharmacyPage/>}/>

    <Route path="/Edit/Pharmacy/:id" element={<EditPharmacyPage/>}/>
    <Route path="/Edit/Pharmacist/:id" element={<EditPharmacistPage/>}/>
    <Route path="/Edit/User/:id" element={<EditUserPage/>}/>
    <Route path="/Edit/Order/:id" element={<EditOrderPage/>}/>
    <Route path="/Edit/Medication/:id" element={<EditMedicationPage/>}/>
    <Route path="/Edit/Prescription/:id" element={<EditPrescriptionPage/>}/>

    <Route path="/user/" element={<UserHomePage/>}/>
    <Route path="/user/add/prescription" element={<AddUserPrescriptionPage/>}/>
    <Route path="/user/view/prescriptions" element={<UserPrescriptionPage/>}/>
    <Route path="/user/view/orders" element={<UserOrderPage/>}/>
    <Route path="/user/view/order/:id" element={<OrderDetailsPage/>}/>
    <Route path="/view/account" element={<UserAccountPage/>}/>
    <Route path="/user/edit/:field?" element={<EditUserDetailsPage/>}/>
    <Route path="/Add/User" element={<AddUserPage/>}/>
    <Route path="/Add/Prescription" element={<AddPrescriptionPage/>}/>
    <Route path="/Add/Order" element={<AddOrderPage/>}/>
    <Route path='Add/Pharmacist' element={<AddPharmacistPage/>}/>
    <Route path='Buy/Medication' element={<MedicationPage/>}/>
    <Route path='Medication/details/:id' element={<MedicationDetailsPage/>}/>
    <Route path='/delete' element={<DeleteItem/>}/>
    <Route path='/cart' element={<CartPage/>}/>
    <Route path='/checkout' element={<CheckoutPage/>}/>
    <Route path='/splash' element={<SplashPage/>}/>
    <Route path='/favourites' element={<FavouritesPage/>}/>
    <Route path='/user/add/script' element={<userScriptPage/>}/>
  
  



    <Route path="*" element={<NotFound/>}/>
    </Routes>
    <ToastContainer />
    </Layout>
    </ThemeProvider>
  );
}

export default App;

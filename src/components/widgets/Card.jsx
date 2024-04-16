import React from 'react';
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
    Card,
    Grid,
    Button,
  } from "@mui/material";
import WidgetWrapper from 'components/WidgetWrapper';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import Form from '../../pages/User/CheckoutPage/form';
import CloseIcon from '@mui/icons-material/Close';

const CardWidget = ({editingSection,handleStepData,editing,cardDetails,handleEditClick,values,handleSubmit}) => {
const user=useSelector((state)=>state.auth.user);
const isNonMobile = useMediaQuery("(min-width:600px)");
  return (
   <WidgetWrapper sx={{width:isNonMobile?'50%':'80%',minHeight:'30vh',borderRadius:6,textAlign:'left', mt:1}}>
    <Box sx={{my:2}}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: '100%' }}>
         <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', textAlign: 'left' }}>
         
      <Typography color='primary' fontWeight='bold' fontSize='1rem'>Bank Details:</Typography>
      </Box>
      {editing.card ? (
        <IconButton onClick={()=>handleEditClick('card')} color='primary'>
          <CloseIcon />
        </IconButton>
      ) : (
        <IconButton onClick={()=>handleEditClick('card')} color='primary'>
          <EditIcon />
        </IconButton>
      )}
      {/*<EditIcon color='primary' onClick={() => handleEditClick('card')}/>*/}
      </Box>
  {(!editingSection||!cardDetails)&&(
    <>
<Typography variant='h2' sx={{fontWeight:'bold'}}> 5665 9900 7890</Typography>
    <Box sx={{display:'flex',justifyContent:'space-between',mr:1}}>
    <Box>
    <Typography variant='body1' sx={{color:'gray'}}>cardholder name</Typography>
    <Typography variant='h4'>{user.firstName} {user.lastName}</Typography>  
    </Box>
    <Box>
    <Typography variant='body1' sx={{color:'gray'}}>exp date</Typography>
    <Typography variant='h4'>05/28</Typography>
    </Box>
    </Box>
    <Button variant='outlined'  onClick={()=>handleStepData(4)}>confirm</Button>
    </>
  )}
    
    </Box>
   
    {(editingSection&& cardDetails)&& (
        <Form section={editingSection} values={values} onSubmit={handleSubmit} />
    )}
       </WidgetWrapper>
   
  );
};

export default CardWidget;
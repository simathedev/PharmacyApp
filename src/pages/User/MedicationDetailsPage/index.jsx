import React, { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { Grid, Card, Box,useMediaQuery, Divider, Typography, Button, useTheme } from '@mui/material';
import EditButton from "components/buttons/EditButton";
import { addToCart,clearCart,addToFavorite,removeFavorite,clearFavorites } from "cartState";
import DeleteButton from "components/buttons/DeleteButton";
import AddButton from "components/buttons/AddButton";
import BackButton from "components/buttons/BackButton";
import AddToCartButton from "components/buttons/AddToCartButton";
import OrderProducts from "components/OrderProducts";
import { Link } from 'react-router-dom';
import OrderStatus from "components/widgets/OrderStatus";
import Navbar from "components/navbar";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import CartNavbar from "components/cartnavbar";
import Loading from "components/Loading";

const Index = () => {
  const {id}=useParams();
  
  let apiUrlSegment=process.env.NODE_ENV === 'production' ?
    `https://pharmacy-app-api.vercel.app`
    :
    `http://localhost:3001`

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primary=theme.palette.primary.main;

  const dispatch =useDispatch();
  console.log('medication product ID:',id);
  const token = useSelector((state) => state.auth.token);
  const [medication, setMedication] = useState([]);
  const [isLoading,setIsLoading]=useState(true);
  const user = useSelector((state) => state.auth.user);
  const buttonColored=true;

  let userId;
  userId=user._id;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  useEffect(() => {
    const fetchMedicationDetails = async () => {
      try {
        const response = await fetch(`${apiUrlSegment}/medication/getMedication/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          setIsLoading(false);
          const medicationData = await response.json();
          console.log("medication data in details page:",medicationData);
          setMedication(medicationData);
        } else {
          setIsLoading(false);
          console.log("Failed to fetch medication details");
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching medication details:", error);
      }
    };

    fetchMedicationDetails();
  }, [token]);
  const addItemToCart = ({ id, name, price, picture }) => {
    dispatch(addToCart({id:id,title:name,price:price,picture:picture}));
    toast.success(`${name} added to cart`, {
     autoClose: 1000,
     position: "bottom-right",
     hideProgressBar: true,
     closeOnClick: true,
     pauseOnHover: true,
     draggable: true,
     theme: "colored",
   });
   };

if(isLoading)
{
  return <Loading/>
}


  return (
    <Box sx={{minHeight:'100vh'}}>

    <Box sx={{textAlign:'center',position:'relative'}}>
    <Box sx={{position:'sticky'}}>
    <CartNavbar/>
    </Box>
    <Box sx={{width:'100%',display:'flex',justifyContent:'left',pl:2,pt:2}}>
      <Link to={'/buy/medication'}>
          <BackButton />
        </Link>
      </Box>
      <Box sx={{display:'flex', flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
      <Card sx={{ pt:10,pb:5,width:'80%', minHeight:'60vh', borderRadius:6,display:'flex',mt:isNonMobile&&10,flexDirection:isNonMobile?'row':'column', alignItems:'center', justifyContent:isNonMobile&&'center'}}>

<img
            width={isNonMobile?"250px":"120px"}
            height={isNonMobile?"250px":"120px"}
            alt="medication"
            style={{marginTop: "0.75rem",borderRadius:'10%', px:5 }}
            src={`${apiUrlSegment}/assets/${medication?.picture}`}
          />



<Box sx={{width:isNonMobile?'50%':'80%',px:isNonMobile&&3,borderRadius:6,display:'flex', flexDirection:'column',justifyContent:'center', alignItems:isNonMobile?'left':'center',textAlign:'left'}}>
<Typography variant='h2'color='primary' fontWeight='600' sx={{fontSize:isNonMobile?'2rem':'1.3rem'}}>{medication?.name}</Typography>
<Typography variant='h3'fontWeight='600'color={`${dark}`} sx={{fontSize:isNonMobile?'1.5rem':'1.2rem',pb:1}}>R {medication?.price}</Typography>
<Typography variant='body1'color='primary' sx={{fontSize:'0.87rem'}}>{medication?.category}</Typography>
<Typography variant='body1' color='primary' sx={{fontSize:'0.87rem'}}>{medication.pharmacy?.name}</Typography>
  <Box sx={{width:'80%', py:2}}>
  <Typography variant='h4' sx={{fontSize:isNonMobile?'1.4rem':'1rem',py:1}} >Description</Typography>
  <Typography variant='body2' sx={{fontSize:isNonMobile?'0.9rem':'0.8rem'}}>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam nemo maiores, sequi, eius ipsa voluptatibus dignissimos rerum similique exercitationem enim dolores labore! Minus facilis reprehenderit officiis aliquam.
  </Typography>
  <Divider sx={{ my: 1 }} />
  <Typography variant='h5' sx={{fontSize:isNonMobile?'1.4rem':'1rem',pb:1}} >Medicine Contains</Typography>
  <Typography variant='body2' sx={{fontSize:isNonMobile?'0.9rem':'0.8rem'}}>
      Lorem ipsum 7mg, dolor sit amet consectetur 2mg, adipisicing elit. Aperiam 8ml, nemo maiores 8mg, sequi 2mg.
  </Typography>
  </Box>
      
<Box sx={{ display: 'flex', width:'100%', alignItems: 'left', justifyContent: isNonMobile?'left':'center', gap: 2,py:2 }}>
            {medication.inStock?
            (
              <AddToCartButton buttonColored={buttonColored} onClick={() => addItemToCart({ id:medication._id, name: medication.name, price: medication.price, picture: medication.picture })} />

            ):
            (
              <Typography variant='body1'>Out Of Stock</Typography>

            )}
          </Box>
</Box>
</Card>
      </Box>
     
      
   
    

    
      </Box>
       
   
    </Box>
 
  )
}

export default Index;
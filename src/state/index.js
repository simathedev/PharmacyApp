import { createSlice } from "@reduxjs/toolkit";

const initialState={
    mode:'light',
    user:null,
    role:'user',
    pharmacy:null,
    pharmacist:null,
    token:null,
    orders:[],
    prescriptions:[],

}

export const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setMode: (state)=>{
            state.mode = state.mode==="light"?"dark":"light";
        },
        setPharmacy: (state,action)=>{
            state.pharmacy = action.payload.pharmacy;
        },
        setLogin:(state,action)=>{
            state.user=action.payload.user;
            state.token=action.payload.token;
            state.role=action.payload.role;
        },
        setLogout:(state)=>{
            state.user=null;
            state.token=null;
        },
    
      
    }
})

export const {setMode,setLogin,setPharmacy,setLogout}=authSlice.actions
export default authSlice.reducer;
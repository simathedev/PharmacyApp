import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import authReducer from "./state";
import cartReducer from "./cartState";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import {combineReducers } from 'redux';
import{
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import {PersistGate} from "redux-persist/integration/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const persistConfig={key:"root", storage,version:1};
const persistedAuthReducer=persistReducer(persistConfig,authReducer);
const persistedCartReducer=persistReducer(persistConfig,cartReducer);
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  cart: persistedCartReducer,
});

const store=configureStore({
  reducer:rootReducer,
  middleware:(getDefaultMiddleware)=>
  getDefaultMiddleware({
    serializableCheck:{
      ignoreActions:[FLUSH,
        REHYDRATE,
        PAUSE,
        PURGE,
        REGISTER]
    }
  })
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistStore(store)}>
    <App />
    </PersistGate>
    </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
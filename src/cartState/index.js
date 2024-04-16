import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  total: 0,
  count: 0,
  favorite:[],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const {id, title, price, picture } = action.payload;
      console.log("action payload:",action.payload);
      console.log("title from redux:",action.payload.title)
     const existingItemIndex = state.items.findIndex((item) => item.title === title);
    
      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity++;
      } else {
        state.items.push({ id,title, price, picture, quantity: 1 });
      }
    
      state.total += parseFloat(price); // Update total price
      state.count++;
    }
    ,
    addToFavorite: (state, action) => {
      const { id,title, price, picture } = action.payload;
      console.log("action favorite payload:",action.payload);
      console.log("title from redux:",action.payload.title)
     const existingItemIndex = state.favorite.findIndex((item) => item.title === title);
    
        state.favorite.push({id,title, price, picture });
    
      //state.total += parseFloat(price); // Update total price
    },
    clearFavorites: (state) => {
      state.favorite = [];
    },
    removeFavorite: (state, action) => {
      const { id,title, price} = action.payload;
      const index = state.favorite.findIndex(
        (item) => item.title === title 
      );
      if (index !== -1) {
        state.favorite.splice(index, 1);
      }
    },

    increaseQuantity: (state, action) => {
      const { title, price } = action.payload;
      const item = state.items.find(
        (item) => item.title === title
      );
      if (item) {
        item.quantity++;
        //state.total += parseFloat(price.replace(/\s/g, "").replace(",", "."));
        state.total += parseFloat(price);
        state.count++;
      }
    },
    decreaseQuantity: (state, action) => {
      const { title, price } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.title === title);
    
      if (existingItemIndex !== -1) {
        const existingItem = state.items[existingItemIndex];
    
        if (existingItem.quantity > 1) {
          // Decrease quantity
          state.items[existingItemIndex].quantity--;
          state.total -= parseFloat(price); // Update total price
          state.count--;
        } else {
          // Remove item if quantity is 1
          state.items.splice(existingItemIndex, 1);
          state.total -= parseFloat(price); // Update total price
          state.count--;
        }
      }
    }
    ,
    removeItem: (state, action) => {
      const { id,title, price, quantity } = action.payload;
      const index = state.items.findIndex(
        (item) => item.title === title 
      );
      if (index !== -1) {
        //state.total -=parseFloat(price.replace(/\s/g, "").replace(",", ".")) * quantity;
        state.total -= parseFloat(price*quantity);
        state.count -= quantity;
        state.items.splice(index, 1);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.count = 0;
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  addToFavorite,
  clearFavorites,
  removeFavorite,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

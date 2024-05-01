import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategories: [],
  storeSelectedItems: [],
  filterData: [],
  rating_count: 0,
};

export const categoryIdsSlice = createSlice({
  name: "categoryid",
  initialState,
  reducers: {
    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },
    setStoreSelectedItems: (state, action) => {
      //console.log("payload", action.payload);
      state.storeSelectedItems = action.payload;
    },
    setFilterData: (state, action) => {
      console.log("payload", action.payload);
      state.filterData = action.payload;
    },
    setRating_Count: (state, action) => {
      console.log("payload", action.payload);
      state.rating_count = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setRating_Count,
  setSelectedCategories,
  setStoreSelectedItems,
  setFilterData,
} = categoryIdsSlice.actions;
export default categoryIdsSlice.reducer;

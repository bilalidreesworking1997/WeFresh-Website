import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  parcelInfo: null,
};

// Action creators are generated for each case reducer function
export const parcelInfoDataSlice = createSlice({
  name: "parcel-data",
  initialState,
  reducers: {
    setParcelData: (state, action) => {
      console.log("action", action.payload);
      state.parcelInfo = action.payload;
    },
  },
});

export const { setParcelData } = parcelInfoDataSlice.actions;

export default parcelInfoDataSlice.reducer;

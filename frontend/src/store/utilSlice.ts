import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  data: any;
}

const initialState: UserState = {
  data: {},
};

const utilSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setTempData(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    removeTempData(state) {
      state.data = {};
    },
    updateTempData(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
  },
});

export const { setTempData, removeTempData, updateTempData } =
  utilSlice.actions;
export default utilSlice.reducer;

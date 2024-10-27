import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import utilReducer from "./utilSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    utils: utilReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;

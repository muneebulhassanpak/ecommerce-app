import { User } from "@/types/DataTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isLoggedIn: boolean;
  user: User;
}

const initialState: UserState = {
  isLoggedIn: false,
  user: { name: "", email: "", role: "user" },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = { name: "", email: "", role: "user" };
    },
    updateUser(state, action: PayloadAction<User>) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
  },
});

export const { login, updateUser, logout } = userSlice.actions;
export default userSlice.reducer;

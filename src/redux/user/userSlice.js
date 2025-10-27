import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

export const signupUser = createAsyncThunk(
  "user/signupUser",
  async ({ fullName, email, password }, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

    //   dispatch(signInSuccess(data.user));
      return data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const signinUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      dispatch(signInSuccess(data.user));
      return data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const signoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/signout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      dispatch(signoutSuccess());
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    updateUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
  updateUser,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;

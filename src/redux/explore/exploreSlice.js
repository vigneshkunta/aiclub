import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchPosts = createAsyncThunk(
  "explore/fetchPosts",
  async ({ page }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/explore?page=${page}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch posts");
      return data.posts;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const savePost = createAsyncThunk(
  "explore/savePost",
  async ({ postId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/savePost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save post");
      return { postId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const exploreSlice = createSlice({
  name: "explore",
  initialState: {
    posts: [],
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {
    resetPosts: (state) => {
      state.posts = [];
      state.page = 1;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = [...state.posts, ...action.payload];
        state.page += 1;
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPosts } = exploreSlice.actions;
export default exploreSlice.reducer;

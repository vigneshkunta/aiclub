import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async () => {
    const res = await fetch("/api/history", { credentials: "include", cache: "no-store" });
    const data = await res.json();
    // console.log("Fetched history data:", data);
    if (!res.ok) throw new Error(data.error || "Failed to fetch history");
    return data.history || [];
  }
);

export const updatePost = createAsyncThunk(
  "history/updatePost",
  async ({ postId, field, value }) => {
    const res = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ [field]: value }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update post");
    return { postId, field, value };
  }
);

export const deletePost = createAsyncThunk(
  "history/deletePost",
  async (postId) => {
    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete post");
    return postId;
  }
);

const historySlice = createSlice({
  name: "history",
  initialState: {
    items: [],
    loading: false,
    error: null,
    updating: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updatePost.pending, (state, action) => {
        state.updating = action.meta.arg.postId;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.updating = null;
        const { postId, field, value } = action.payload;
        const item = state.items.find((i) => i._id === postId);
        if (item) item[field] = value;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.updating = null;
        state.error = action.error.message;
      })
      .addCase(deletePost.pending, (state, action) => {
        state.updating = action.meta.arg;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.updating = null;
        state.items = state.items.filter((i) => i._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.updating = null;
        state.error = action.error.message;
      });
  },
});

export default historySlice.reducer;

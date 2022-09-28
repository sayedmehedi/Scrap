import {createSlice} from "@reduxjs/toolkit";
import {authApi} from "@data/laravel/services/auth";

type AuthLoadingState = {
  socialLoginState: "pending" | "fulfilled" | "rejected";
};

const slice = createSlice({
  name: "authLoading",
  initialState: {
    socialLoginState: "fulfilled",
  } as AuthLoadingState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(authApi.endpoints.socialLogin.matchFulfilled, state => {
      state.socialLoginState = "fulfilled";
    });

    builder.addMatcher(authApi.endpoints.socialLogin.matchPending, state => {
      state.socialLoginState = "pending";
    });

    builder.addMatcher(authApi.endpoints.socialLogin.matchRejected, state => {
      state.socialLoginState = "rejected";
    });
  },
});

export default slice.reducer;

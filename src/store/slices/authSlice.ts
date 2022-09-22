import {tokenReceived} from "@store/actions/auth";
import {authApi} from "@data/laravel/services/auth";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import type {RootState, User, UserProfile} from "@src/types";

type AuthState = {
  user: User | null;
  token: string | null;
  firstTimeLogin: boolean;
  profile: UserProfile | null;
};

const slice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    profile: null,
    firstTimeLogin: true,
  } as AuthState,
  reducers: {
    setCredentials: (
      state,
      {payload: {user, token}}: PayloadAction<{user: User; token: string}>,
    ) => {
      state.user = user;
      state.token = token;
    },
    setFirstTimeLoginFalse: state => {
      state.firstTimeLogin = false;
    },
  },
  extraReducers: builder => {
    builder.addCase(tokenReceived, (state, action) => {
      state.token = action.payload;
    });

    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, state => {
      state.user = null;
      state.token = null;
      state.profile = null;
    });

    builder.addMatcher(
      authApi.endpoints.getProfile.matchFulfilled,
      (state, action) => {
        state.profile = action.payload.user;
      },
    );

    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, {payload}) => {
        if ("user" in payload) {
          state.token = payload.user?.token;
          state.user = payload.user;
        }
      },
    );

    builder.addMatcher(
      authApi.endpoints.loginWithGoogle.matchFulfilled,
      (state, {payload}) => {
        if ("user" in payload) {
          state.token = payload.user.token;
          state.user = payload.user;
        }
      },
    );
  },
});

export const {setCredentials, setFirstTimeLoginFalse} = slice.actions;

export default slice.reducer;

export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;

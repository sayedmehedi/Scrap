import {api} from "@data/laravel/services/api";
import type {RootState, User} from "@src/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loggedOut, tokenReceived} from "@store/actions/auth";

type AuthState = {
  isAdmin: boolean;
  isClient: boolean;
  isLawyer: boolean;
  user: User | null;
  token: string | null;
};

const slice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAdmin: false,
    isClient: false,
    isLawyer: false,
  } as AuthState,
  reducers: {
    setCredentials: (
      state,
      {payload: {user, token}}: PayloadAction<{user: User; token: string}>,
    ) => {
      state.user = user;
      state.token = token;
    },
  },
  extraReducers: builder => {
    builder.addCase(tokenReceived, (state, action) => {
      state.token = action.payload;
    });

    builder.addCase(loggedOut, (state, action) => {
      state.token = null;
      state.isAdmin = false;
      state.isClient = false;
      state.isLawyer = false;
    });

    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, {payload}) => {
        state.token = payload.token;
        state.isAdmin = payload.isAdmin;
        state.isClient = payload.isClient;
        state.isLawyer = payload.isLawyer;

        state.user = payload.user ?? null;
      },
    );
  },
});

export const {setCredentials} = slice.actions;

export default slice.reducer;

export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;

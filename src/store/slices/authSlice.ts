import {tokenReceived} from "@store/actions/auth";
import {authApi} from "@data/laravel/services/auth";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import type {RootState, User, UserProfile} from "@src/types";

type AuthState = {
  user: User | null;
  token: string | null;
  firstTimeLogin: boolean;
  profile: UserProfile | null;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    postal_code: number | null;
    state: {id: number; label: string; value: number} | null;
    city: {id: number; label: string; value: number} | null;
    country: {id: number; label: string; value: number} | null;
  };
};

const slice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    profile: null,
    firstTimeLogin: true,
    shippingAddress: {
      name: "",
      phone: "",
      address: "",
      city: null,
      state: null,
      country: null,
      postal_code: null,
    },
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
    addShippingAddress(
      state,
      {
        payload,
      }: PayloadAction<{
        name: string;
        email: string;
        phone: string;
        address: string;
        postal_code: number;
        state: {id: number; label: string; value: number};
        city: {id: number; label: string; value: number};
        country: {id: number; label: string; value: number};
      }>,
    ) {
      state.shippingAddress = payload;
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

        if (action.payload.user.name && !state.shippingAddress.name) {
          state.shippingAddress.name = action.payload.user.name;
        }

        if (action.payload.user.email && !state.shippingAddress.email) {
          state.shippingAddress.email = action.payload.user.email;
        }

        if (action.payload.user.location && !state.shippingAddress.address) {
          state.shippingAddress.address = action.payload.user.location;
        }

        if (action.payload.user.phone && !state.shippingAddress.phone) {
          state.shippingAddress.phone = action.payload.user.phone.toString();
        }

        if (action.payload.user.state && !state.shippingAddress.state) {
          const {id, name} = action.payload.user.state;
          state.shippingAddress.state = {
            id,
            value: id,
            label: name,
          };
        }

        if (action.payload.user.city && !state.shippingAddress.city) {
          const {id, name} = action.payload.user.city;
          state.shippingAddress.city = {
            id,
            value: id,
            label: name,
          };
        }

        if (action.payload.user.country && !state.shippingAddress.country) {
          const {id, name} = action.payload.user.country;
          state.shippingAddress.country = {
            id,
            value: id,
            label: name,
          };
        }
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
      authApi.endpoints.socialLogin.matchFulfilled,
      (state, {payload}) => {
        if ("user" in payload) {
          state.token = payload.user.token;
          state.user = payload.user;
        }
      },
    );
  },
});

export const {setCredentials, setFirstTimeLoginFalse, addShippingAddress} =
  slice.actions;

export default slice.reducer;

export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;

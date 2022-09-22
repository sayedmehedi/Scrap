import {api} from "@data/laravel/services/api";
import notistackReducer from "./notistackReducer";
import authReducer from "@store/slices/authSlice";
import {combineReducers} from "@reduxjs/toolkit";
import authLoadingReducer from "@store/slices/authLoadingSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  notistack: notistackReducer,
  authLoading: authLoadingReducer,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;

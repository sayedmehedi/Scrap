import {notistackSlice} from "@store/slices/notistackSlice";
import {Middleware, MiddlewareAPI, isRejectedWithValue} from "@reduxjs/toolkit";

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => next => action => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      console.warn("We got a rejected action!", action.meta);
      const non_field_error = action.payload.data.non_field_error;

      if (!!non_field_error) {
        api.dispatch(
          notistackSlice.actions.enquerSnackbar({
            options: {
              type: "error",
              text1: action.payload.data.non_field_error,
            },
          }),
        );
      }
    }

    return next(action);
  };

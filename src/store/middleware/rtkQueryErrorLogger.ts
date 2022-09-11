import {notistackSlice} from "@store/slices/notistackSlice";
import {Middleware, MiddlewareAPI, isRejectedWithValue} from "@reduxjs/toolkit";
import {ToastShowParams} from "react-native-toast-message";

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => next => action => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      console.warn("We got a rejected action!", action.meta);
      const non_field_error: string = action.payload.data.non_field_error;

      const options: ToastShowParams = {
        type: "error",
      };

      if (non_field_error.length <= 15) {
        options.text1 = non_field_error;
      } else {
        options.text1 = "Error";
        options.text2 = non_field_error;
      }

      if (!!non_field_error) {
        api.dispatch(
          notistackSlice.actions.enquerSnackbar({
            options,
          }),
        );
      }
    }

    return next(action);
  };

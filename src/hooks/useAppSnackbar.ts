import React from "react";
import {useAppDispatch} from "./store";
import {ToastShowParams} from "react-native-toast-message";
import {notistackSlice} from "@store/slices/notistackSlice";

const useAppSnackbar = () => {
  const dispatch = useAppDispatch();
  const enqueueSnackbar = React.useCallback(
    (
      ...args: [
        {
          options?: ToastShowParams;
        },
      ]
    ) => dispatch(notistackSlice.actions.enquerSnackbar(...args)),
    [dispatch],
  );

  const closeSnackbar = (key?: string) =>
    dispatch(notistackSlice.actions.closeSnackbar(key));

  const enqueueErrorSnackbar = React.useCallback(
    (options: ToastShowParams) =>
      enqueueSnackbar({
        options: {
          type: "error",
          ...options,
        },
      }),
    [enqueueSnackbar],
  );

  const enqueueSuccessSnackbar = React.useCallback(
    (options: ToastShowParams) =>
      enqueueSnackbar({
        options: {
          type: "success",
          ...options,
        },
      }),
    [enqueueSnackbar],
  );

  const enqueueInfoSnackbar = React.useCallback(
    (options: ToastShowParams) =>
      enqueueSnackbar({
        options: {
          type: "info",
          ...options,
        },
      }),
    [enqueueSnackbar],
  );

  return {
    closeSnackbar,
    enqueueSnackbar,
    enqueueInfoSnackbar,
    enqueueErrorSnackbar,
    enqueueSuccessSnackbar,
  };
};

export default useAppSnackbar;
